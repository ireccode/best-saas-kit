import jwt from 'jsonwebtoken';
import { User } from '@/types/user';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

export function generateToken(userId: string, credits: number): string {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    { userId, credits },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '1h' }
  );
}

export function generateOpenWebUIToken(user: User): string {
  const tokenPayload = {
    userId: user.id,
    credits: user.credits,
    web_ui_enabled: user.web_ui_enabled,
    role: user.role
  };

  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    tokenPayload,
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyToken(token: string): any {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET is not defined in environment variables');
    } 
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
