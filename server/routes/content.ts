import { Router } from 'express'
import { db } from '../db/database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/content - Get all content (public)
router.get('/', (req, res) => {
  try {
    // Get hero, contact and sectionImages settings
    const heroRow = db.prepare("SELECT value FROM site_settings WHERE key = 'hero'").get() as { value: string } | undefined
    const contactRow = db.prepare("SELECT value FROM site_settings WHERE key = 'contact'").get() as { value: string } | undefined
    const sectionImagesRow = db.prepare("SELECT value FROM site_settings WHERE key = 'sectionImages'").get() as { value: string } | undefined

    const hero = heroRow ? JSON.parse(heroRow.value) : {}
    const contact = contactRow ? JSON.parse(contactRow.value) : {}
    const sectionImages = sectionImagesRow ? JSON.parse(sectionImagesRow.value) : {}

    // Get services
    const services = db.prepare('SELECT id, icon, title, description FROM services ORDER BY sort_order').all()

    // Get gallery
    const gallery = db.prepare('SELECT id, src, alt FROM gallery ORDER BY sort_order').all()

    // Get pricing
    const pricingRaw = db.prepare('SELECT id, name, price, duration, features, popular, best_value FROM pricing ORDER BY sort_order').all() as Array<{
      id: number
      name: string
      price: string
      duration: string
      features: string
      popular: number
      best_value: number
    }>
    const pricing = pricingRaw.map((p) => ({
      ...p,
      features: JSON.parse(p.features),
      popular: p.popular === 1,
      bestValue: p.best_value === 1,
    }))

    // Get testimonials
    const testimonials = db.prepare('SELECT id, name, text, rating FROM testimonials').all()

    // Get FAQ
    const faq = db.prepare('SELECT id, question, answer FROM faq ORDER BY sort_order').all()

    // Get How to Play steps
    const howToPlay = db.prepare('SELECT id, icon, text FROM how_to_play ORDER BY sort_order').all()

    res.json({
      hero,
      services,
      gallery,
      pricing,
      testimonials,
      contact,
      faq,
      howToPlay,
      sectionImages,
    })
  } catch (error) {
    console.error('Get content error:', error)
    res.status(500).json({ error: 'Ошибка получения контента' })
  }
})

// PUT /api/content/hero - Update hero (protected)
router.put('/hero', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { title, subtitle, ctaText, ctaSecondaryText, backgroundImage } = req.body
    const heroData = { title, subtitle, ctaText, ctaSecondaryText, backgroundImage }

    db.prepare("UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = 'hero'").run(JSON.stringify(heroData))

    res.json({ success: true, hero: heroData })
  } catch (error) {
    console.error('Update hero error:', error)
    res.status(500).json({ error: 'Ошибка обновления hero' })
  }
})

// PUT /api/content/contact - Update contact (protected)
router.put('/contact', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { phone, email, address, workingHours, facebook, instagram } = req.body
    const contactData = { phone, email, address, workingHours, facebook, instagram }

    db.prepare("UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = 'contact'").run(JSON.stringify(contactData))

    res.json({ success: true, contact: contactData })
  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({ error: 'Ошибка обновления контактов' })
  }
})

// PUT /api/content/section-images - Update section images (protected)
router.put('/section-images', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { forWhom, whyLasertag, howToPlay, equipment, events } = req.body
    const sectionImagesData = { forWhom, whyLasertag, howToPlay, equipment, events }

    // Check if key exists
    const existing = db.prepare("SELECT id FROM site_settings WHERE key = 'sectionImages'").get()
    if (existing) {
      db.prepare("UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = 'sectionImages'").run(JSON.stringify(sectionImagesData))
    } else {
      db.prepare("INSERT INTO site_settings (key, value) VALUES ('sectionImages', ?)").run(JSON.stringify(sectionImagesData))
    }

    res.json({ success: true, sectionImages: sectionImagesData })
  } catch (error) {
    console.error('Update section images error:', error)
    res.status(500).json({ error: 'Ошибка обновления изображений секций' })
  }
})

// === SERVICES CRUD ===

// GET /api/content/services
router.get('/services', (req, res) => {
  const services = db.prepare('SELECT id, icon, title, description FROM services ORDER BY sort_order').all()
  res.json(services)
})

