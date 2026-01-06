import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Только изображения (JPEG, PNG, GIF, WebP)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

// POST /api/upload - Upload image (protected)
router.post('/', authMiddleware, upload.single('image'), (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' })
    }

    const url = `/uploads/${req.file.filename}`

    res.json({
      success: true,
      url,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Ошибка загрузки файла' })
  }
})

// Error handler for multer
router.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (макс. 5MB)' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
})

export default router
