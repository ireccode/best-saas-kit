import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { generateOpenWebUIToken } from '@/utils/jwt'
import { User } from '@/types/user'

// Initialize Supabase admin client
const adminClient = createRouteHandlerClient<Database>({
  cookies
}, {
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY
})

export async function GET() {
  try {
    console.log('Fetching session...')
    const { data: { session }, error: sessionError } = await adminClient.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return new NextResponse(
        JSON.stringify({ error: 'Session error' }),
        { status: 401 }
      )
    }

    if (!session?.user) {
      console.log('No session found')
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401 }
      )
    }

    console.log('Fetching user data...')
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('User data error:', userError)
      return new NextResponse(
        JSON.stringify({ error: 'Error fetching user data' }),
        { status: 500 }
      )
    }

    if (!userData) {
      console.error('No user data found')
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      )
    }

    console.log('User data found:', { ...userData, id: '[REDACTED]' })
    
    const user: User = {
      id: userData.id,
      email: userData.email,
      credits: userData.credits || 0,
      web_ui_enabled: userData.web_ui_enabled || false,
      role: userData.role || 'user'
    }

    console.log('Generating token...')
    const token = generateOpenWebUIToken(user)

    return new NextResponse(
      JSON.stringify({ 
        token,
        debug: {
          webUIUrl: process.env.NEXT_PUBLIC_OPENWEBUI_URL,
          hasJwtSecret: !!process.env.JWT_SECRET_OPENWEBUI
        }
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error generating token:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new NextResponse(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
