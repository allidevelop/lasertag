import { useTranslation } from 'react-i18next'
import { Target, Building, Building2, PartyPopper, Users, Flame, Trophy, Trees, Truck, Cake } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

const iconMap: Record<string, React.ElementType> = {
  Target,
  Building,
  Building2,
  PartyPopper,
  Users,
  Flame,
  Trophy,
  Trees,
  Truck,
  Cake,
}

export function ServicesSection() {
  const { t } = useTranslation()
  const { content } = useContent()

  return (
    <section id="services" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('services.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Target
            return (
              <FadeIn key={service.id} delay={index * 0.1}>
                <Card className="group cursor-pointer h-full transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
