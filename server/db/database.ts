import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dataDir, 'lasertag.db')

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(dbPath)

// Enable foreign keys
db.pragma('journal_mode = WAL')

export function initDatabase() {
  // Site settings (hero, contact as JSON)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Services
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Gallery
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      alt TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Pricing
  db.exec(`
    CREATE TABLE IF NOT EXISTS pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      duration TEXT NOT NULL,
      features TEXT NOT NULL,
      popular INTEGER DEFAULT 0,
      best_value INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Add best_value column if it doesn't exist (for existing databases)
  try {
    db.exec(`ALTER TABLE pricing ADD COLUMN best_value INTEGER DEFAULT 0`)
  } catch (e) {
    // Column already exists, ignore
  }

  // Testimonials
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5
    )
  `)

  // FAQ
  db.exec(`
    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Bookings
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      source TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `)

  // Feedback
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Admins
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `)

  // Translations
  db.exec(`
    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lang TEXT NOT NULL,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(lang)
    )
  `)

  // How to Play steps
  db.exec(`
    CREATE TABLE IF NOT EXISTS how_to_play (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      text TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `)

  console.log('Database initialized successfully')
}
