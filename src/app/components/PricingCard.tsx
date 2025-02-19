'use client'

import { CheckIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingCardProps {
  name?: string
  price?: {
    monthly: number
    annually: number
  }
  description?: string
  features?: string[]
  buttonText?: string
  highlighted?: boolean
  priceId?: string
}

const PricingCard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isAnnual, setIsAnnual] = useState(false)

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // If not authenticated, redirect to login with return URL
        const returnUrl = '/dashboard/billing'
        router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`)
        return
      }

      // Create Stripe Checkout Session
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

      // Redirect to Stripe Checkout URL
      window.location.href = result.url
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process subscription')
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      name: 'Free Trial',
      price: { monthly: 0, annually: 0 },
      description: 'Perfect for exploring ArchitectAI capabilities',
      features: [
        'Limited features',
        '10 queries per month',
        'Basic architecture recommendations',
        'Community support',
      ],
      buttonText: 'Start Free Trial',
      priceId: 'price_1Qm627LqVp8miPvfxiCoHY4b',
      highlighted: true
    },
    {
      name: 'Professional',
      price: { monthly: 299, annually: 249 },
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
      highlighted: false
    },
    {
      name: 'Enterprise',
      price: { monthly: 999, annually: 899 },
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
      highlighted: false
    },
    {
      name: 'SAP BTP exam prep - Free Trial',
      price: { monthly: 0, annually: 0 },
      description: 'For organizations with complex needs',
      features: [
        'Unlimited queries',
        'Priority support',
        'Custom integrations',
        'Dedicated account manager',
        'Training and onboarding',
      ],
      buttonText: 'Free Trial',
      priceId: 'pprice_1Qu7jTLqVp8miPvfoxrkiKsz',
      popular: false
    }, 
    {
      name: 'SAP BTP exam prep - Premium',
      price: { monthly: 29.99, annually: 359.88 },
      description: 'For organizations with complex needs',
      features: [
        'Unlimited queries',
        'Priority support',
        'Custom integrations',
        'Dedicated account manager',
        'Training and onboarding',
      ],
      buttonText: 'Premium',
      priceId: 'price_1Qu7m3LqVp8miPvfinftcF94',
      popular: false
    }    
  ]

  return (  
    <div>
      <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10"
          >
            <span className="sr-only">Toggle billing period</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-[#FFBE1A] transition ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/60'}`}>
            Annually <span className="text-[#FFBE1A]">20% off</span>
          </span>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 ${
              plan.highlighted
                ? 'bg-gradient-to-b from-[#FFBE1A]/20 to-transparent border-[#FFBE1A]/20'
                : 'bg-white/5'
            } border border-white/10 relative`}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <h2 className="text-white/60 text-sm">{plan.description}</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">
                  ${isAnnual ? plan.price.annually : plan.price.monthly}
                </span>
                <span className="text-white/60 ml-2">/ month</span>
              </div>
              {isAnnual && (
                <div className="text-sm text-[#FFBE1A] mt-1">
                  Save ${(plan.price.monthly - plan.price.annually) * 12} a year
                </div>
              )}
            </div>

            <button
              onClick={() => handleSubscribe(plan.priceId)}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium mb-8 ${
                plan.highlighted
                  ? 'bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/90'
                  : 'bg-white/10 text-white hover:bg-white/20'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : plan.buttonText}
            </button>

            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-white/80">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-[#FFBE1A]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingCard 
