import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { priceId } = body

    if (!priceId) {
      return new NextResponse(
        JSON.stringify({ error: 'Price ID is required' }),
        { status: 400 }
      )
    }

    // Initialize Supabase client with cookies
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Get the user from the session
    const { data, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !data.session) {
      console.error('Session error:', sessionError)
      return new NextResponse(
        JSON.stringify({ error: 'Authentication error' }),
        { status: 401 }
      )
    }

    const session = data.session
    if (!session?.user) {
      console.error('No session or user found')
      return new NextResponse(
        JSON.stringify({ error: 'Please log in to continue' }),
        { status: 401 }
      )
    }

    const userId = session.user.id
    const customerEmail = session.user.email

    // Create or retrieve Stripe customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId: string

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId,
        },
      })
      customerId = customer.id

      await supabase.from('customers').insert({
        user_id: userId,
        stripe_customer_id: customerId,
      })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    })

    return new NextResponse(
      JSON.stringify({ url: checkoutSession.url }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Error creating checkout session' }),
      { status: 500 }
    )
  }
} 