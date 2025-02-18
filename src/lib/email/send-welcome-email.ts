import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { sendEmailWithRetry } from './index';

export async function sendWelcomeEmail({
  to,
  username,
}: {
  to: string;
  username: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
  
  // Generate both HTML and plain text versions
  const emailHtml = render(WelcomeEmail({ username, loginUrl }));
  const emailText = `
Welcome to AI Assistant 4 Architect!

Hi ${username},

Thank you for signing up for AI Assistant 4 Architect. We're excited to have you on board!

AI Assistant 4 Architect is your intelligent partner for SAP architecture design and decision-making.
Our AI-powered platform helps you:

- Get instant, contextually aware SAP BTP architecture recommendations
- Access curated SAP architecture patterns and best practices
- Streamline your solution design process

Get started here: ${loginUrl}

If you have any questions, feel free to reply to this email. We're here to help!

Best regards,
The AI Assistant 4 Architect Team
  `.trim();

  try {
    console.log('Sending welcome email to:', to);
    
    const result = await sendEmailWithRetry({
      to,
      subject: 'Welcome to AI Assistant 4 Architect!',
      react: WelcomeEmail({ username, loginUrl }),
      text: emailText,
    });

    console.log('Welcome email sent successfully');
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
} 