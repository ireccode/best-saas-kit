import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const { valid, decoded, error } = await verifyToken(token);

    if (!valid || error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Here you would typically:
    // 1. Check if user exists in OpenWebUI's database
    // 2. If not, create the user with the provided details
    // 3. Return success or error accordingly

    // This is a placeholder implementation
    // Replace with actual OpenWebUI user creation logic
    const user = decoded as any;
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.sub,
        email: user.email,
        username: user.username,
        roles: user.roles,
      }
    });
  } catch (error) {
    console.error('Error creating WebUI user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
