import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: 'info@smartechall.com',
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> ${email}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }

    // Verify SMTP configuration
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER?.substring(0, 3) + '...', // Log partial for security
      from: process.env.SMTP_FROM?.substring(0, 3) + '...'
    })

    // Send email
    try {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
      
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)

      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      )
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError)
      throw new Error(`SMTP Error: ${smtpError.message}`)
    }
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}
