import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Save, LogOut, Eye, ArrowLeft, Plus, Trash2, Upload, RefreshCw, Calendar, Mail, Phone, Clock, Languages, ChevronDown, ChevronRight } from 'lucide-react'

// Format date to European format DD.MM.YYYY
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

// Format datetime to European format DD.MM.YYYY HH:mm
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from '@/contexts/ThemeContext'
import * as api from '@/lib/api'

interface SectionImages {
  forWhom?: string
  whyLasertag?: string
  howToPlay?: string
  equipment?: string
  events?: string
}

interface ContentData {
  hero: { title: string; subtitle: string; ctaText: string; ctaSecondaryText: string; backgroundImage?: string }
  services: Array<{ id: number; icon: string; title: string; description: string }>
  gallery: Array<{ id: number; src: string; alt: string }>
  pricing: Array<{ id: number; name: string; price: string; duration: string; features: string[]; popular: boolean }>
  testimonials: Array<{ id: number; name: string; text: string; rating: number }>
  contact: { phone: string; email: string; address: string; workingHours: string; facebook: string; instagram: string }
  faq: Array<{ id: number; question: string; answer: string }>
  howToPlay: Array<{ id: number; icon: string; text: string }>
  sectionImages?: SectionImages
}

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  source: string | null
  message: string | null
  created_at: string
  status: string
}

