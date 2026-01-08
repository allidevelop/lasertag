import { Router } from 'express'
import { db } from '../db/database'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { notifyNewFeedback } from '../services/telegram'
import { sendFeedbackEmail } from '../services/email'

const router = Router()

interface Feedback {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

// POST /api/feedback - Create feedback (public)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Заполните все поля' })
    }

    const result = db
      .prepare('INSERT INTO feedback (name, email, phone, message) VALUES (?, ?, ?, ?)')
      .run(name, email, phone || null, message)

    // Send notifications (don't wait for them)
    notifyNewFeedback({ name, email, phone, message }).catch((err) => {
      console.error('Failed to send Telegram notification:', err)
    })
    sendFeedbackEmail({ name, email, phone, message }).catch((err) => {
      console.error('Failed to send email notification:', err)
    })

    res.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Сообщение успешно отправлено',
    })
  } catch (error) {
    console.error('Create feedback error:', error)
    res.status(500).json({ error: 'Ошибка отправки сообщения' })
  }
})

// GET /api/feedback - Get all feedback (protected)
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all() as Feedback[]
    res.json(feedback)
  } catch (error) {
    console.error('Get feedback error:', error)
    res.status(500).json({ error: 'Ошибка получения сообщений' })
  }
})

// DELETE /api/feedback/:id - Delete feedback (protected)
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM feedback WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete feedback error:', error)
    res.status(500).json({ error: 'Ошибка удаления сообщения' })
  }
})

export default router
