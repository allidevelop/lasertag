import { useTranslation } from 'react-i18next'
import { Users, Calendar, Phone, Clock, Package, Smile, AlertTriangle } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const defaultSteps = [
  { icon: 'Users', translationKey: 'step1' },
  { icon: 'Calendar', translationKey: 'step2' },
  { icon: 'Phone', translationKey: 'step3' },
  { icon: 'Clock', translationKey: 'step4' },
  { icon: 'Package', translationKey: 'step5' },
  { icon: 'Smile', translationKey: 'step6' },
]

const iconMap: Record<string, React.ElementType> = {
  Users,
  Calendar,
  Phone,
  Clock,
  Package,
  Smile,
}

const DEFAULT_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/3.jpg'

export function HowToPlaySection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const sectionImage = content.sectionImages?.howToPlay || DEFAULT_IMAGE

  // Use icons from database but always use translations for text
  const steps = defaultSteps.map((s, i) => {
    const dbStep = content.howToPlay?.[i]
    return {
      id: String(i + 1),
      icon: dbStep?.icon || s.icon,
      text: t(`howToPlay.${s.translationKey}`),
    }
  })

  return (
    <section id="how-to-play" className="py-20 md:py-32 bg-section-2">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('howToPlay.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('howToPlay.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image - Left side */}
            <FadeIn delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <img
                  src={sectionImage}
                  alt={t('howToPlay.title')}
                  className="w-full h-[400px] md:h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </FadeIn>

            {/* Content - Right side */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = iconMap[step.icon] || Users
                return (
                  <FadeIn key={step.id || index} delay={0.1 + index * 0.1}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-grow flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground">
                          {step.text}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}

              {/* Note */}
              <FadeIn delay={0.8}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    {t('howToPlay.note')}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
