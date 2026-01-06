import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { cn } from '@/lib/utils'

const faqItems = [
  { key: 'q1', answerKey: 'a1' },
  { key: 'q2', answerKey: 'a2' },
  { key: 'q3', answerKey: 'a3' },
  { key: 'q4', answerKey: 'a4' },
  { key: 'q5', answerKey: 'a5' },
]

export function FAQSection() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
            <FadeIn key={item.key} delay={index * 0.1}>
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
                    {t(`faq.${item.key}`)}
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
                      {t(`faq.${item.answerKey}`)}
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
