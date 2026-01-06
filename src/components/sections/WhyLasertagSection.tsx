import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const benefitKeys = [
  'noBullets',
  'noMask',
  'forAll',
  'cleanClothes',
  'allYear',
  'realGame',
]

const DEFAULT_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/2.jpg'

export function WhyLasertagSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const sectionImage = content.sectionImages?.whyLasertag || DEFAULT_IMAGE

  return (
    <section id="why-lasertag" className="py-20 md:py-32 bg-section-2">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('whyLasertag.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('whyLasertag.subtitle')}
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
                  alt={t('whyLasertag.title')}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </FadeIn>

            {/* Content - Right side */}
            <div className="space-y-4">
              {benefitKeys.map((key, index) => (
                <FadeIn key={key} delay={0.1 + index * 0.1}>
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {t(`whyLasertag.${key}`)}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
