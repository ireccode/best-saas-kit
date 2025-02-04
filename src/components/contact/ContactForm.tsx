'use client'

import { useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setFormStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      })
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      })
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/[0.02] rounded-2xl p-8 border border-white/5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {formStatus && (
          <div className={`p-4 rounded-lg ${formStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {formStatus.message}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-black mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-black mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
            placeholder="john@example.com"
            required
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
            Message *
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
            placeholder="Your message..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FFBE1A] text-black font-medium py-3 px-4 rounded-lg hover:bg-[#FFBE1A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
