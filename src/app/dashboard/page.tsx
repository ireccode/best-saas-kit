'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Chat from '@/components/chat/Chat'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const controller = new AbortController()

    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && !controller.signal.aborted) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (data && !controller.signal.aborted) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfileData()

    return () => controller.abort()
  }, [supabase.auth])

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-white/60">
          Welcome to your dashboard
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welcome Section */}
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Getting Started
          </h2>
          <p className="text-white/60 mb-4">
            This is your AI-powered SAAS starter kit. You can use the chat interface
            to interact with AI and analyze files.
          </p>
          <ul className="space-y-2 text-white/60">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Each chat message costs 1 credit
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              File analysis costs 2 credits
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Supports common document formats up to 10MB
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Build your own AI apps using our API
            </li>
          </ul>
        </div>

        {/* Chat Interface */}
        <div className="lg:row-span-2">
          <Chat />
        </div>

        {/* Quick Links */}
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/dashboard/billing'}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <h3 className="font-medium text-white">Get Credits</h3>
              <p className="text-sm text-white/60">Purchase more credits</p>
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/profile'}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <h3 className="font-medium text-white">Profile</h3>
              <p className="text-sm text-white/60">Manage your account</p>
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/analytics'}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <h3 className="font-medium text-white">Analytics</h3>
              <p className="text-sm text-white/60">View your usage</p>
            </button>
            <button
              onClick={() => window.location.href = '/docs'}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <h3 className="font-medium text-white">Documentation</h3>
              <p className="text-sm text-white/60">Learn how to build</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 