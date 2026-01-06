import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'lasertag-secret-key-change-in-production'

export interface AuthRequest extends Request {
  userId?: number
  username?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }
    req.userId = decoded.userId
    req.username = decoded.username
    next()
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' })
  }
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' })
}
