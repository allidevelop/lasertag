import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'
import { BookingForm } from '@/components/forms/BookingForm'
import { FeedbackForm } from '@/components/forms/FeedbackForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContent } from '@/contexts/ContentContext'

export function ContactSection() {
  const { t } = useTranslation()
  const { content } = useContent()

  return (
    <section id="contact" className="py-20 md:py-32 bg-section-2">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <FadeIn delay={0.1}>
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                      <a
                        href={`tel:${content.contact.phone.replace(/[^\d+]/g, '')}`}
                        className="text-muted-foreground hover:text-primary transition-colors text-lg"
                      >
                        {content.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                      <a
                        href={`mailto:${content.contact.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {content.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                      <p className="text-muted-foreground">
                        {content.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.workingHours')}</h3>
                      <p className="text-muted-foreground">
                        {content.contact.workingHours}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold mb-4">{t('contact.followUs')}</h3>
                    <div className="flex gap-4">
                      <a
                        href={content.contact.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors group"
                      >
                        <Facebook className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      </a>
                      <a
                        href={content.contact.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors group"
                      >
                        <Instagram className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Forms */}
          <FadeIn delay={0.2}>
            <Card id="booking">
              <CardContent className="p-8">
                <Tabs defaultValue="booking">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
                    <TabsTrigger value="booking" className="text-xs sm:text-sm py-2.5 px-2 whitespace-normal leading-tight">{t('booking.title')}</TabsTrigger>
                    <TabsTrigger value="feedback" className="text-xs sm:text-sm py-2.5 px-2 whitespace-normal leading-tight">{t('feedback.title')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="booking">
                    <BookingForm />
                  </TabsContent>
                  <TabsContent value="feedback">
                    <FeedbackForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
