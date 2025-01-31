import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const TOKEN_EXPIRY = '10m' // 5 minutes

export interface TokenPayload {
  userId: string
  credits: number
  iat?: number
  exp?: number
}

export function generateToken(userId: string, credits: number): string {
  if (credits <= 0) throw new Error('Insufficient credits')
  
  return jwt.sign(
    { userId, credits },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
