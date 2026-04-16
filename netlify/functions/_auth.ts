import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function extractToken(authHeader?: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export function verifyToken(token: string): boolean {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function isAuthorized(headers: Record<string, string | undefined | null>): boolean {
  const token = extractToken(headers['authorization']);
  if (!token) return false;
  return verifyToken(token);
}

export function createToken(email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ email }, secret, { expiresIn: '7d' });
}

export async function validateCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminPasswordHash) return false;
  if (email !== adminEmail) return false;
  return bcrypt.compare(password, adminPasswordHash);
}
