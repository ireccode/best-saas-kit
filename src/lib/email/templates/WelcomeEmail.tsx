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
import { WelcomeEmailProps } from '../index'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const WelcomeEmail = ({
  username = '',
  loginUrl = `${baseUrl}/login`,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to AI Assistant 4 Architect!`

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
          
          <Heading style={heading}>Welcome to AI Assistant 4 Architect!</Heading>
          
          <Text style={paragraph}>Hi {username},</Text>
          
          <Text style={paragraph}>
            Thank you for signing up for AI Assistant 4 Architect. We're excited to have you on board!
          </Text>
          
          <Text style={paragraph}>
            AI Assistant 4 Architect is your intelligent partner for SAP architecture design and decision-making.
            Our AI-powered platform helps you:
          </Text>
          
          <ul style={list}>
            <li>Get instant, contextually aware SAP BTP architecture recommendations</li>
            <li>Access curated SAP architecture patterns and best practices</li>
            <li>Streamline your solution design process</li>
          </ul>
          
          <Section style={buttonContainer}>
            <Link href={loginUrl} style={button}>
              Get Started
            </Link>
          </Section>
          
          <Text style={paragraph}>
            If you have any questions, feel free to reply to this email. We're here to help!
          </Text>
          
          <Text style={paragraph}>
            Best regards,<br />
            The AI Assistant 4 Architect Team
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

export default WelcomeEmail 