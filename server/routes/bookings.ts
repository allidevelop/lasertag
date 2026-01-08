import { Router } from 'express'
import { db } from '../db/database'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { notifyNewBooking } from '../services/telegram'
import { sendBookingEmail } from '../services/email'

const router = Router()

interface Booking {
  id: number
  name: string
  phone: string
  players: string | null
  date: string
  time: string
  source: string | null
  message: string | null
  created_at: string
  status: string
}

// POST /api/bookings - Create booking (public)
router.post('/', (req, res) => {
  try {
    const { name, phone, players, date, time, source, message } = req.body

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ error: 'Заполните обязательные поля' })
    }

    const result = db
      .prepare('INSERT INTO bookings (name, phone, players, date, time, source, message) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(name, phone, players || null, date, time, source || null, message || null)

    // Send notifications (don't wait for them)
    notifyNewBooking({ name, phone, players, date, time, source, message }).catch((err) => {
      console.error('Failed to send Telegram notification:', err)
    })
    sendBookingEmail({ name, phone, players, date, time, source, message }).catch((err) => {
      console.error('Failed to send email notification:', err)
    })

    res.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Бронирование успешно создано',
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ error: 'Ошибка создания бронирования' })
  }
})

// GET /api/bookings - Get all bookings (protected)
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all() as Booking[]
    res.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ error: 'Ошибка получения бронирований' })
  }
})

// GET /api/bookings/:id - Get single booking (protected)
router.get('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Booking | undefined

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' })
    }

    res.json(booking)
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({ error: 'Ошибка получения бронирования' })
  }
})

// PUT /api/bookings/:id/status - Update booking status (protected)
router.put('/:id/status', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['new', 'confirmed', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' })
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id)

    res.json({ success: true, status })
  } catch (error) {
    console.error('Update booking status error:', error)
    res.status(500).json({ error: 'Ошибка обновления статуса' })
  }
})

// DELETE /api/bookings/:id - Delete booking (protected)
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM bookings WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({ error: 'Ошибка удаления бронирования' })
  }
})

export default router
