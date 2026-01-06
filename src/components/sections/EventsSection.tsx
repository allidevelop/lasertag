import { useTranslation } from 'react-i18next'
import { Calendar, UserCheck, FileText, Coffee, Sparkles } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const features = [
  { icon: Calendar, key: 'feature1' },
  { icon: UserCheck, key: 'feature2' },
  { icon: FileText, key: 'feature3' },
  { icon: Coffee, key: 'feature4' },
  { icon: Sparkles, key: 'feature5' },
]

const DEFAULT_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/5.jpg'

export function EventsSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const sectionImage = content.sectionImages?.events || DEFAULT_IMAGE

  return (
    <section id="events" className="py-20 md:py-32 bg-section-1">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('events.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('events.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          {/* 5 Feature blocks in a row */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isLast = index === features.length - 1
                return (
                  <div
                    key={feature.key}
                    className={`flex flex-col items-center text-center p-4 md:p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 ${isLast ? 'col-span-2 md:col-span-1' : ''}`}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-xs md:text-sm mb-1">
                      {t(`events.${feature.key}`)}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-tight">
                      {t(`events.${feature.key}Desc`)}
                    </p>
                  </div>
                )
              })}
            </div>
          </FadeIn>

          {/* Full-width image */}
          <FadeIn delay={0.4}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
              <img
                src={sectionImage}
                alt={t('events.title')}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Description overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="p-4 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
                  <p className="text-white font-medium text-center text-sm md:text-base">
                    {t('events.description')}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
