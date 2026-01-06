import { db } from './database'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('Seeding how_to_play data and updating translations...')

// Seed how_to_play steps (Ukrainian)
const steps = [
  { icon: 'Users', text: 'Збираєте компанію від 8 осіб' },
  { icon: 'Calendar', text: 'Обираєте дату та час гри' },
  { icon: 'Phone', text: 'Замовляєте гру на сайті або за телефоном' },
  { icon: 'Clock', text: 'Приходите в клуб за 15 хвилин раніше' },
  { icon: 'Crosshair', text: 'Отримуєте комплект обладнання та проходите інструктаж' },
  { icon: 'Smile', text: 'Граєте та отримуєте позитив!' },
]

// Check if table exists and has data
const existingSteps = db.prepare('SELECT COUNT(*) as count FROM how_to_play').get() as { count: number }

if (existingSteps.count === 0) {
  console.log('  - Adding how_to_play steps...')
  const insertStep = db.prepare('INSERT INTO how_to_play (icon, text, sort_order) VALUES (?, ?, ?)')

  steps.forEach((step, index) => {
    insertStep.run(step.icon, step.text, index + 1)
  })
  console.log(`  - Added ${steps.length} steps`)
} else {
  console.log('  - how_to_play already has data, skipping...')
}

// Update translations from JSON files
const languages = ['uk', 'ru', 'en']

console.log('  - Updating translations...')
for (const lang of languages) {
  const jsonPath = path.join(__dirname, '../../src/i18n/locales', `${lang}.json`)
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  db.prepare(`
    INSERT OR REPLACE INTO translations (lang, data, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `).run(lang, JSON.stringify(data))

  console.log(`    - Updated ${lang} translations`)
}

console.log('Done!')
