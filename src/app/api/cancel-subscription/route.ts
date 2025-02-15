import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subscriptionId } = body

    const supabase = createClientComponentClient()

    // Cancel the subscription at period end
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Update subscription in database
    await supabase
      .from('customer_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error canceling subscription:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error canceling subscription' },
      { status: 500 }
    )
  }
} 