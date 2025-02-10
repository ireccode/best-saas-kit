import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateOpenWebUIToken } from '@/utils/jwt';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables for Supabase');
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    console.log('Fetching session...');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    console.log('Session found, fetching user data...');
    // Get user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, credits, web_ui_enabled, role')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Supabase error:', userError);
      return NextResponse.json(
        { error: 'Database error while fetching user data' },
        { status: 500 }
      );
    }

    if (!userData) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    console.log('User data found:', { ...userData, id: '[REDACTED]' });
    // Create user object for token
    const user = {
      id: userData.id,
      username: session.user.name || 'Anonymous',
      email: session.user.email!,
      credits: userData.credits || 0,
      webUIEnabled: userData.web_ui_enabled || false,
      roles: [userData.role || 'user']
    };

    console.log('Generating token...');
    const token = generateOpenWebUIToken(user);
    
    return NextResponse.json({ 
      token,
      debug: {
        webUIUrl: process.env.NEXT_PUBLIC_OPENWEBUI_URL,
        hasJwtSecret: !!process.env.JWT_SECRET_OPENWEBUI
      }
    });
  } catch (error) {
    console.error('Error in token generation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
