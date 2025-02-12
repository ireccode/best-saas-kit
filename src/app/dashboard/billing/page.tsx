'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { loadStripe } from '@stripe/stripe-js'
import {
  CreditCardIcon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Define pricing plans
interface PricingPlan {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  priceId: string
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    title: 'Free Trial',
    price: '0',
    description: 'Perfect for exploring ArchitectAI capabilities',
    features: [
      'Limited features',
      '10 queries per month',
      'Basic architecture recommendations',
      'Community support',
    ],
    buttonText: 'Start Free Trial',
    priceId: 'price_1Qm627LqVp8miPvfxiCoHY4b',
    popular: false
  },
  {
    title: 'Professional',
    price: '299',
    description: 'For professional SAP architects',
    features: [
      'Unlimited queries',
      'Detailed architecture designs',
      'Priority support',
      'Export capabilities',
      'Architecture history',
    ],
    buttonText: 'Get Started',
    priceId: 'price_1Qm5yDLqVp8miPvflz7kx3jW',
    popular: true
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with complex needs',
    features: [
      'Unlimited queries',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
      'Training and onboarding',
    ],
    buttonText: 'Contact Sales',
    priceId: 'price_enterprise',
    popular: false
  },
]

interface Subscription {
  id: string
  subscription_id: string
  price_id: string
  status: string
  current_period_end: string
  cancel_at_period_end: boolean
}

interface BillingHistory {
  id: string
  amount: number
  currency: string
  status: string
  invoice_url: string
  created_at: string
}

export default function BillingPage() {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)

      // Moved fetchBillingData logic inside useCallback
      try {
        // Fetch current subscription
        const { data: subscription, error: subError } = await supabase
          .from('customer_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle()

        if (subError) {
          // Only log real errors, not "no rows returned"
          if (subError.code !== 'PGRST116') {
            console.error('Error fetching subscription:', subError)
            setError('Error loading subscription data')
          } else {
            // No active subscription found - this is normal for new users
            console.log('No active subscription found')
            setCurrentSubscription(null)
          }
        } else {
          setCurrentSubscription(subscription)
        }

        // Fetch billing history
        const { data: history, error: historyError } = await supabase
          .from('billing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (historyError) {
          // Only log real errors, not "no rows returned"
          if (historyError.code !== 'PGRST116') {
            console.error('Error fetching billing history:', historyError)
            setError('Error loading billing history')
          } else {
            console.log('No billing history found')
            setBillingHistory([])
          }
        } else {
          setBillingHistory(history || [])
        }
      } catch (err) {
        console.error('Error fetching billing data:', err)
        setError('Failed to load billing information')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setError('Authentication error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [supabase, router, setUser, setCurrentSubscription, setBillingHistory, setError, setIsLoading])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  async function handleSubscribe(priceId: string) {
    try {
      setError(null)
      
      if (!user) {
        setError('Please log in to continue')
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process subscription')
    }
  }

  async function handleCancelSubscription() {
    if (!currentSubscription?.id) return

    try {
      setError(null)
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      // Refresh billing data
      await checkUser()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          Please log in to access billing information
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="mt-2 text-white/60">
          Manage your subscription and billing information
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-[#111111] rounded-2xl p-8 border border-white/5">
        <h2 className="text-xl font-semibold text-white mb-6">Current Plan</h2>
        {currentSubscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {pricingPlans.find(plan => plan.priceId === currentSubscription.price_id)?.title || 'Unknown Plan'}
                </h3>
                <p className="text-white/60">
                  ${pricingPlans.find(plan => plan.priceId === currentSubscription.price_id)?.price || '0'}/month
                </p>
              </div>
              {currentSubscription.cancel_at_period_end ? (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                  Cancels at period end
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                  Active
                </span>
              )}
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center text-sm text-white/60">
                <ClockIcon className="w-4 h-4 mr-2" />
                Next billing date:{' '}
                {new Date(currentSubscription.current_period_end).toLocaleDateString()}
              </div>
            </div>
            {!currentSubscription.cancel_at_period_end && (
              <button
                onClick={handleCancelSubscription}
                className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        ) : (
          <p className="text-white/60">No active subscription</p>
        )}
      </div>

      {/* Available Plans */}
      <div className="bg-[#111111] rounded-2xl p-8 border border-white/5">
        <h2 className="text-xl font-semibold text-white mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-green-500">
          {pricingPlans.map((plan) => (
            <div
              key={plan.priceId}
              className={`rounded-lg p-8 ${
                plan.popular
                  ? 'bg-green-900/20 border-2 border-green-500'
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 text-white">{plan.title}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={currentSubscription?.price_id === plan.priceId}
                className={`w-full text-center py-3 px-6 rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-green-500 hover:bg-green-600 text-black'
                    : 'bg-white hover:bg-gray-200 text-black'
                } disabled:opacity-50`}
              >
                {currentSubscription?.price_id === plan.priceId ? 'Current Plan' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-[#111111] rounded-2xl p-8 border border-white/5">
        <h2 className="text-xl font-semibold text-white mb-6">Billing History</h2>
        {billingHistory.length > 0 ? (
          <div className="space-y-4">
            {billingHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center">
                  <CreditCardIcon className="w-8 h-8 text-white/20 mr-4" />
                  <div>
                    <p className="text-white font-medium">
                      ${item.amount} {item.currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'succeeded'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.invoice_url && (
                    <a
                      href={item.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFBE1A] hover:underline"
                    >
                      View Invoice
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60">No billing history available</p>
        )}
      </div>
    </div>
  )
} 