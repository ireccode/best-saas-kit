'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  error: string | null
  setError: (error: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    let mounted = true
    let authSubscription: any = null
    let creditsSubscription: any = null

    const fetchUserData = async (sessionUserId: string) => {
      if (!mounted) return

      try {
        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUserId)
          .single()

        if (userError) throw userError

        // Get credits data
        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits')
          .select('credits')
          .eq('user_id', sessionUserId)
          .single()

        if (creditsError && creditsError.code !== 'PGRST116') {
          throw creditsError
        }

        if (userData && mounted) {
          const validUser: User = {
            id: userData.id,
            email: userData.email,
            credits: creditsData?.credits ?? 0,
            web_ui_enabled: userData.web_ui_enabled ?? false,
            role: userData.role ?? 'user',
            created_at: userData.created_at,
            updated_at: userData.updated_at
          }
          setUser(validUser)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        if (mounted) setError('Failed to load user data')
      }
    }

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user?.id || !mounted) {
          setUser(null)
          return
        }

        await fetchUserData(session.user.id)

        // Setup auth subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (!mounted) return

            if (!session?.user?.id) {
              setUser(null)
              router.push('/auth')
              return
            }

            await fetchUserData(session.user.id)
          }
        )

        authSubscription = subscription

        // Setup credits subscription
        if (session.user.id) {
          creditsSubscription = supabase
            .channel(`credits_changes_${session.user.id}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'user_credits',
                filter: `user_id=eq.${session.user.id}`
              },
              (payload) => {
                if (!mounted || !payload.new) return
                setUser(prev => prev ? {
                  ...prev,
                  //credits: payload.new.credits
                  credits:  0
                } : null)
              }
            )
            .subscribe()
        }
      } catch (error) {
        console.error('Error setting up auth:', error)
        if (mounted) setError('Error initializing auth')
      }
    }

    setupAuth()

    return () => {
      mounted = false
      if (authSubscription) authSubscription.unsubscribe()
      if (creditsSubscription) creditsSubscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <AuthContext.Provider value={{ user, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
