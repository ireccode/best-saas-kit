import { PasswordResetEmail } from './templates/PasswordResetEmail'
import { sendEmailWithRetry } from './index'
import { render } from '@react-email/render'

export async function sendPasswordResetEmail({
  to,
  resetToken,
  expiresIn = '1 hour',
}: {
  to: string
  resetToken: string
  expiresIn?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`
  
  // Generate both HTML and plain text versions
  const emailHtml = render(PasswordResetEmail({ resetUrl, expiresIn }))
  const emailText = `
Reset Your Password

We received a request to reset your password for your AI Assistant 4 Architect account.
To reset your password, click the following link:

${resetUrl}

This password reset link is only valid for ${expiresIn}.

If you didn't request a password reset, you can safely ignore this email.
Your password will remain unchanged.

For security reasons, this link will expire in ${expiresIn}. If you need
to reset your password after that, please request a new reset link.

Best regards,
The AI Assistant 4 Architect Team
  `.trim()

  try {
    console.log('Sending password reset email to:', to)
    
    const result = await sendEmailWithRetry({
      to,
      subject: 'Reset Your AI Assistant 4 Architect Password',
      react: PasswordResetEmail({ resetUrl, expiresIn }),
      text: emailText,
    })

    console.log('Password reset email sent successfully')
    return result
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
} 