// POST /api/content/services
router.post('/services', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { icon, title, description } = req.body
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM services').get() as { max: number | null }
    const sortOrder = (maxOrder.max || 0) + 1

    const result = db.prepare('INSERT INTO services (icon, title, description, sort_order) VALUES (?, ?, ?, ?)').run(icon, title, description, sortOrder)

    res.json({ id: result.lastInsertRowid, icon, title, description })
  } catch (error) {
    console.error('Create service error:', error)
    res.status(500).json({ error: 'Ошибка создания услуги' })
  }
})

// PUT /api/content/services/:id
router.put('/services/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { icon, title, description } = req.body

    db.prepare('UPDATE services SET icon = ?, title = ?, description = ? WHERE id = ?').run(icon, title, description, id)

    res.json({ id: Number(id), icon, title, description })
  } catch (error) {
    console.error('Update service error:', error)
    res.status(500).json({ error: 'Ошибка обновления услуги' })
  }
})

// DELETE /api/content/services/:id
router.delete('/services/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM services WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(500).json({ error: 'Ошибка удаления услуги' })
  }
})

// === GALLERY CRUD ===

// GET /api/content/gallery
router.get('/gallery', (req, res) => {
  const gallery = db.prepare('SELECT id, src, alt FROM gallery ORDER BY sort_order').all()
  res.json(gallery)
})

// POST /api/content/gallery
router.post('/gallery', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { src, alt } = req.body
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM gallery').get() as { max: number | null }
    const sortOrder = (maxOrder.max || 0) + 1

    const result = db.prepare('INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)').run(src, alt, sortOrder)

    res.json({ id: result.lastInsertRowid, src, alt })
  } catch (error) {
    console.error('Create gallery error:', error)
    res.status(500).json({ error: 'Ошибка добавления изображения' })
  }
})

// PUT /api/content/gallery/:id
router.put('/gallery/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { src, alt } = req.body

    db.prepare('UPDATE gallery SET src = ?, alt = ? WHERE id = ?').run(src, alt, id)

    res.json({ id: Number(id), src, alt })
  } catch (error) {
    console.error('Update gallery error:', error)
    res.status(500).json({ error: 'Ошибка обновления изображения' })
  }
})

// DELETE /api/content/gallery/:id
router.delete('/gallery/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM gallery WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete gallery error:', error)
    res.status(500).json({ error: 'Ошибка удаления изображения' })
  }
})

// === PRICING CRUD ===

// GET /api/content/pricing
router.get('/pricing', (req, res) => {
  const pricingRaw = db.prepare('SELECT id, name, price, duration, features, popular, best_value FROM pricing ORDER BY sort_order').all() as Array<{
    id: number
    name: string
    price: string
    duration: string
    features: string
    popular: number
    best_value: number
  }>
  const pricing = pricingRaw.map((p) => ({
    ...p,
    features: JSON.parse(p.features),
    popular: p.popular === 1,
    bestValue: p.best_value === 1,
  }))
  res.json(pricing)
})

// POST /api/content/pricing
router.post('/pricing', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { name, price, duration, features, popular } = req.body
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM pricing').get() as { max: number | null }
    const sortOrder = (maxOrder.max || 0) + 1

    const result = db.prepare('INSERT INTO pricing (name, price, duration, features, popular, sort_order) VALUES (?, ?, ?, ?, ?, ?)').run(
      name,
      price,
      duration,
      JSON.stringify(features || []),
      popular ? 1 : 0,
      sortOrder
    )

    res.json({ id: result.lastInsertRowid, name, price, duration, features, popular })
  } catch (error) {
    console.error('Create pricing error:', error)
    res.status(500).json({ error: 'Ошибка создания тарифа' })
  }
})

// PUT /api/content/pricing/:id
router.put('/pricing/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { name, price, duration, features, popular } = req.body

    db.prepare('UPDATE pricing SET name = ?, price = ?, duration = ?, features = ?, popular = ? WHERE id = ?').run(
      name,
      price,
      duration,
      JSON.stringify(features || []),
      popular ? 1 : 0,
      id
    )

    res.json({ id: Number(id), name, price, duration, features, popular })
  } catch (error) {
    console.error('Update pricing error:', error)
    res.status(500).json({ error: 'Ошибка обновления тарифа' })
  }
})

