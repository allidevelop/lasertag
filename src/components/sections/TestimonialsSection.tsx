import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Quote, ExternalLink, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'
import { cn } from '@/lib/utils'

const highlights = [
  'organization',
  'instructors',
  'emotions',
  'format',
]

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?hl=en-UA&gl=ua&q=%D0%9F%D0%B5%D0%B9%D0%BD%D1%82%D0%B1%D0%BE%D0%BB+%D0%BA%D0%BB%D1%83%D0%B1+GANZ+%D0%B2+%D0%9A%D0%B8%D1%94%D0%B2%D1%96+(%D0%92%D0%94%D0%9D%D0%93),+%D0%BF%D1%80%D0%BE%D1%81%D0%BF.+%D0%90%D0%BA%D0%B0%D0%B4%D0%B5%D0%BC%D1%96%D0%BA%D0%B0+%D0%93%D0%BB%D1%83%D1%88%D0%BA%D0%BE%D0%B2%D0%B0,+1,+%D0%BF21,+Kyiv,+03680&ludocid=7777278869433885871&lsig=AB86z5VuI6ccJr5mve2iSk1mf7p1#lrd=0x40d4c9fa43f9d493:0x6bee71ed0bc224af,1'

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with correct value if window exists (client-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export function TestimonialsSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useIsMobile()

  const testimonials = content.testimonials
  const totalSlides = testimonials.length
  const visibleSlides = isMobile ? 1 : 3 // Show 1 on mobile, 3 on desktop
  const maxIndex = Math.max(0, totalSlides - visibleSlides)

  // Reset index when switching between mobile/desktop to avoid out of bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [maxIndex, currentIndex])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-section-2">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              {t('testimonials.subtitle')}
            </p>

            <div className="max-w-2xl mx-auto">
              <p className="text-foreground font-medium mb-4">
                {t('testimonials.guestsNote')}
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                {highlights.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-foreground text-sm md:text-base"
                  >
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
                    <span>{t(`testimonials.highlights.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Carousel */}
        <FadeIn delay={0.2}>
          <div className="relative max-w-6xl mx-auto px-12 md:px-16">
            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-full md:w-1/3 px-0 md:px-3"
                  >
                    <Card className="bg-card border-border h-full">
                      <CardContent className="pt-6 pb-6 px-5">
                        <div className="flex flex-col items-center text-center">
                          <Quote className="w-8 h-8 text-primary/30 mb-4" />

                          <p className="text-foreground text-sm md:text-base mb-6 italic leading-relaxed line-clamp-4">
                            "{testimonial.text}"
                          </p>

                          <div className="flex gap-1 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-semibold">{testimonial.name}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                {t('testimonials.readAll')}
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
