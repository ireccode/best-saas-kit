import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { generateToken } from '@/lib/jwt'
import { verifyCredits, deductCredits } from '@/lib/credits'

// Validate webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://smartechall.app.n8n.cloud/webhook-test/8982df3e-aa27-4489-ad0f-f62c65e25abe'
const REQUIRED_CREDITS = 1
const REQUEST_TIMEOUT = 30000 // 30 seconds

interface ChatMessage {
  role: string
  content: string
}

interface ChatResponse {
  messages: ChatMessage[]
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    // Validate webhook URL
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured')
      return new NextResponse(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500 }
      )
    }

    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookies() })
    
    // Parse request body before any async operations
    const { messages } = await req.json()
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400 }
      )
    }

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    // Verify credits
    let userCredits
    try {
      userCredits = await verifyCredits(supabase, session.user.id, REQUIRED_CREDITS)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      if (errorMessage === 'Insufficient credits') {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient credits' }),
          { status: 403 }
        )
      }
      return new NextResponse(
        JSON.stringify({ error: 'Error checking credits' }),
        { status: 500 }
      )
    }

    // Generate JWT for n8n
    let token: string
    try {
      token = generateToken(session.user.id, userCredits.credits)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return new NextResponse(
        JSON.stringify({ error: errorMessage }),
        { status: 500 }
      )
    }

    // Set up request timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      // Make request to n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages,
          userId: session.user.id,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!response.ok) {
        let errorResponse
        try {
          errorResponse = await response.json()
        } catch {
          errorResponse = { message: 'Unknown error' }
        }
        
        // Handle specific n8n error cases
        if (errorResponse.code === 404 && errorResponse.message.includes('webhook')) {
          return new NextResponse(
            JSON.stringify({ error: 'AI service is temporarily unavailable. Please wait a moment and try again.' }),
            { status: 503 }
          )
        }

        if (errorResponse.message.includes('Workflow could not be started')) {
          return new NextResponse(
            JSON.stringify({ error: 'AI service temporarily unavailable. Please try again in a few minutes.' }),
            { status: 503 }
          )
        }

        throw new Error(errorResponse.message || 'Unknown error')
      }

      const data: ChatResponse = await response.json()

      // Check for explicit error response
      if (data.error) {
        console.error('n8n returned error:', data.error)
        return new NextResponse(
          JSON.stringify({ error: 'The AI service encountered an error. Please try again.' }),
          { status: 500 }
        )
      }

      // Format the response
      const formattedData = {
        messages: data.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }

      // Deduct credits only after successful n8n response
      try {
        await deductCredits(supabase, session.user.id, REQUIRED_CREDITS)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        console.error('Error deducting credits:', errorMessage)
        // Log this error but don't fail the request since n8n already processed it
      }

      return new NextResponse(
        JSON.stringify(formattedData),
        { status: 200 }
      )

    } catch (error) {
      clearTimeout(timeout)
      console.error('n8n error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        return new NextResponse(
          JSON.stringify({ error: 'Request timeout - the AI service is taking too long to respond' }),
          { status: 504 }
        )
      }

      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return new NextResponse(
        JSON.stringify({ error: errorMessage }),
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new NextResponse(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    )
  }
}