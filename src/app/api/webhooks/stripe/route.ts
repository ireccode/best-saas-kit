import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(req: Request) {
  try {
    console.log('Webhook received')
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    // Verify webhook secret is configured
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      )
    }

    // Verify stripe signature
    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Webhook event received:', event.type, event.id)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout session:', {
          sessionId: session.id,
          customerId: session.customer,
          userId: session.metadata?.userId,
          subscriptionId: session.subscription
        })

        try {
          if (!session.metadata?.userId) {
            throw new Error('No userId found in session metadata')
          }

          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          console.log('Retrieved subscription:', {
            subscriptionId: subscription.id,
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            priceMetadata: subscription.items.data[0].price.metadata
          })

          // Add subscription to database
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('customer_subscriptions')
            .insert({
              user_id: session.metadata.userId,
              subscription_id: subscription.id,
              price_id: subscription.items.data[0].price.id,
              status: subscription.status,
              quantity: subscription.items.data[0].quantity,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000).toISOString()
                : null,
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
              ended_at: subscription.ended_at
                ? new Date(subscription.ended_at * 1000).toISOString()
                : null,
              trial_start: subscription.trial_start
                ? new Date(subscription.trial_start * 1000).toISOString()
                : null,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null
            })
            .select()
            .single()

          if (subscriptionError) {
            console.error('Error inserting subscription:', {
              error: subscriptionError,
              details: subscriptionError.details,
              hint: subscriptionError.hint
            })
            throw subscriptionError
          }

          console.log('Subscription inserted successfully:', subscriptionData)

          // Get credits from price metadata
          const credits = subscription.items.data[0].price.metadata.credits
            ? parseInt(subscription.items.data[0].price.metadata.credits)
            : 0

          console.log('Adding credits for user:', {
            userId: session.metadata.userId,
            credits: credits,
            priceMetadata: subscription.items.data[0].price.metadata
          })

          // First get current credits
          const { data: currentCredits, error: getCurrentError } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', session.metadata.userId)
            .single()

          if (getCurrentError && getCurrentError.code !== 'PGRST116') {
            console.error('Error getting current credits:', getCurrentError)
            throw getCurrentError
          }

          const existingCredits = currentCredits?.credits || 0
          const newTotalCredits = existingCredits + credits

          // Update user credits by adding new credits to existing ones
          const { data: creditsData, error: creditsError } = await supabase
            .from('user_credits')
            .upsert(
              {
                user_id: session.metadata.userId,
                credits: newTotalCredits,
                updated_at: new Date().toISOString()
              },
              {
                onConflict: 'user_id',
                ignoreDuplicates: false
              }
            )
            .select()
            .single()

          if (creditsError) {
            console.error('Error updating user credits:', {
              error: creditsError,
              details: creditsError.details,
              hint: creditsError.hint
            })
            throw creditsError
          }

          // Add billing history record
          const { error: billingError } = await supabase
            .from('billing_history')
            .insert({
              user_id: session.metadata.userId,
              subscription_id: subscriptionData.id,
              amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
              currency: session.currency || 'usd',
              status: 'succeeded',
              invoice_url: session.invoice_url || null
            })

          if (billingError) {
            console.error('Error inserting billing history:', billingError)
            // Don't throw - billing history is not critical
          }

          console.log('Credits updated successfully:', creditsData)
          console.log('Successfully processed checkout session:', session.id)
        } catch (error) {
          console.error('Error processing checkout session:', {
            error,
            sessionId: session.id,
            userId: session.metadata?.userId
          })
          // Don't throw error - let Stripe retry
          return NextResponse.json({ received: true })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Processing subscription update:', subscription.id)

        try {
          // First check if subscription exists
          const { data: existingSub, error: checkError } = await supabase
            .from('customer_subscriptions')
            .select('id')
            .eq('subscription_id', subscription.id)
            .single()

          if (checkError) {
            console.error('Error checking subscription:', checkError)
            // If no subscription found, don't update - it will be created by checkout.session.completed
            if (checkError.code === 'PGRST116') {
              console.log('Subscription not found - waiting for checkout.session.completed')
              return NextResponse.json({ received: true })
            }
            throw checkError
          }

          // Update subscription in database
          const { data: updateData, error: updateError } = await supabase
            .from('customer_subscriptions')
            .update({
              status: subscription.status,
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000).toISOString()
                : null,
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              ended_at: subscription.ended_at
                ? new Date(subscription.ended_at * 1000).toISOString()
                : null,
              trial_start: subscription.trial_start
                ? new Date(subscription.trial_start * 1000).toISOString()
                : null,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString()
            })
            .eq('subscription_id', subscription.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating subscription:', {
              error: updateError,
              details: updateError.details,
              hint: updateError.hint
            })
            throw updateError
          }

          console.log('Subscription updated successfully:', updateData)
        } catch (error) {
          console.error('Error processing subscription update:', {
            error,
            subscriptionId: subscription.id
          })
          // Don't throw error - let Stripe retry
          return NextResponse.json({ received: true })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Processing subscription deletion:', subscription.id)

        try {
          // Update subscription in database
          const { data: deleteData, error: deleteError } = await supabase
            .from('customer_subscriptions')
            .update({
              status: subscription.status,
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000).toISOString()
                : null,
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              created_at: new Date(subscription.created * 1000).toISOString(),
              ended_at: subscription.ended_at
                ? new Date(subscription.ended_at * 1000).toISOString()
                : null,
              trial_start: subscription.trial_start
                ? new Date(subscription.trial_start * 1000).toISOString()
                : null,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', subscription.id)
            .select()
            .single()

          if (deleteError) {
            console.error('Error updating deleted subscription:', {
              error: deleteError,
              details: deleteError.details,
              hint: deleteError.hint
            })
            throw deleteError
          }

          console.log('Subscription deletion processed:', deleteData)

          if (!subscription.metadata?.userId) {
            throw new Error('No userId found in subscription metadata')
          }

          // Reset user credits to 0
          const { data: creditsData, error: creditsError } = await supabase
            .from('user_credits')
            .upsert(
              {
                user_id: subscription.metadata.userId,
                credits: 0,
                updated_at: new Date().toISOString()
              },
              {
                onConflict: 'user_id',
                ignoreDuplicates: false
              }
            )
            .select()
            .single()

          if (creditsError) {
            console.error('Error resetting user credits:', {
              error: creditsError,
              details: creditsError.details,
              hint: creditsError.hint
            })
            throw creditsError
          }

          console.log('Credits reset successfully:', creditsData)
        } catch (error) {
          console.error('Error processing subscription deletion:', {
            error,
            subscriptionId: subscription.id
          })
          return NextResponse.json({ received: true })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}