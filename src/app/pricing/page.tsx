'use client'

import { useState } from 'react'
import Link from 'next/link'
import PricingCard from '../components/PricingCard'
import { CheckIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'



export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Header Section */}
      <Header />
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the plan that best fits your needs
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-16">
          <PricingCard /> 
      </div>
    </div>
  )
} 