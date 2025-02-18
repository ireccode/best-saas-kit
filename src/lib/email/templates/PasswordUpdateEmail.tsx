import * as React from 'react'
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { PasswordUpdateEmailProps } from '../index'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const PasswordUpdateEmail = ({
  username,
  updatedAt,
}: PasswordUpdateEmailProps) => {
  const previewText = 'Your AI Assistant 4 Architect password has been updated'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <img
              src={`${baseUrl}/images/logo.svg`}
              width="42"
              height="42"
              alt="AI Assistant 4 Architect"
            />
          </Section>
          
          <Heading style={heading}>Password Updated Successfully</Heading>
          
          <Text style={paragraph}>Hi {username},</Text>
          
          <Text style={paragraph}>
            This email confirms that your AI Assistant 4 Architect account password
            was changed on {new Date(updatedAt).toLocaleString()}.
          </Text>
          
          <Text style={paragraph}>
            If you did not make this change, please contact our support team
            immediately or reset your password using the button below.
          </Text>
          
          <Section style={buttonContainer}>
            <Link href={`${baseUrl}/auth/reset-password`} style={button}>
              Reset Password
            </Link>
          </Section>
          
          <Text style={paragraph}>
            For security reasons, we recommend:
          </Text>
          
          <ul style={list}>
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication if available</li>
            <li>Never sharing your password with anyone</li>
          </ul>
          
          <Text style={paragraph}>
            Best regards,<br />
            The AI Assistant 4 Architect Team
          </Text>
          
          <Text style={footer}>
            This is an automated message. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  padding: '60px 0',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
}

const logo = {
  marginBottom: '24px',
}

const heading = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '16px 0',
}

const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
}

const list = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
  paddingLeft: '24px',
}

const buttonContainer = {
  margin: '24px 0',
}

const button = {
  backgroundColor: '#FFBE1A',
  borderRadius: '4px',
  color: '#000000',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
}

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '24px 0 0',
}

export default PasswordUpdateEmail 