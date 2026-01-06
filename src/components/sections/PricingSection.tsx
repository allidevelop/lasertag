import { useTranslation } from 'react-i18next'
import { Check, Zap, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { cn } from '@/lib/utils'
import { useContent } from '@/contexts/ContentContext'

export function PricingSection() {
  const { t } = useTranslation()
  const { content } = useContent()

  const scrollToBooking = () => {
    const element = document.querySelector('#booking')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-32 bg-section-2">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-2xl mx-auto text-center mb-12 p-6 rounded-xl bg-card/50 border border-border">
            <p className="text-foreground mb-2">
              {t('pricing.note')}
            </p>
            <p className="text-primary font-medium">
              {t('pricing.cta')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {content.pricing.map((plan, index) => (
            <FadeIn key={plan.id} delay={index * 0.15}>
              <Card
                className={cn(
                  'relative h-full flex flex-col transition-all duration-300',
                  plan.popular
                    ? 'border-blue-500 border-2 shadow-2xl shadow-blue-500/30 scale-105 z-10 bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-transparent'
                    : plan.bestValue
                    ? 'border-violet-500 border-2 shadow-xl shadow-violet-500/30 bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent'
                    : 'hover:border-primary/50 hover:shadow-lg'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                      <Zap className="w-4 h-4 fill-current shrink-0" />
                      {t('pricing.popular')}
                    </div>
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-violet-500 text-white px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                      <Crown className="w-4 h-4 fill-current shrink-0" />
                      {t('pricing.bestValue')}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {t('pricing.currency')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.duration} • {t('pricing.perPerson')}
                  </p>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.popular || plan.bestValue ? 'glow' : 'outline'}
                    className={cn(
                      'w-full',
                      plan.popular && 'bg-blue-500 hover:bg-blue-600',
                      plan.bestValue && 'bg-violet-500 hover:bg-violet-600'
                    )}
                    size="lg"
                    onClick={scrollToBooking}
                  >
                    {t('pricing.book')}
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
