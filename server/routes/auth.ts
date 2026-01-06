import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db/database'
import { generateToken } from '../middleware/auth'

const router = Router()

interface Admin {
  id: number
  username: string
  password_hash: string
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' })
    }

    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as Admin | undefined

    if (!admin) {
      return res.status(401).json({ error: 'Неверный логин или пароль' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный логин или пароль' })
    }

    const token = generateToken(admin.id, admin.username)

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/auth/me - verify token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' })
  }

  try {
    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET || 'lasertag-secret-key-change-in-production'
    const decoded = jwt.verify(token, secret) as { userId: number; username: string }

    res.json({
      id: decoded.userId,
      username: decoded.username,
    })
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' })
  }
})

export default router
