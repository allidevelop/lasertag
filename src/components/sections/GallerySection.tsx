import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ChevronLeft, ChevronRight, Check, TreePine } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useContent } from '@/contexts/ContentContext'

const arenaFeatures = ['feature1', 'feature2', 'feature3']

export function GallerySection() {
  const { t } = useTranslation()
  const { content } = useContent()
  const galleryImages = content.gallery
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = ''
  }

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1
      )
    }
  }

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1
      )
    }
  }

  return (
    <section id="gallery" className="py-20 md:py-32 bg-section-1">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              {t('gallery.subtitle')}
            </p>
            <p className="text-foreground mb-6">
              {t('arenas.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {arenaFeatures.map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-foreground"
                >
                  <Check className="w-4 h-4 text-primary" />
                  <span>{t(`arenas.${key}`)}</span>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 text-primary font-medium">
              <TreePine className="w-5 h-5" />
              <span>{t('arenas.outdoor')}</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <FadeIn key={image.id} delay={index * 0.1}>
              <button
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium">{image.alt}</p>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <img
            src={galleryImages[selectedImage].src}
            alt={galleryImages[selectedImage].alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(index)
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === selectedImage ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