// DELETE /api/content/pricing/:id
router.delete('/pricing/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM pricing WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete pricing error:', error)
    res.status(500).json({ error: 'Ошибка удаления тарифа' })
  }
})

// === TESTIMONIALS CRUD ===

// GET /api/content/testimonials
router.get('/testimonials', (req, res) => {
  const testimonials = db.prepare('SELECT id, name, text, rating FROM testimonials').all()
  res.json(testimonials)
})

// POST /api/content/testimonials
router.post('/testimonials', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { name, text, rating } = req.body
    const result = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)').run(name, text, rating || 5)
    res.json({ id: result.lastInsertRowid, name, text, rating: rating || 5 })
  } catch (error) {
    console.error('Create testimonial error:', error)
    res.status(500).json({ error: 'Ошибка создания отзыва' })
  }
})

// PUT /api/content/testimonials/:id
router.put('/testimonials/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { name, text, rating } = req.body

    db.prepare('UPDATE testimonials SET name = ?, text = ?, rating = ? WHERE id = ?').run(name, text, rating || 5, id)

    res.json({ id: Number(id), name, text, rating: rating || 5 })
  } catch (error) {
    console.error('Update testimonial error:', error)
    res.status(500).json({ error: 'Ошибка обновления отзыва' })
  }
})

// DELETE /api/content/testimonials/:id
router.delete('/testimonials/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    res.status(500).json({ error: 'Ошибка удаления отзыва' })
  }
})

// === FAQ CRUD ===

// GET /api/content/faq
router.get('/faq', (req, res) => {
  const faq = db.prepare('SELECT id, question, answer FROM faq ORDER BY sort_order').all()
  res.json(faq)
})

// POST /api/content/faq
router.post('/faq', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { question, answer } = req.body
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM faq').get() as { max: number | null }
    const sortOrder = (maxOrder.max || 0) + 1

    const result = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)').run(question, answer, sortOrder)

    res.json({ id: result.lastInsertRowid, question, answer })
  } catch (error) {
    console.error('Create FAQ error:', error)
    res.status(500).json({ error: 'Ошибка создания FAQ' })
  }
})

// PUT /api/content/faq/:id
router.put('/faq/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { question, answer } = req.body

    db.prepare('UPDATE faq SET question = ?, answer = ? WHERE id = ?').run(question, answer, id)

    res.json({ id: Number(id), question, answer })
  } catch (error) {
    console.error('Update FAQ error:', error)
    res.status(500).json({ error: 'Ошибка обновления FAQ' })
  }
})

// DELETE /api/content/faq/:id
router.delete('/faq/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM faq WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete FAQ error:', error)
    res.status(500).json({ error: 'Ошибка удаления FAQ' })
  }
})

// === HOW TO PLAY CRUD ===

// GET /api/content/how-to-play
router.get('/how-to-play', (req, res) => {
  const steps = db.prepare('SELECT id, icon, text FROM how_to_play ORDER BY sort_order').all()
  res.json(steps)
})

// POST /api/content/how-to-play
router.post('/how-to-play', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { icon, text } = req.body
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM how_to_play').get() as { max: number | null }
    const sortOrder = (maxOrder.max || 0) + 1

    const result = db.prepare('INSERT INTO how_to_play (icon, text, sort_order) VALUES (?, ?, ?)').run(icon, text, sortOrder)

    res.json({ id: result.lastInsertRowid, icon, text })
  } catch (error) {
    console.error('Create how-to-play error:', error)
    res.status(500).json({ error: 'Ошибка создания шага' })
  }
})

// PUT /api/content/how-to-play/:id
router.put('/how-to-play/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { icon, text } = req.body

    db.prepare('UPDATE how_to_play SET icon = ?, text = ? WHERE id = ?').run(icon, text, id)

    res.json({ id: Number(id), icon, text })
  } catch (error) {
    console.error('Update how-to-play error:', error)
    res.status(500).json({ error: 'Ошибка обновления шага' })
  }
})

// DELETE /api/content/how-to-play/:id
router.delete('/how-to-play/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM how_to_play WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete how-to-play error:', error)
    res.status(500).json({ error: 'Ошибка удаления шага' })
  }
})

export default router
