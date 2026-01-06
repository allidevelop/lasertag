import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ForWhomSection } from '@/components/sections/ForWhomSection'
import { WhyLasertagSection } from '@/components/sections/WhyLasertagSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { HowToPlaySection } from '@/components/sections/HowToPlaySection'
import { EquipmentSection } from '@/components/sections/EquipmentSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { EventsSection } from '@/components/sections/EventsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { MapSection } from '@/components/sections/MapSection'
import { AdminPage } from '@/pages/AdminPage'

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ForWhomSection />
        <WhyLasertagSection />
        <GallerySection />
        <HowToPlaySection />
        <EquipmentSection />
        <PricingSection />
        <EventsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
