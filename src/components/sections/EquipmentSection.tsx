import { useTranslation } from 'react-i18next'
import { RotateCcw, Grid2x2Plus, Trophy, Users } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const features = [
  { icon: RotateCcw, key: 'feature1' },
  { icon: Grid2x2Plus, key: 'feature2' },
  { icon: Trophy, key: 'feature3' },
  { icon: Users, key: 'feature4' },
]

const DEFAULT_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/4.jpg'

export function EquipmentSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const sectionImage = content.sectionImages?.equipment || DEFAULT_IMAGE

  return (
    <section id="equipment" className="py-20 md:py-32 bg-section-1">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('equipment.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2">
              {t('equipment.subtitle')}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('equipment.description')}
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          {/* 4 Feature blocks in a row */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.key}
                    className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm md:text-base uppercase mb-2">
                      {t(`equipment.${feature.key}`)}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {t(`equipment.${feature.key}Desc`)}
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
                alt={t('equipment.title')}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Note overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="p-4 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
                  <p className="text-white font-medium text-center text-sm md:text-base">
                    {t('equipment.note')}
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
