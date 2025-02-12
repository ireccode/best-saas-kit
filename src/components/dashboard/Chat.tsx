'use client'

import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface N8nResponseItem {
  action: string
  response: {
    output: string
  }
  output?: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setRetryCount(0)

    const newMessages = [
      ...messages,
      { role: 'user', content: input.trim() } as Message
    ]

    setMessages(newMessages)
    setInput('')

    const makeRequest = async (retry = 0): Promise<any> => {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: newMessages,
          }),
        })

        const data = await response.json()

        // Handle service unavailable with exponential backoff
        if (response.status === 503 && retry < MAX_RETRIES) {
          const waitTime = Math.min(2000 * Math.pow(2, retry), 10000) // Cap at 10 seconds
          console.log(`Service unavailable, waiting ${waitTime}ms before retry ${retry + 1} of ${MAX_RETRIES}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          return makeRequest(retry + 1)
        }

        if (response.status === 202) {
          // Wait and retry for processing
          await new Promise(resolve => setTimeout(resolve, 2000))
          return makeRequest(retry)
        }

        if (!response.ok) {
          throw new Error(data.error || 'Error processing request')
        }

        // Validate n8n response format
        if (!Array.isArray(data) || !data[0] || data[0].action !== 'parse' || !data[0].response?.output) {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from AI service')
        }

        return data
      } catch (error: unknown) {
        if (retry < MAX_RETRIES && (
          error instanceof Error && (
          error.message.includes('temporarily unavailable') ||
          error.message.includes('service is processing') ||
          error.message.includes("Model output doesn't fit required format")
          )
        )) {
          const waitTime = Math.min(2000 * Math.pow(2, retry), 10000)
          console.log(`Error occurred, waiting ${waitTime}ms before retry ${retry + 1} of ${MAX_RETRIES}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          return makeRequest(retry + 1)
        }
        throw error
      }
    }

    try {
      const data = await makeRequest()
      // Get the last item from the array if multiple responses
      const n8nResponse = data[data.length - 1] as N8nResponseItem
      const assistantMessage = {
        role: 'assistant' as const,
        // Handle both response formats (output in response object or direct output property)
        content: n8nResponse.response?.output || n8nResponse.output || 'No response received'
      }

      setMessages([...newMessages, assistantMessage])
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Error sending message')
      // Remove the user message if all retries failed
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">AI Chat</h2>
        <p className="text-sm text-white/60">
          Each message costs 1 credit
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/40 mt-8">
            Start a conversation with AI
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-[#FFBE1A] text-black'
                    : 'bg-white/5 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 text-white rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 border-t border-white/5 bg-red-500/10">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#FFBE1A] text-black rounded-lg px-4 py-2 hover:bg-[#FFBE1A]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}