'use client'

import Image from 'next/image'
import Link from 'next/link'
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
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 bg-gradient-to-r from-blue-50 to-white animate-fade-in">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ArchitectAI: Your Intelligent SAP Solution Design Partner
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your SAP architecture process with AI-powered insights and recommendations
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="btn-primary"
              >
                Start Free Trial
              </Link>
              <Link
                href="#how-it-works"
                className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Transform Your SAP Architecture Process
          </h2>
          <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="text-[#0052CC] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">How ArchitectAI Works</h2>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 text-center md:text-left">
                        <div className="relative">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Describe Your Challenge</h3>
                        <p className="text-gray-600">Describe your business challenge or objective to the AI agent</p>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="relative">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Receive Recommendations</h3>
                        <p className="text-gray-600">Receive tailored SAP BTP solution architecture recommendations and insights</p>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="relative">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Implement Solutions</h3>
                        <p className="text-gray-600">Implement the suggested solutions or consult further for detailed guidance</p>
                    </div>
                </div>
            </div>
        </div>
      </section>      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="feature-card text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price === 'Custom' ? (
                    <span>Custom</span>
                  ) : (
                    <>
                      <span>$</span>
                      <span>{plan.price}</span>
                      {plan.price !== '0' && <span className="text-lg">/mo</span>}
                    </>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center text-gray-600">
                      <svg className="w-5 h-5 text-[#0052CC] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.title === 'Enterprise' ? '/contact' : '/auth/sign-up'}
                  className="btn-primary block w-full text-center"
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-black/60 max-w-2xl mx-auto">
              Have questions about our product? Need help getting started? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Contact Information</h3>
                <p className="text-black/60 mb-6">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <EnvelopeIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-black font-medium mb-1">Email</h4>
                    <a href="mailto:contact@example.com" className="text-black/60 hover:text-[#FFBE1A]">
                      contact@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <PhoneIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-black font-medium mb-1">Phone</h4>
                    <a href="tel:+1234567890" className="text-black/60 hover:text-[#FFBE1A]">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-[#FFBE1A]" />
                  </div>
                  <div>
                    <h4 className="text-black font-medium mb-1">Office</h4>
                    <p className="text-black/60">
                      123 Innovation Street<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="text-black font-medium mb-4">Follow Us</h4>
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
            <div className="bg-white/[0.02] rounded-2xl p-8 border border-white/5">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-black mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-black mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFBE1A]/50 focus:border-[#FFBE1A] text-black placeholder-white/40"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#FFBE1A] text-black font-medium rounded-lg hover:bg-[#FFBE1A]/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FQA Section */}
      <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                  <div className="space-y-6">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">How accurate are the AI agent's recommendations?</h3>
                          <p className="text-gray-600">The AI is trained on extensive SAP documentation and real-world scenarios, providing highly accurate insights. However, we recommend validating critical decisions with SAP experts.</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">Can the AI agent replace human SAP Solution Architects?</h3>
                          <p className="text-gray-600">While highly capable, the AI agent is designed to augment human expertise, not replace it. It's an invaluable tool for quick insights and initial designs.</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">How often is the AI agent's knowledge updated?</h3>
                          <p className="text-gray-600">The AI agent is regularly updated with the latest SAP BTP developments and best practices to ensure current and relevant advice.</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">Is my company's data secure when using the AI agent?</h3>
                          <p className="text-gray-600">We prioritize data security. All interactions are encrypted, and we do not store specific company information beyond the current session.</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">Can the AI agent provide custom code or configurations?</h3>
                          <p className="text-gray-600">The AI provides high-level architecture and integration recommendations. For specific code or detailed configurations, you may need to consult with SAP developers.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0052CC&color=fff" alt="Sarah Johnson" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">CTO of TechInnovate Inc.</p>
                </div>
              </div>
              <p className="text-gray-600">"As an ex-SAP Solution Architect, I'm amazed at how accurately this AI agent captures the nuances of SAP BTP architecture. It's like having an experienced colleague available 24/7."</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://ui-avatars.com/api/?name=Michael+Chen&background=0052CC&color=fff" alt="Michael Chen" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Michael Chen</h4>
                  <p className="text-gray-600">Lead Architect at GlobalSolutions Corp.</p>
                </div>
              </div>
              <p className="text-gray-600">"The AI agent's ability to quickly provide SAP BTP integration strategies saved us months of planning. It's an invaluable tool for any SAP professional."</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://ui-avatars.com/api/?name=Emma+Rodriguez&background=0052CC&color=fff" alt="Emma Rodriguez" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Emma Rodriguez</h4>
                  <p className="text-gray-600">SAP Practice Lead at ConsultEx</p>
                </div>
              </div>
              <p className="text-gray-600">"I was skeptical at first, but the depth of knowledge this AI agent possesses about SAP BTP is truly impressive. It's become an essential part of our solution design process."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-black/70 hover:text-black">Features</Link></li>
                <li><Link href="/pricing" className="text-black/70 hover:text-black">Pricing</Link></li>
                <li><Link href="/docs" className="text-black/70 hover:text-black">Documentation</Link></li>
                <li><Link href="/changelog" className="text-black/70 hover:text-black">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-black/70 hover:text-black">About</Link></li>
                <li><Link href="/blog" className="text-black/70 hover:text-black">Blog</Link></li>
                <li><Link href="/careers" className="text-black/70 hover:text-black">Careers</Link></li>
                <li><Link href="/contact" className="text-black/70 hover:text-black">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link 
                  href="https://github.com/zainulabedeen123/best-saas-kit/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black/70 hover:text-black"
                >
                  Community
                </Link></li>
                <li><Link href="/help" className="text-black/70 hover:text-black">Help Center</Link></li>
                <li><Link href="/status" className="text-black/70 hover:text-black">Status</Link></li>
                <li><Link href="/terms" className="text-black/70 hover:text-black">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="https://twitter.com" className="text-black/70 hover:text-black">Twitter</Link></li>
                <li><Link href="https://github.com/zainulabedeen123/best-saas-kit" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black">GitHub</Link></li>
                <li><Link href="https://discord.com" className="text-black/70 hover:text-black">Discord</Link></li>
                <li><Link href="/newsletter" className="text-black/70 hover:text-black">Newsletter</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
