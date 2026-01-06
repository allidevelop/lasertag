import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.json'
import uk from './locales/uk.json'
import en from './locales/en.json'

// Initial static resources (for fast initial load)
const staticResources = {
  ru: { translation: ru },
  uk: { translation: uk },
  en: { translation: en },
}

const savedLang = localStorage.getItem('language') || 'uk'

i18n.use(initReactI18next).init({
  resources: staticResources,
  lng: savedLang,
  fallbackLng: 'uk',
  interpolation: {
    escapeValue: false,
  },
})

// Function to reload translations from API
export async function reloadTranslations(lang?: string) {
  const languages = lang ? [lang] : ['uk', 'ru', 'en']

  for (const lng of languages) {
    try {
      const response = await fetch(`/api/translations/${lng}`)
      if (response.ok) {
        const data = await response.json()
        i18n.addResourceBundle(lng, 'translation', data, true, true)
      }
    } catch (error) {
      console.error(`Failed to load ${lng} translations:`, error)
    }
  }
}

// Function to reload all translations and refresh UI
export async function refreshTranslations() {
  await reloadTranslations()
  // Force re-render by changing language back and forth
  const currentLang = i18n.language
  await i18n.changeLanguage(currentLang === 'uk' ? 'ru' : 'uk')
  await i18n.changeLanguage(currentLang)
}

export default i18n
