import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SiteContent } from '@/types/content'
import { defaultContent } from '@/data/content'

interface ContentContextType {
  content: SiteContent
  loading: boolean
  error: string | null
  refetchContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/content')
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }
      const data = await response.json()

      // Transform data to match SiteContent structure
      const transformedContent: SiteContent = {
        hero: data.hero || defaultContent.hero,
        services: data.services?.map((s: any) => ({
          id: String(s.id),
          icon: s.icon,
          title: s.title,
          description: s.description,
        })) || defaultContent.services,
        gallery: data.gallery?.map((g: any) => ({
          id: String(g.id),
          src: g.src,
          alt: g.alt,
        })) || defaultContent.gallery,
        pricing: data.pricing?.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          duration: p.duration,
          features: p.features || [],
          popular: p.popular,
          bestValue: p.bestValue,
        })) || defaultContent.pricing,
        testimonials: data.testimonials?.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          text: t.text,
          rating: t.rating,
        })) || defaultContent.testimonials,
        contact: data.contact || defaultContent.contact,
        faq: data.faq?.map((f: any) => ({
          id: String(f.id),
          question: f.question,
          answer: f.answer,
        })) || defaultContent.faq,
        howToPlay: data.howToPlay?.map((h: any) => ({
          id: String(h.id),
          icon: h.icon,
          text: h.text,
        })) || defaultContent.howToPlay,
        sectionImages: data.sectionImages || defaultContent.sectionImages,
      }

      setContent(transformedContent)
    } catch (err) {
      console.error('Error fetching content:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Use default content as fallback
      setContent(defaultContent)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const refetchContent = async () => {
    await fetchContent()
  }

  return (
    <ContentContext.Provider value={{ content, loading, error, refetchContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}
