import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, ChevronDown, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  TelegramIcon,
  WhatsAppIcon,
  ViberIcon,
} from '@/components/icons/MessengerIcons'

const navItems = [
  { key: 'forWhom', href: '#for-whom' },
  { key: 'gallery', href: '#gallery' },
  { key: 'pricing', href: '#pricing' },
  { key: 'events', href: '#events' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
]

const languages = [
  { code: 'uk', name: 'UA' },
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
]

// Contact links
const TELEGRAM_URL = 'https://t.me/GanzPaintball'
const WHATSAPP_URL = 'https://wa.me/380672040707'
const VIBER_URL = 'viber://chat?number=%2B380672040707'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      if (heroSection) {
        // Consider scrolled past hero when we've scrolled past 80% of hero height
        const heroHeight = heroSection.offsetHeight
        const threshold = heroHeight - 100 // Switch colors 100px before hero ends
        setIsScrolled(window.scrollY > threshold)
      } else {
        setIsScrolled(window.scrollY > 50)
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  // When on hero (not scrolled), use white text. When scrolled, use theme colors
  const textColorClass = isScrolled
    ? 'text-foreground/70 hover:text-foreground'
    : 'text-white/80 hover:text-white'

  const iconColorClass = isScrolled
    ? 'text-foreground/60'
    : 'text-white/70'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border'
          : 'bg-black/20 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#hero')
            }}
            className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-wider group cursor-pointer"
          >
            <div className={cn(
              "w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-colors",
              isScrolled ? "bg-primary/10 group-hover:bg-primary/20" : "bg-white/10 group-hover:bg-white/20"
            )}>
              <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <span className={cn(
              "transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}>LASERTAG</span>
          </a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.href)
                }}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg",
                  textColorClass
                )}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Messenger Icons - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("p-2 hover:text-[#0088cc] transition-colors cursor-pointer", iconColorClass)}
                title="Telegram"
              >
                <TelegramIcon className="w-5 h-5" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("p-2 hover:text-[#25D366] transition-colors cursor-pointer", iconColorClass)}
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href={VIBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("p-2 hover:text-[#7360F2] transition-colors cursor-pointer", iconColorClass)}
                title="Viber"
              >
                <ViberIcon className="w-5 h-5" />
              </a>
            </div>

            {/* Language Selector - Separate */}
            <div className="hidden sm:block">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1 px-3 h-8 justify-center cursor-pointer",
                      isScrolled
                        ? "hover:bg-muted text-foreground"
                        : "hover:bg-white/10 text-white"
                    )}
                  >
                    <span className="text-sm font-medium">{currentLang.name}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[80px]">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="cursor-pointer justify-center font-medium"
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Theme Toggle - Separate */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                "hidden sm:flex px-2 h-8 cursor-pointer",
                isScrolled
                  ? "hover:bg-muted text-foreground"
                  : "hover:bg-white/10 text-white"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* CTA Button - Desktop */}
            <Button
              variant="glow"
              size="sm"
              className="hidden sm:flex gap-2 cursor-pointer"
              onClick={() => scrollToSection('#booking')}
            >
              {t('hero.cta')}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                isScrolled ? "text-foreground" : "text-white"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-white dark:bg-gradient-to-b dark:from-[#0a0a0a] dark:to-[#0a1628]">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.href)
                  }}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}

              {/* Mobile Messengers */}
              <div className="flex items-center gap-4 px-4 py-3">
                <span className="text-sm text-muted-foreground">{t('contact.title')}:</span>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground/60 hover:text-[#0088cc] transition-colors cursor-pointer"
                >
                  <TelegramIcon className="w-6 h-6" />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground/60 hover:text-[#25D366] transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                </a>
                <a
                  href={VIBER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground/60 hover:text-[#7360F2] transition-colors cursor-pointer"
                >
                  <ViberIcon className="w-6 h-6" />
                </a>
              </div>

              {/* Mobile Language & Theme */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border mt-2">
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={i18n.language === lang.code ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeLanguage(lang.code)}
                      className="px-3 font-medium"
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Mobile CTA */}
              <div className="px-4 pt-3">
                <Button
                  variant="glow"
                  className="w-full"
                  onClick={() => scrollToSection('#booking')}
                >
                  {t('hero.cta')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
