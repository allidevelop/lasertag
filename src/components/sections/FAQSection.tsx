import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { cn } from '@/lib/utils'
import { useContent } from '@/contexts/ContentContext'

interface MultiLangText {
  uk: string
  ru: string
  en: string
}

function getLocalizedText(text: string | MultiLangText, lang: string): string {
  if (typeof text === 'string') {
    // Try to parse as JSON for multilang support
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object') {
        return parsed[lang] || parsed['uk'] || text
      }
    } catch {
      // Not JSON, return as is
      return text
    }
    return text
  }
  return text[lang as keyof MultiLangText] || text.uk || ''
}

export function FAQSection() {
  const { t, i18n } = useTranslation()
  const { content } = useContent()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const currentLang = i18n.language || 'uk'

  const faqItems = content.faq || []

  return (
    <section id="faq" className="py-20 md:py-32 bg-section-1">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <div
                className={cn(
                  'bg-card rounded-xl border transition-all duration-300',
                  openIndex === index && 'shadow-lg border-primary/50'
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-lg pr-8">
                    {getLocalizedText(item.question, currentLang)}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0',
                      openIndex === index && 'rotate-180 text-primary'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300',
                    openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted-foreground">
                      {getLocalizedText(item.answer, currentLang)}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
