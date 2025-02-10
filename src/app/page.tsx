'use client'

import Image from 'next/image'
import Link from 'next/link'
import ContactForm from '@/components/contact/ContactForm'
import Header from '@/components/Header'
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  BookOpenIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import PricingCard from './components/PricingCard'
import FaqItem from './components/FaqItem'
import TestimonialCard from './components/TestimonialCard'
import FeatureCard from './components/FeatureCard'

const features = [
  {
    icon: <CpuChipIcon className="w-6 h-6" />,
    title: 'AI-Powered Architecture',
    description: 'Leverage RAG-powered AI to streamline SAP architecture decisions.',
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    title: 'Rapid Solution Design',
    description: 'Get instant, contextually aware SAP BTP architecture recommendations.',
  },
  {
    icon: <BookOpenIcon className="w-6 h-6" />,
    title: 'Best Practices',
    description: 'Access curated SAP architecture patterns and best practices.',
  },
]

const pricingPlans = [
  {
    title: 'Free Trial',
    price: '0',
    description: 'Perfect for exploring ArchitectAI capabilities',
    features: [
      'Limited features',
      '10 queries per month',
      'Basic architecture recommendations',
      'Community support',
    ],
    buttonText: 'Start Free Trial',
    priceId: 'price_1Qm627LqVp8miPvfxiCoHY4b'
  },
  {
    title: 'Professional',
    price: '299',
    description: 'For professional SAP architects',
    features: [
      'Unlimited queries',
      'Detailed architecture designs',
      'Priority support',
      'Export capabilities',
      'Architecture history',
    ],
    buttonText: 'Get Started',
    priceId: 'price_1Qm5yDLqVp8miPvflz7kx3jW'
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with complex needs',
    features: [
      'Unlimited queries',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
      'Training and onboarding',
    ],
    buttonText: 'Contact Sales',
    priceId: 'price_enterprise'
  },
]

const faqs = [
  {
    question: 'What is included in the starter package?',
    answer: 'The starter package includes all essential features to get your project up and running, including basic analytics, community support, and API access.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can upgrade your plan at any time. Your new features will be available immediately after upgrading.',
  },
  {
    question: 'Do you offer custom development?',
    answer: 'Yes, our enterprise plan includes custom development options to meet your specific needs.',
  },
]

const testimonials = [
  {
    content: "This toolkit saved us months of development time. We launched our MVP in just 2 weeks!",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/placeholder.svg",
      title: "CTO at TechStart"
    },
    stats: [
      { label: "Time Saved", value: "3 months" },
      { label: "ROI", value: "300%" }
    ]
  },
  {
    content: "The code quality is exceptional. It's like having a senior developer on the team.",
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/placeholder.svg",
      title: "Lead Developer"
    }
  },
  {
    content: "Best investment we made for our startup. The support is amazing too!",
    author: {
      name: "Lisa Park",
      avatar: "/avatars/placeholder.svg",
      title: "Founder at AppLabs"
    }
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <Header />
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              ArchitectAI: Your Intelligent SAP Solution Design Partner
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Transform your SAP architecture process with AI-powered insights and recommendations
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth?view=sign-up&plan=trial"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Start For Free
              </Link>
              <Link
                href="/login?callbackUrl=%2Fauth%3Fview%3Dsign-in"
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Transform Your SAP Architecture Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How ArchitectAI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Describe Your Challenge
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Describe your business challenge or objective to the AI agent
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Receive Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Get instant, contextually aware SAP BTP architecture recommendations
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Implement Solutions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Implement the suggested solutions with detailed guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            AI Agent Workflow process
          </h2>
          <div className="grid grid-cols-1 grid-rows-2 gap-1 center max-w-4xl mx-auto">
            <Image src="/add2RAG.png" alt="add2RAG-Workflow" width={900} height={500} />
            <Image src="/getFromLocalRAG.png" alt="getFromLocalRAG-Workflow" width={900} height={500} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-white" >
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}            
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about our product? Need help getting started? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <EnvelopeIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium mb-1">Email</h4>
                    <a href="mailto:info@smartechall.com" className="text-gray-600 dark:text-gray-300 hover:text-[#FFBE1A]">
                      info@smartechall.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <PhoneIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium mb-1">Phone</h4>
                    <a href="tel:+1234567890" className="text-gray-600 dark:text-gray-300 hover:text-[#FFBE1A]">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium mb-1">Office</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Innovation Street<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="text-gray-900 dark:text-white font-medium mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#FFBE1A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#FFBE1A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#FFBE1A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                    </svg>
                  </a>
                  <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#FFBE1A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FQA Section */}
      <section id="faq" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">How accurate are the AI agent's recommendations?</h3>
                <p className="text-gray-600 dark:text-gray-300">The AI is trained on extensive SAP documentation and real-world scenarios, providing highly accurate insights. However, we recommend validating critical decisions with SAP experts.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Can the AI agent replace human SAP Solution Architects?</h3>
                <p className="text-gray-600 dark:text-gray-300">While highly capable, the AI agent is designed to augment human expertise, not replace it. It's an invaluable tool for quick insights and initial designs.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">How often is the AI agent's knowledge updated?</h3>
                <p className="text-gray-600 dark:text-gray-300">The AI agent is regularly updated with the latest SAP BTP developments and best practices to ensure current and relevant advice.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Is my company's data secure when using the AI agent?</h3>
                <p className="text-gray-600 dark:text-gray-300">We prioritize data security. All interactions are encrypted, and we do not store specific company information beyond the current session.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Can the AI agent provide custom code or configurations?</h3>
                <p className="text-gray-600 dark:text-gray-300">The AI provides high-level architecture and integration recommendations. For specific code or detailed configurations, you may need to consult with SAP developers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="/changelog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link 
                  href="https://github.com/zainulabedeen123/best-saas-kit/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Community
                </Link></li>
                <li><Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Help Center</Link></li>
                <li><Link href="/status" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Status</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="https://twitter.com" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Twitter</Link></li>
                <li><Link href="https://github.com/zainulabedeen123/best-saas-kit" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">GitHub</Link></li>
                <li><Link href="https://discord.com" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Discord</Link></li>
                <li><Link href="/newsletter" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Newsletter</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
