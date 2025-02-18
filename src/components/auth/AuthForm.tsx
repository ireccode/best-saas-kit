'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Database } from '@/types/supabase'
import { sendWelcomeEmail } from '@/lib/email/send-welcome-email'

interface AuthFormProps {
  view?: string
  onAuthSuccess?: (email: string, password: string) => void
  plan?: string | null
  callbackUrl?: string | null
  returnUrl?: string | null
}

export default function AuthForm({ 
  view: initialView, 
  onAuthSuccess, 
  plan: propPlan,
  callbackUrl,
  returnUrl 
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient<Database>()
  const isSignUp = initialView === 'sign-up'
  const plan = propPlan || searchParams.get('plan')

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return false
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl || `${window.location.origin}/auth/callback`,
            data: {
              web_ui_enabled: true,
              credits: 0,
              role: 'user'
            }
          }
        })

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.')
          } else {
            setError(signUpError.message)
          }
          return
        }

        if (!data.user?.id) {
          setError('Failed to create user account')
          return
        }

        try {
          // Create user record through API route
          const response = await fetch('/api/auth/create-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: email,
              credits: 0,
              web_ui_enabled: true,
              role: 'user'
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            console.error('Error creating user record:', error)
            // Don't block the sign-up process for DB errors
          }

          // Send welcome email
          try {
            await sendWelcomeEmail({
              to: email,
              username: email.split('@')[0], // Use email prefix as username
            })
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError)
            // Don't block the sign-up process for email errors
          }

          // Store credentials for auto-login after verification
          sessionStorage.setItem('tempAuthCredentials', JSON.stringify({ email, password }))
          
          // Store plan selection if coming from "Start For Free"
          if (plan === 'trial') {
            sessionStorage.setItem('selectedPlan', 'trial')
          }

          setMessage('Please check your email for the verification link.')
        } catch (dbError) {
          console.error('Database error:', dbError)
          // Don't block the sign-up process for DB errors
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Invalid email or password')
          } else {
            setError(signInError.message)
          }
          return
        }

        if (onAuthSuccess) {
          onAuthSuccess(email, password)
        } else if (returnUrl) {
          router.push(returnUrl)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-500 text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-[#FFBE1A] text-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#FFBE1A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBE1A] disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </div>
          ) : isSignUp ? (
            'Sign up'
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  )
}