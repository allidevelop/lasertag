export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
  ctaSecondaryText: string
  backgroundImage?: string
}

export interface ServiceItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  duration: string
  features: string[]
  popular: boolean
  bestValue?: boolean
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  workingHours: string
  facebook: string
  instagram: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface HowToPlayStep {
  id: string
  icon: string
  text: string
}

export interface SectionImages {
  forWhom?: string
  whyLasertag?: string
  howToPlay?: string
  equipment?: string
  events?: string
}

export interface SiteContent {
  hero: HeroContent
  services: ServiceItem[]
  gallery: GalleryImage[]
  pricing: PricingPlan[]
  testimonials: Testimonial[]
  contact: ContactInfo
  faq: FAQ[]
  howToPlay?: HowToPlayStep[]
  sectionImages?: SectionImages
}