export function AdminPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [content, setContent] = useState<ContentData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Translations state
  const [availableLanguages, setAvailableLanguages] = useState<Array<{ lang: string; updatedAt: string }>>([])
  const [selectedLang, setSelectedLang] = useState('uk')
  const [translations, setTranslations] = useState<Record<string, any> | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['nav', 'hero']))

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')

    if (token) {
      try {
        await api.verifyToken()
        setIsAuthenticated(true)
        loadContent()
        loadBookings()
        loadLanguages()
      } catch (error) {
        // Only logout on actual auth errors (401), not on network errors
        if (error instanceof Error && error.message.startsWith('401')) {
          api.logout()
          setIsAuthenticated(false)
        } else {
          // Network error or server not ready - keep user logged in and retry
          setIsAuthenticated(true)
          loadContent()
          loadBookings()
          loadLanguages()
        }
      }
    }

    setIsLoading(false)
  }

  const loadContent = async () => {
    try {
      const data = await api.getContent()
      // Ensure sectionImages is always initialized
      setContent({
        ...data,
        sectionImages: data.sectionImages || {
          forWhom: '',
          whyLasertag: '',
          howToPlay: '',
          equipment: '',
          events: '',
        }
      })
    } catch (error) {
      console.error('Failed to load content:', error)
    }
  }

  const loadBookings = async () => {
    try {
      const data = await api.getBookings()
      setBookings(data)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  const loadLanguages = async () => {
    try {
      const data = await api.getAvailableLanguages()
      setAvailableLanguages(data)
      if (data.length > 0) {
        loadTranslations(selectedLang)
      }
    } catch (error) {
      console.error('Failed to load languages:', error)
    }
  }

  const loadTranslations = async (lang: string) => {
    try {
      const data = await api.getTranslations(lang)
      setTranslations(data)
      setSelectedLang(lang)
    } catch (error) {
      console.error('Failed to load translations:', error)
    }
  }

  const saveTranslations = async () => {
    if (!translations) return
    setIsSaving(true)
    try {
      await api.updateTranslations(selectedLang, translations)
      showSaveMessage(`Переводы (${selectedLang}) сохранены`)
    } catch (error) {
      showSaveMessage('Ошибка сохранения переводов')
    }
    setIsSaving(false)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const updateTranslationValue = (path: string[], value: string) => {
    if (!translations) return
    setTranslations(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      let current: any = updated
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] }
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return updated
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await api.login(username, password)
      setIsAuthenticated(true)
      loadContent()
      loadBookings()
      loadLanguages()
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Ошибка входа')
    }
  }

  const handleLogout = () => {
    api.logout()
    setIsAuthenticated(false)
    setContent(null)
  }

  const showSaveMessage = (message: string) => {
    setSaveMessage(message)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  // Hero handlers
  const saveHero = async () => {
    if (!content) return
    setIsSaving(true)
    try {
      await api.updateHero(content.hero)
      showSaveMessage('Hero сохранён')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  const handleHeroImageUpload = async (file: File) => {
    try {
      const { url } = await api.uploadImage(file)
      setContent(prev => prev ? { ...prev, hero: { ...prev.hero, backgroundImage: url } } : null)
      showSaveMessage('Изображение загружено')
    } catch (error) {
      showSaveMessage('Ошибка загрузки файла')
    }
  }

  // Section Images handlers
  const saveSectionImages = async () => {
    if (!content?.sectionImages) return
    setIsSaving(true)
    try {
      await api.updateSectionImages(content.sectionImages)
      showSaveMessage('Изображения секций сохранены')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  const handleSectionImageUpload = async (file: File, sectionKey: keyof SectionImages) => {
    try {
      const { url } = await api.uploadImage(file)
      setContent(prev => {
        if (!prev) return null
        return {
          ...prev,
          sectionImages: { ...prev.sectionImages, [sectionKey]: url }
        }
      })
      showSaveMessage('Изображение загружено')
    } catch (error) {
      showSaveMessage('Ошибка загрузки файла')
    }
  }

  // Contact handlers
  const saveContact = async () => {
    if (!content) return
    setIsSaving(true)
    try {
      await api.updateContact(content.contact)
      showSaveMessage('Контакты сохранены')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  // Gallery handlers
  const saveGalleryItem = async (item: ContentData['gallery'][0]) => {
    setIsSaving(true)
    try {
      await api.updateGalleryItem(item.id, item)
      showSaveMessage('Изображение сохранено')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  const deleteGalleryItem = async (id: number) => {
    if (!confirm('Удалить изображение?')) return
    try {
      await api.deleteGalleryItem(id)
      setContent(prev => prev ? { ...prev, gallery: prev.gallery.filter(g => g.id !== id) } : null)
      showSaveMessage('Изображение удалено')
    } catch (error) {
      showSaveMessage('Ошибка удаления')
    }
  }

  const addGalleryItem = async () => {
    try {
      const newItem = await api.createGalleryItem({ src: '', alt: 'Новое изображение' })
      setContent(prev => prev ? { ...prev, gallery: [...prev.gallery, newItem] } : null)
    } catch (error) {
      showSaveMessage('Ошибка добавления')
    }
  }

  const handleImageUpload = async (file: File, galleryId: number) => {
    try {
      const { url } = await api.uploadImage(file)
      setContent(prev => {
        if (!prev) return null
        return {
          ...prev,
          gallery: prev.gallery.map(g => g.id === galleryId ? { ...g, src: url } : g)
        }
      })
      // Auto-save after upload
      const item = content?.gallery.find(g => g.id === galleryId)
      if (item) {
        await api.updateGalleryItem(galleryId, { ...item, src: url })
        showSaveMessage('Изображение загружено')
      }
    } catch (error) {
      showSaveMessage('Ошибка загрузки файла')
    }
  }

  // Pricing handlers
  const savePricing = async (plan: ContentData['pricing'][0]) => {
    setIsSaving(true)
    try {
      await api.updatePricing(plan.id, plan)
      showSaveMessage('Тариф сохранён')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  // Testimonials handlers
  const saveTestimonial = async (t: ContentData['testimonials'][0]) => {
    setIsSaving(true)
    try {
      await api.updateTestimonial(t.id, t)
      showSaveMessage('Отзыв сохранён')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return
    try {
      await api.deleteTestimonial(id)
      setContent(prev => prev ? { ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) } : null)
      showSaveMessage('Отзыв удалён')
    } catch (error) {
      showSaveMessage('Ошибка удаления')
    }
  }

  const addTestimonial = async () => {
    try {
      const newItem = await api.createTestimonial({ name: 'Новый отзыв', text: '', rating: 5 })
      setContent(prev => prev ? { ...prev, testimonials: [...prev.testimonials, newItem] } : null)
    } catch (error) {
      showSaveMessage('Ошибка добавления')
    }
  }

  // HowToPlay handlers
  const saveHowToPlayStep = async (step: ContentData['howToPlay'][0]) => {
    setIsSaving(true)
    try {
      await api.updateHowToPlayStep(step.id, step)
      showSaveMessage('Шаг сохранён')
    } catch (error) {
      showSaveMessage('Ошибка сохранения')
    }
    setIsSaving(false)
  }

  const deleteHowToPlayStep = async (id: number) => {
    if (!confirm('Удалить шаг?')) return
    try {
      await api.deleteHowToPlayStep(id)
      setContent(prev => prev ? { ...prev, howToPlay: prev.howToPlay.filter(s => s.id !== id) } : null)
      showSaveMessage('Шаг удалён')
    } catch (error) {
      showSaveMessage('Ошибка удаления')
    }
  }

  const addHowToPlayStep = async () => {
    try {
      const newItem = await api.createHowToPlayStep({ icon: 'Users', text: 'Новый шаг' })
      setContent(prev => prev ? { ...prev, howToPlay: [...prev.howToPlay, newItem] } : null)
    } catch (error) {
      showSaveMessage('Ошибка добавления')
    }
  }

  // Booking handlers
  const updateBookingStatus = async (id: number, status: string) => {
    try {
      await api.updateBookingStatus(id, status)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      showSaveMessage('Статус обновлён')
    } catch (error) {
      showSaveMessage('Ошибка обновления')
    }
  }

  const deleteBookingItem = async (id: number) => {
    if (!confirm('Удалить бронирование?')) return
    try {
      await api.deleteBooking(id)
      setBookings(prev => prev.filter(b => b.id !== id))
      showSaveMessage('Бронирование удалено')
    } catch (error) {
      showSaveMessage('Ошибка удаления')
    }
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background)' }}>
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Админ панель</CardTitle>
            <CardDescription>Введите логин и пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                />
                {loginError && <p className="text-sm text-destructive mt-1">{loginError}</p>}
              </div>
              <Button type="submit" className="w-full">Войти</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Админ панель - Lasertag Kiev</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Eye className="w-4 h-4 mr-2" />
              Сайт
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {saveMessage && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            {saveMessage}
          </div>
        )}

        {content && (
          <Tabs defaultValue="hero" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-9 gap-2">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="images">Изображения</TabsTrigger>
              <TabsTrigger value="gallery">Галерея</TabsTrigger>
              <TabsTrigger value="pricing">Цены</TabsTrigger>
              <TabsTrigger value="howtoplay">Як замовити</TabsTrigger>
              <TabsTrigger value="testimonials">Отзывы</TabsTrigger>
              <TabsTrigger value="contact">Контакты</TabsTrigger>
              <TabsTrigger value="bookings">Брони</TabsTrigger>
              <TabsTrigger value="translations">Переводы</TabsTrigger>
            </TabsList>

            {/* Hero Section */}
            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Главный экран (Hero)</CardTitle>
                  <CardDescription>
                    Тексты редактируются во вкладке "Переводы" → раздел "hero"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Фоновое изображение</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={content.hero.backgroundImage || ''}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, backgroundImage: e.target.value } })}
                        placeholder="https://example.com/image.jpg или /uploads/image.jpg"
                        className="flex-1"
                      />
                      <Label htmlFor="hero-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded hover:bg-secondary/80 whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        Загрузить
                      </Label>
                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleHeroImageUpload(file)
                        }}
                      />
                    </div>
                    {content.hero.backgroundImage && (
                      <div className="mt-2 relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-border">
                        <img
                          src={content.hero.backgroundImage}
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23333" width="400" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">Ошибка загрузки</text></svg>'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Button onClick={saveHero} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section Images */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Изображения секций</CardTitle>
                  <CardDescription>Изображения для различных секций сайта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: 'forWhom' as const, label: 'Для кого підходить лазертаг' },
                    { key: 'whyLasertag' as const, label: 'Чому саме лазертаг' },
                    { key: 'howToPlay' as const, label: 'Як пограти в лазертаг' },
                    { key: 'equipment' as const, label: 'Обладнання' },
                    { key: 'events' as const, label: 'Дні народження та корпоративи' },
                  ].map(({ key, label }) => (
                    <div key={key} className="p-4 border border-border rounded-lg space-y-3">
                      <Label className="text-base font-medium">{label}</Label>
                      <div className="flex gap-2">
                        <Input
                          value={content.sectionImages?.[key] || ''}
                          onChange={(e) => setContent({
                            ...content,
                            sectionImages: { ...content.sectionImages, [key]: e.target.value }
                          })}
                          placeholder="URL изображения"
                          className="flex-1"
                        />
                        <Label htmlFor={`section-${key}-upload`} className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded hover:bg-secondary/80 whitespace-nowrap">
                          <Upload className="w-4 h-4" />
                          Загрузить
                        </Label>
                        <input
                          id={`section-${key}-upload`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleSectionImageUpload(file, key)
                          }}
                        />
                      </div>
                      {content.sectionImages?.[key] && (
                        <div className="relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border border-border">
                          <img
                            src={content.sectionImages[key]}
                            alt={label}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23333" width="400" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">Ошибка загрузки</text></svg>'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <Button onClick={saveSectionImages} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить изображения
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Section */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Галерея</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.gallery.map((image, index) => (
                    <div key={image.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Изображение #{index + 1}</span>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteGalleryItem(image.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>URL</Label>
                          <Input
                            value={image.src}
                            onChange={(e) => {
                              const newGallery = [...content.gallery]
                              newGallery[index] = { ...image, src: e.target.value }
                              setContent({ ...content, gallery: newGallery })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Подпись</Label>
                          <Input
                            value={image.alt}
                            onChange={(e) => {
                              const newGallery = [...content.gallery]
                              newGallery[index] = { ...image, alt: e.target.value }
                              setContent({ ...content, gallery: newGallery })
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {image.src && (
                          <img src={image.src} alt={image.alt} className="w-24 h-18 object-cover rounded border" />
                        )}
                        <div>
                          <Label htmlFor={`upload-${image.id}`} className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-secondary rounded hover:bg-secondary/80">
                            <Upload className="w-4 h-4" />
                            Загрузить
                          </Label>
                          <input
                            id={`upload-${image.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, image.id)
                            }}
                          />
                        </div>
                        <Button size="sm" onClick={() => saveGalleryItem(image)} disabled={isSaving}>
                          <Save className="w-4 h-4 mr-2" />
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addGalleryItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить изображение
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Section */}
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Тарифы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.pricing.map((plan, index) => (
                    <div key={plan.id} className="p-4 border border-border rounded-lg space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{plan.name}</span>
                        {plan.popular && <span className="text-xs bg-primary text-white px-2 py-1 rounded">Популярный</span>}
                        {(plan as any).bestValue && <span className="text-xs bg-violet-500 text-white px-2 py-1 rounded">Лучшая цена</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Название</Label>
                          <Input
                            value={plan.name}
                            onChange={(e) => {
                              const newPricing = [...content.pricing]
                              newPricing[index] = { ...plan, name: e.target.value }
                              setContent({ ...content, pricing: newPricing })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Цена (грн)</Label>
                          <Input
                            value={plan.price}
                            onChange={(e) => {
                              const newPricing = [...content.pricing]
                              newPricing[index] = { ...plan, price: e.target.value }
                              setContent({ ...content, pricing: newPricing })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Длительность</Label>
                          <Input
                            value={plan.duration}
                            onChange={(e) => {
                              const newPricing = [...content.pricing]
                              newPricing[index] = { ...plan, duration: e.target.value }
                              setContent({ ...content, pricing: newPricing })
                            }}
                          />
                        </div>
                      </div>

                      {/* Features editing */}
                      <div>
                        <Label className="mb-2 block">Що входить (кожен пункт з нового рядка)</Label>
                        <Textarea
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const newPricing = [...content.pricing]
                            newPricing[index] = {
                              ...plan,
                              features: e.target.value.split('\n').filter(f => f.trim())
                            }
                            setContent({ ...content, pricing: newPricing })
                          }}
                          rows={5}
                          placeholder="Оренда обладнання&#10;Інструктаж&#10;До 10 гравців"
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.popular || false}
                            onChange={(e) => {
                              const newPricing = [...content.pricing]
                              newPricing[index] = { ...plan, popular: e.target.checked }
                              setContent({ ...content, pricing: newPricing })
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Найпопулярніший</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(plan as any).bestValue || false}
                            onChange={(e) => {
                              const newPricing = [...content.pricing]
                              newPricing[index] = { ...plan, bestValue: e.target.checked } as any
                              setContent({ ...content, pricing: newPricing })
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Найкраща цінність</span>
                        </label>
                      </div>
                      <Button size="sm" onClick={() => savePricing(plan)} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* HowToPlay Section */}
            <TabsContent value="howtoplay">
              <Card>
                <CardHeader>
                  <CardTitle>Як замовити гру (кроки)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.howToPlay?.map((step, index) => (
                    <div key={step.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Крок #{index + 1}</span>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteHowToPlayStep(step.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label>Іконка</Label>
                          <Input
                            value={step.icon}
                            onChange={(e) => {
                              const newSteps = [...(content.howToPlay || [])]
                              newSteps[index] = { ...step, icon: e.target.value }
                              setContent({ ...content, howToPlay: newSteps })
                            }}
                            placeholder="Users, Calendar, Phone..."
                          />
                        </div>
                        <div className="col-span-3">
                          <Label>Текст</Label>
                          <Input
                            value={step.text}
                            onChange={(e) => {
                              const newSteps = [...(content.howToPlay || [])]
                              newSteps[index] = { ...step, text: e.target.value }
                              setContent({ ...content, howToPlay: newSteps })
                            }}
                          />
                        </div>
                      </div>
                      <Button size="sm" onClick={() => saveHowToPlayStep(step)} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        Зберегти
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addHowToPlayStep}>
                    <Plus className="w-4 h-4 mr-2" />
                    Додати крок
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Section */}
            <TabsContent value="testimonials">
              <Card>
                <CardHeader>
                  <CardTitle>Отзывы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.testimonials.map((t, index) => (
                    <div key={t.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t.name}</span>
                          <span className="text-yellow-500">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTestimonial(t.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Имя</Label>
                          <Input
                            value={t.name}
                            onChange={(e) => {
                              const newT = [...content.testimonials]
                              newT[index] = { ...t, name: e.target.value }
                              setContent({ ...content, testimonials: newT })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Рейтинг (1-5)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={t.rating}
                            onChange={(e) => {
                              const newT = [...content.testimonials]
                              newT[index] = { ...t, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }
                              setContent({ ...content, testimonials: newT })
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Отзыв</Label>
                        <Textarea
                          value={t.text}
                          onChange={(e) => {
                            const newT = [...content.testimonials]
                            newT[index] = { ...t, text: e.target.value }
                            setContent({ ...content, testimonials: newT })
                          }}
                        />
                      </div>
                      <Button size="sm" onClick={() => saveTestimonial(t)} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addTestimonial}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить отзыв
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Section */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Контакты</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Телефон</Label>
                      <Input
                        value={content.contact.phone}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={content.contact.email}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Адрес</Label>
                    <Textarea
                      value={content.contact.address}
                      onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Часы работы</Label>
                    <Input
                      value={content.contact.workingHours}
                      onChange={(e) => setContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        value={content.contact.facebook}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, facebook: e.target.value } })}
                      />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input
                        value={content.contact.instagram}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, instagram: e.target.value } })}
                      />
                    </div>
                  </div>
                  <Button onClick={saveContact} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить контакты
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Section */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Бронирования</CardTitle>
                    <CardDescription>Заявки с сайта</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadBookings}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Обновить
                  </Button>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет бронирований</p>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{booking.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(booking.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                className="text-sm border border-border rounded px-2 py-1 bg-background"
                              >
                                <option value="new">Новая</option>
                                <option value="confirmed">Подтверждена</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteBookingItem(booking.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                          {booking.message && (
                            <p className="mt-2 text-sm text-muted-foreground">{booking.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Translations Section */}
            <TabsContent value="translations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Переводы
                    </CardTitle>
                    <CardDescription>Редактирование текстов на разных языках</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLang}
                      onChange={(e) => loadTranslations(e.target.value)}
                      className="border border-border rounded px-3 py-2 bg-background"
                    >
                      {availableLanguages.map((l) => (
                        <option key={l.lang} value={l.lang}>
                          {l.lang === 'uk' ? 'Українська' : l.lang === 'ru' ? 'Русский' : l.lang === 'en' ? 'English' : l.lang}
                        </option>
                      ))}
                    </select>
                    <Button onClick={saveTranslations} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {translations ? (
                    <div className="space-y-4">
                      {Object.entries(translations).map(([section, values]) => (
                        <div key={section} className="border border-border rounded-lg">
                          <button
                            onClick={() => toggleSection(section)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium capitalize">{section}</span>
                            {expandedSections.has(section) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          {expandedSections.has(section) && (
                            <div className="p-4 pt-0 space-y-3">
                              {typeof values === 'object' && values !== null ? (
                                Object.entries(values).map(([key, val]) => (
                                  <div key={key}>
                                    {typeof val === 'object' && val !== null ? (
                                      // Nested object (e.g., sourceOptions)
                                      <div className="ml-4 space-y-2">
                                        <Label className="text-muted-foreground text-xs">{key}</Label>
                                        {Object.entries(val).map(([subKey, subVal]) => (
                                          <div key={subKey} className="grid grid-cols-3 gap-2 items-center">
                                            <Label className="text-sm text-muted-foreground">{subKey}</Label>
                                            <Input
                                              className="col-span-2"
                                              value={String(subVal)}
                                              onChange={(e) => updateTranslationValue([section, key, subKey], e.target.value)}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      // Simple key-value
                                      <div className="grid grid-cols-3 gap-2 items-center">
                                        <Label className="text-sm text-muted-foreground">{key}</Label>
                                        {String(val).length > 60 ? (
                                          <Textarea
                                            className="col-span-2"
                                            value={String(val)}
                                            onChange={(e) => updateTranslationValue([section, key], e.target.value)}
                                            rows={2}
                                          />
                                        ) : (
                                          <Input
                                            className="col-span-2"
                                            value={String(val)}
                                            onChange={(e) => updateTranslationValue([section, key], e.target.value)}
                                          />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <Input
                                  value={String(values)}
                                  onChange={(e) => updateTranslationValue([section], e.target.value)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Загрузка переводов...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
