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
import { PasswordResetEmailProps } from '../index'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const PasswordResetEmail = ({
  resetUrl,
  expiresIn = '1 hour',
}: PasswordResetEmailProps) => {
  const previewText = 'Reset your AI Assistant 4 Architect password'

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
          
          <Heading style={heading}>Reset Your Password</Heading>
          
          <Text style={paragraph}>
            We received a request to reset your password for your AI Assistant 4 Architect account.
            Click the button below to reset it.
          </Text>
          
          <Text style={paragraph}>
            This password reset link is only valid for {expiresIn}.
          </Text>
          
          <Section style={buttonContainer}>
            <Link href={resetUrl} style={button}>
              Reset Password
            </Link>
          </Section>
          
          <Text style={paragraph}>
            If you didn't request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
          </Text>
          
          <Text style={paragraph}>
            For security reasons, this link will expire in {expiresIn}. If you need
            to reset your password after that, please request a new reset link.
          </Text>
          
          <Text style={paragraph}>
            Best regards,<br />
            The AI Assistant 4 Architect Team
          </Text>
          
          <Text style={footer}>
            If you're having trouble clicking the button, copy and paste this URL
            into your web browser: {resetUrl}
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

export default PasswordResetEmail 