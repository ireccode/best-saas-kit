import { renderAsync } from '@react-email/render';

// Email sender configuration
const EMAIL_FROM = 'AI Assistant 4 Architect <onboarding@resend.dev>';

// Error handling wrapper for email sending
export async function sendEmail({
  to,
  subject,
  react,
  text,
}: {
  to: string;
  subject: string;
  react: JSX.Element;
  text: string;
}) {
  try {
    console.log(`Attempting to send email to ${to}: ${subject}`);
    
    // Render React component to HTML string
    const html = await renderAsync(react);
    
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email API error:', result);
      throw new Error(result.details || result.error || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error instanceof Error ? error : new Error('Failed to send email');
  }
}

// Retry logic for email sending
export async function sendEmailWithRetry({
  to,
  subject,
  react,
  text,
  maxRetries = 3,
  delayMs = 1000,
}: {
  to: string;
  subject: string;
  react: JSX.Element;
  text: string;
  maxRetries?: number;
  delayMs?: number;
}) {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt}/${maxRetries}`);
      return await sendEmail({ to, subject, react, text });
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Waiting ${delayMs * attempt}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  console.error(`Failed to send email after ${maxRetries} attempts:`, lastError);
  throw lastError;
}

// Email template types
export interface WelcomeEmailProps {
  username: string;
  loginUrl: string;
}

export interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string;
}

export interface PasswordUpdateEmailProps {
  username: string;
  updatedAt: string;
} 