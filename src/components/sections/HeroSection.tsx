import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Crosshair, X, Check, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { useContent } from '@/contexts/ContentContext'

// Default hero image - use lasertag photo
const DEFAULT_HERO_IMAGE = 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/1.jpg'

export function HeroSection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const scrollToBooking = () => {
    const element = document.querySelector('#booking')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const closeVideo = () => setIsVideoOpen(false)

  // Always use translations for text (multi-language support)
  // Only use database content for backgroundImage
  const title = t('hero.title')
  const subtitle = t('hero.subtitle')
  const description = t('hero.description')
  const ctaText = t('hero.cta')
  const ctaSecondaryText = t('hero.ctaSecondary')
  const backgroundImage = content.hero.backgroundImage || DEFAULT_HERO_IMAGE

  const benefits = [
    t('hero.benefits.noPain'),
    t('hero.benefits.equipment'),
    t('hero.benefits.instructor'),
    t('hero.benefits.outdoor'),
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay - adapts to theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/70 dark:via-black/50 dark:to-black/80" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <FadeIn delay={0.2} duration={0.8}>
          <p className="text-lg md:text-xl text-primary font-medium mb-4">
            {description}
          </p>
        </FadeIn>

        {/* Main Title */}
        <FadeIn delay={0.3} duration={0.8}>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white drop-shadow-2xl"
            style={{
              textShadow: '0 0 40px rgba(0, 144, 255, 0.5), 0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            {title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.5} duration={0.6}>
          <div className="inline-block px-6 py-3 rounded-xl backdrop-blur-md bg-black/40 border border-white/20 mb-8">
            <p className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto font-medium">
              {subtitle}
            </p>
          </div>
        </FadeIn>

        {/* Benefits */}
        <FadeIn delay={0.7} duration={0.6}>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white text-sm md:text-base drop-shadow-md"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0 drop-shadow-md" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.9} duration={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="glow"
              size="xl"
              onClick={scrollToBooking}
              className="group text-lg px-10"
            >
              <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              {ctaText}
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => setIsVideoOpen(true)}
              className="text-lg px-10 group border-white bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {ctaSecondaryText}
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <FadeIn delay={1.5} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => {
            const element = document.querySelector('#services')
            if (element) element.scrollIntoView({ behavior: 'smooth' })
          }}
          className="animate-bounce text-white hover:text-primary transition-colors drop-shadow-lg"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </FadeIn>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-5xl bg-background rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-white/20 text-foreground hover:bg-primary hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video player */}
            <video
              className="w-full aspect-video"
              controls
              autoPlay
              src="/videos/What-is-laser-tag.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  )
}
