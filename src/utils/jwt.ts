import jwt from 'jsonwebtoken';
import { User } from '@/contexts/AuthContext';

if (!process.env.JWT_SECRET_OPENWEBUI) {
  throw new Error('JWT_SECRET_OPENWEBUI environment variable is not set');
}

export const generateOpenWebUIToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles || ['user'],
      credits: user.credits,
      webUIEnabled: user.webUIEnabled,
    },
    process.env.JWT_SECRET_OPENWEBUI,
    {
      expiresIn: '1h',
      issuer: 'next-auth',
      audience: 'openwebui',
    }
  );
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_OPENWEBUI!);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};
