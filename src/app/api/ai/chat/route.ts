import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/jwt'
import { verifyCredits, deductCredits } from '@/lib/credits'

// Validate webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://smartechall.app.n8n.cloud/webhook-test/8982df3e-aa27-4489-ad0f-f62c65e25abe'
const REQUIRED_CREDITS = 1
const WEBHOOK_TIMEOUT = 930000 // 930 seconds

interface N8nResponseItem {
  action: string
  response: {
    output: string
  }
}

interface N8nErrorResponse {
  code: number
  message: string
}

export async function POST(req: Request) {
  try {
    // Validate webhook URL
    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL not configured')
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Parse request body before any async operations
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify credits
    let userCredits
    try {
      userCredits = await verifyCredits(supabase, user.id, REQUIRED_CREDITS)
    } catch (error) {
      console.error('Error verifying credits:', error)
      if (error instanceof Error && error.message === 'Insufficient credits') {
        return NextResponse.json(
          { error: 'Insufficient credits' },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: 'Error checking credits' },
        { status: 500 }
      )
    }

    // Generate JWT for n8n
    let token: string
    try {
      token = generateToken(user.id, userCredits.credits)
    } catch (error) {
      console.error('Error generating token:', error)
      return NextResponse.json(
        { error: 'Error generating token' },
        { status: 500 }
      )
    }

    // Call n8n webhook with JWT
    let n8nResponse: Response
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT)

      try {
        n8nResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            messages,
            userId: user.id,
            timestamp: new Date().toISOString()
          }),
          signal: controller.signal
        })
      } finally {
        clearTimeout(timeoutId)
      }

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        let errorResponse: N8nErrorResponse
        try {
          errorResponse = JSON.parse(errorText)
        } catch {
          errorResponse = { code: n8nResponse.status, message: errorText }
        }

        console.error('n8n error response:', errorResponse)
        
        // Handle specific n8n error cases
        if (errorResponse.code === 404 && errorResponse.message.includes('webhook')) {
          return NextResponse.json(
            { error: 'AI service is temporarily unavailable. Please wait a moment and try again.' },
            { status: 503 }
          )
        }

        if (errorResponse.message.includes('Workflow could not be started')) {
          return NextResponse.json(
            { error: 'AI service temporarily unavailable. Please try again in a few minutes.' },
            { status: 503 }
          )
        }

        throw new Error(JSON.stringify(errorResponse))
      }

      const data = await n8nResponse.json()
      console.log('Raw n8n response:', JSON.stringify(data, null, 2))

      // Check for explicit error response
      if (data.error) {
        console.error('n8n returned error:', data.error)
        return NextResponse.json(
          { error: 'The AI service encountered an error. Please try again.' },
          { status: 500 }
        )
      }

      // Get the output from the response, handling both array and single object formats
      let output = ''
      if (Array.isArray(data)) {
        // Get the last item if it's an array
        const lastItem = data[data.length - 1]
        output = lastItem.response?.output || lastItem.output || ''
      } else if (typeof data === 'object') {
        // Handle single object response
        output = data.response?.output || data.output || ''
      }

      // Return consistent format
      const formattedData = [{
        action: 'parse',
        response: {
          output: output || 'No response received from the AI service'
        }
      }]

      // Deduct credits only after successful n8n response
      try {
        await deductCredits(supabase, user.id, REQUIRED_CREDITS)
      } catch (error) {
        console.error('Error deducting credits:', error)
        // Log this error but don't fail the request since n8n already processed it
      }

      return NextResponse.json(formattedData)
    } catch (error) {
      console.error('n8n error:', error)
      
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the AI service is taking too long to respond' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error processing request. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}