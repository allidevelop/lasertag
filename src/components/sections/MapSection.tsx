import { useTranslation } from 'react-i18next'
import { FadeIn } from '@/components/animations/FadeIn'

// Google Maps embed URL for "Пейнтбол клуб GANZ в Києві (ВДНГ)"
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2544.8!2d30.4833!3d50.3772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c9fa43f9d493%3A0x6bee71ed0bc224af!2z0J_QtdC50L3RgtCx0L7QuyDQutC70YPQsSBHQU5aINCyINCa0LjRlNCy0ZYgKNCS0JTQndCTKQ!5e0!3m2!1suk!2sua!4v1704480000000!5m2!1suk!2sua'

export function MapSection() {
  const { t } = useTranslation()

  return (
    <section id="map" className="bg-section-2">
      <FadeIn>
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('map.title')}
            className="absolute inset-0"
          />
        </div>
      </FadeIn>
    </section>
  )
}
