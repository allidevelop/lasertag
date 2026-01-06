import { useTranslation } from 'react-i18next'
import { Baby, Cake, Briefcase, Users, GraduationCap } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const categories = [
  { icon: Baby, titleKey: 'kids', descKey: 'kidsDesc' },
  { icon: Cake, titleKey: 'birthday', descKey: 'birthdayDesc' },
  { icon: Briefcase, titleKey: 'corporate', descKey: 'corporateDesc' },
  { icon: Users, titleKey: 'family', descKey: 'familyDesc' },
  { icon: GraduationCap, titleKey: 'school', descKey: 'schoolDesc' },
]

const DEFAULT_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/1.jpg'

export function ForWhomSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const sectionImage = content.sectionImages?.forWhom || DEFAULT_IMAGE

  return (
    <section id="for-whom" className="py-20 md:py-32 bg-section-1">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('forWhom.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('forWhom.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content - Left side */}
            <div className="space-y-4 order-2 lg:order-1">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <FadeIn key={category.titleKey} delay={0.1 + index * 0.1}>
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {t(`forWhom.${category.titleKey}`)}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {t(`forWhom.${category.descKey}`)}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>

            {/* Image - Right side */}
            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <img
                  src={sectionImage}
                  alt={t('forWhom.title')}
                  className="w-full h-[400px] md:h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
