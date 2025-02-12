import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/jwt'
import { verifyCredits, deductCredits } from '@/lib/credits'

// Validate webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
const REQUIRED_CREDITS = 2 // Increased credits for file analysis
const WEBHOOK_TIMEOUT = 930000 // 930 seconds
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

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

    const supabase = createRouteHandlerClient<{ public: { Tables: {} } }>({ cookies: () => cookies() })

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

    // Parse the multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const messages = formData.get('messages')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds limit (10MB)' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

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

    // Call n8n webhook with JWT and file data
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
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              content: base64
            },
            messages: messages ? JSON.parse(messages as string) : [],
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
        let errorResponse
        try {
          errorResponse = JSON.parse(errorText)
        } catch {
          errorResponse = { code: n8nResponse.status, message: errorText }
        }

        console.error('n8n error response:', errorResponse)
        
        if (errorResponse.code === 404) {
          return NextResponse.json(
            { error: 'AI service is temporarily unavailable. Please wait a moment and try again.' },
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

      // Get the output from the response
      let output = ''
      if (Array.isArray(data)) {
        const lastItem = data[data.length - 1]
        output = lastItem.response?.output || lastItem.output || ''
      } else if (typeof data === 'object') {
        output = data.response?.output || data.output || ''
      }

      // Deduct credits after successful n8n response
      try {
        await deductCredits(supabase, user.id, REQUIRED_CREDITS)
      } catch (error) {
        console.error('Error deducting credits:', error)
      }

      return NextResponse.json([{
        action: 'analyze_file',
        response: {
          output: output || 'No response received from the AI service',
          fileName: file.name
        }
      }])

    } catch (error) {
      console.error('n8n error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
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
    console.error('Error in file upload endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
