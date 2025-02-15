'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthForm from './AuthForm'
import Link from 'next/link'
import Image from 'next/image'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState('sign-in')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Get URL parameters
  const viewParam = searchParams?.get('view')
  const planParam = searchParams?.get('plan')
  const callbackUrl = searchParams?.get('callbackUrl')
  const returnUrl = searchParams?.get('returnUrl')

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (session) {
        // Determine redirect URL based on priority
        let redirectTo = '/dashboard'

        if (planParam === 'trial') {
          redirectTo = '/pricing?plan=trial'
        } else if (returnUrl && !returnUrl.startsWith('/auth') && !returnUrl.startsWith('/login')) {
          redirectTo = returnUrl
        } else if (callbackUrl && !callbackUrl.startsWith('/auth') && !callbackUrl.startsWith('/login')) {
          redirectTo = callbackUrl
        }

        router.push(redirectTo)
      }
    } catch (error) {
      console.error('Session check error:', error)
      setError('Failed to verify authentication status')
    } finally {
      setIsLoading(false)
    }
  }, [supabase.auth, router, planParam, returnUrl, callbackUrl])

  useEffect(() => {
    // Set the view based on URL parameter
    if (viewParam && (viewParam === 'sign-in' || viewParam === 'sign-up')) {
      setView(viewParam)
    }

    // Check user session
    checkUser()
  }, [viewParam, checkUser])

  const handleAuthSuccess = useCallback(async (email: string, password: string) => {
    try {
      // Store credentials temporarily for auto-login
      sessionStorage.setItem('tempAuthCredentials', JSON.stringify({ email, password }))
      
      // Store trial plan selection if applicable
      if (planParam === 'trial' && view === 'sign-up') {
        sessionStorage.setItem('selectedPlan', 'trial')
      }

      // Determine redirect URL
      let redirectTo = '/dashboard'

      if (view === 'sign-up') {
        if (planParam === 'trial') {
          redirectTo = '/pricing?plan=trial'
        }
      } else {
        if (returnUrl && !returnUrl.startsWith('/auth') && !returnUrl.startsWith('/login')) {
          redirectTo = returnUrl
        } else if (callbackUrl && !callbackUrl.startsWith('/auth') && !callbackUrl.startsWith('/login')) {
          redirectTo = callbackUrl
        }
      }

      router.push(redirectTo)
    } catch (error) {
      console.error('Auth success handling error:', error)
      setError('Failed to complete authentication process')
    }
  }, [router, view, planParam, returnUrl, callbackUrl])

  if (isLoading) {
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
                href={view === 'sign-in' ? `/auth?view=sign-up${planParam ? `&plan=${planParam}` : ''}` : '/login'} 
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
            
            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <AuthForm 
              view={view} 
              onAuthSuccess={handleAuthSuccess}
              plan={planParam}
              callbackUrl={callbackUrl}
              returnUrl={returnUrl}
            />

            <div className="text-center">
              <Link
                href={`/auth?view=${view === 'sign-in' ? 'sign-up' : 'sign-in'}${planParam ? `&plan=${planParam}` : ''}`}
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