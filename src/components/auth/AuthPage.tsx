'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthForm from './AuthForm'
import Link from 'next/link'
import Image from 'next/image'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState('sign-in')
  const [mounted, setMounted] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setMounted(true)
    const viewParam = searchParams.get('view')
    const planParam = searchParams.get('plan')
    
    if (viewParam) {
      setView(viewParam)
    }

    // Store plan selection if coming from "Start For Free"
    if (planParam === 'trial' && viewParam === 'sign-up') {
      sessionStorage.setItem('selectedPlan', 'trial')
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // If user has selected a trial plan, redirect to pricing
        if (sessionStorage.getItem('selectedPlan') === 'trial') {
          sessionStorage.removeItem('selectedPlan')
          router.push('/pricing?plan=trial')
        } else {
          router.push('/dashboard')
        }
      }
    }

    checkUser()
  }, [router, searchParams, supabase.auth])

  const handleAuthSuccess = async (email: string, password: string) => {
    // Store credentials temporarily
    sessionStorage.setItem('tempAuthCredentials', JSON.stringify({ email, password }))
    
    if (view === 'sign-up') {
      // For sign-up, show verification message
      // The form will handle the message display
    } else {
      // For sign-in, redirect to appropriate page
      if (sessionStorage.getItem('selectedPlan') === 'trial') {
        router.push('/pricing?plan=trial')
      } else {
        router.push('/dashboard')
      }
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand Name */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.svg"
                alt="AI Assistant 4 Architect Logo"
                width={32}
                height={32}
                className="h-8 w-auto dark:invert"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Assistant 4 Architect
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link href="/features" className="text-white/60 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/docs" className="text-white/60 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link 
                href={view === 'sign-in' ? '/auth?view=sign-up' : '/login?callbackUrl=%2Fdashboard'} 
                className="text-[#FFBE1A] hover:text-[#FFBE1A]/80 transition-colors"
              >
                {view === 'sign-in' ? 'Sign up' : 'Sign in'}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col pt-20">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-2xl font-semibold text-white text-center">
              {view === 'sign-up' ? 'Create your account' : 'Sign in to your account'}
            </h2>
            
            <AuthForm view={view} onAuthSuccess={handleAuthSuccess} />

            <div className="text-center">
              <Link
                href={view === 'sign-in' ? '/auth?view=sign-up' : '/auth?view=sign-in'}
                className="text-[#FFBE1A] hover:text-[#FFBE1A]/80 text-sm font-medium"
              >
                {view === 'sign-in' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}