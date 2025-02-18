import { PasswordUpdateEmail } from './templates/PasswordUpdateEmail'
import { sendEmailWithRetry } from './index'
import { render } from '@react-email/render'

export async function sendPasswordUpdateEmail({
  to,
  username,
  updatedAt = new Date().toISOString(),
}: {
  to: string
  username: string
  updatedAt?: string
}) {
  // Generate both HTML and plain text versions
  const emailHtml = render(PasswordUpdateEmail({ username, updatedAt }))
  const emailText = `
Password Updated Successfully

Hi ${username},

This email confirms that your AI Assistant 4 Architect account password
was changed on ${new Date(updatedAt).toLocaleString()}.

If you did not make this change, please contact our support team
immediately or visit the following link to reset your password:

${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password

For security reasons, we recommend:
- Using a strong, unique password
- Enabling two-factor authentication if available
- Never sharing your password with anyone

Best regards,
The AI Assistant 4 Architect Team

This is an automated message. Please do not reply to this email.
  `.trim()

  try {
    console.log('Sending password update confirmation email to:', to)
    
    const result = await sendEmailWithRetry({
      to,
      subject: 'Your AI Assistant 4 Architect Password Has Been Updated',
      react: PasswordUpdateEmail({ username, updatedAt }),
      text: emailText,
    })

    console.log('Password update confirmation email sent successfully')
    return result
  } catch (error) {
    console.error('Failed to send password update confirmation email:', error)
    throw error
  }
} 