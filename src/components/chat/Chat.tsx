'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import FileUpload from './FileUpload'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  initialMessages?: Message[]
}

export default function Chat({ initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      
      const userMessage = { role: 'user' as const, content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant' as const,
        content: data[0]?.response?.output || 'Sorry, I could not process your request.'
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('messages', JSON.stringify(messages))

      const userMessage = { 
        role: 'user' as const, 
        content: `Analyzing file: ${file.name}...`
      }
      setMessages(prev => [...prev, userMessage])

      const response = await fetch('/api/ai/chat/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze file')
      }

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant' as const,
        content: data[0]?.response?.output || 'Sorry, I could not analyze the file.'
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error uploading file:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-[#111111] rounded-lg border border-white/10">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/90'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div className="p-4 border-t border-white/10">
        <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
