import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's default domain for sending
const EMAIL_FROM = 'AI Assistant 4 Architect <onboarding@resend.dev>';

export async function POST(req: Request) {
  try {
    const { to, subject, html, text } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured', details: 'Missing RESEND_API_KEY' },
        { status: 500 }
      );
    }

    console.log(`Attempting to send email to ${to}: ${subject}`);
    console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);
    
    try {
      const { data, error } = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
        text,
      });

      if (error) {
        console.error('Resend API error:', error);
        return NextResponse.json({ 
          error: 'Failed to send email through Resend API', 
          details: error.message 
        }, { status: 500 });
      }

      console.log('Email sent successfully:', data);
      return NextResponse.json({ success: true, data });
    } catch (resendError) {
      console.error('Resend API exception:', resendError);
      return NextResponse.json({ 
        error: 'Exception while sending email', 
        details: resendError instanceof Error ? resendError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({
      error: 'Failed to process email request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 