import { db } from './database'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Update translations with readAll key from JSON files
const languages = ['uk', 'ru', 'en']

console.log('Updating translations with readAll key...')

for (const lang of languages) {
  const jsonPath = path.join(__dirname, '../../src/i18n/locales', `${lang}.json`)
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  db.prepare(`
    INSERT OR REPLACE INTO translations (lang, data, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `).run(lang, JSON.stringify(data))

  console.log(`  - Updated ${lang} translations`)
}

console.log('Done!')
