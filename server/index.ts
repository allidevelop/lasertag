import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { initDatabase } from './db/database'
import { seedDatabase } from './db/seed'
import authRoutes from './routes/auth'
import contentRoutes from './routes/content'
import bookingsRoutes from './routes/bookings'
import feedbackRoutes from './routes/feedback'
import uploadRoutes from './routes/upload'
import translationsRoutes from './routes/translations'

const app = express()
const PORT = process.env.PORT || 3040

// Middleware
app.use(cors())
app.use(express.json())

// Disable caching for API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
})

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/translations', translationsRoutes)

// Serve static files from dist
const distPath = path.join(process.cwd(), 'dist')
app.use(express.static(distPath))

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

// Initialize database and start server
async function start() {
  try {
    console.log('Initializing database...')
    initDatabase()

    console.log('Seeding database...')
    await seedDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
