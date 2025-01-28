import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ArchitectAI - Your Intelligent SAP Solution Design Partner',
  description: 'Transform your SAP architecture process with AI-powered insights and recommendations. Get instant, contextually aware SAP BTP architecture recommendations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
