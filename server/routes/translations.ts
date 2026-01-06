import { Router } from 'express'
import { db } from '../db/database'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// Get translations for a language (public)
router.get('/:lang', (req, res) => {
  const { lang } = req.params

  const row = db.prepare('SELECT data FROM translations WHERE lang = ?').get(lang) as { data: string } | undefined

  if (!row) {
    return res.status(404).json({ error: 'Language not found' })
  }

  try {
    const data = JSON.parse(row.data)
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Invalid translation data' })
  }
})

// Get all available languages (public)
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT lang, updated_at FROM translations ORDER BY lang').all() as Array<{ lang: string; updated_at: string }>
  res.json(rows.map(r => ({ lang: r.lang, updatedAt: r.updated_at })))
})

// Update translations for a language (protected)
router.put('/:lang', authMiddleware, (req, res) => {
  const { lang } = req.params
  const { data } = req.body

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data format' })
  }

  try {
    const jsonData = JSON.stringify(data)

    // Check if language exists
    const existing = db.prepare('SELECT id FROM translations WHERE lang = ?').get(lang)

    if (existing) {
      db.prepare('UPDATE translations SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE lang = ?').run(jsonData, lang)
    } else {
      db.prepare('INSERT INTO translations (lang, data) VALUES (?, ?)').run(lang, jsonData)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Translation update error:', error)
    res.status(500).json({ error: 'Failed to update translations' })
  }
})

// Add new language (protected)
router.post('/', authMiddleware, (req, res) => {
  const { lang, data } = req.body

  if (!lang || !data) {
    return res.status(400).json({ error: 'Language code and data required' })
  }

  try {
    const existing = db.prepare('SELECT id FROM translations WHERE lang = ?').get(lang)
    if (existing) {
      return res.status(400).json({ error: 'Language already exists' })
    }

    const jsonData = JSON.stringify(data)
    db.prepare('INSERT INTO translations (lang, data) VALUES (?, ?)').run(lang, jsonData)

    res.json({ success: true })
  } catch (error) {
    console.error('Translation create error:', error)
    res.status(500).json({ error: 'Failed to create translations' })
  }
})

// Delete language (protected)
router.delete('/:lang', authMiddleware, (req, res) => {
  const { lang } = req.params

  // Don't allow deleting default language
  if (lang === 'uk') {
    return res.status(400).json({ error: 'Cannot delete default language' })
  }

  db.prepare('DELETE FROM translations WHERE lang = ?').run(lang)
  res.json({ success: true })
})

export default router
