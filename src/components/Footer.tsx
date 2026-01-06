import { useTranslation } from 'react-i18next'
import { Crosshair, Heart } from 'lucide-react'

// Colorful payment icons as inline SVGs
function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
      <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"/>
    </svg>
  )
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#3F51B5" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
      <circle cx="30" cy="24" r="10" fill="#FF9800"/>
      <circle cx="18" cy="24" r="10" fill="#F44336"/>
      <path fill="#FF7043" d="M24,17.5c-2.032,1.873-3.5,4.513-3.5,7.5s1.468,5.627,3.5,7.5c2.032-1.873,3.5-4.513,3.5-7.5S26.032,19.373,24,17.5z"/>
    </svg>
  )
}

function ApplePayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#212121" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
      <path fill="#FFF" d="M17.291 17.5c.58-.71.98-1.69.87-2.67-.84.03-1.86.56-2.46 1.27-.54.62-1.01 1.62-.88 2.58.93.07 1.89-.47 2.47-1.18zm.86 1.28c-1.36-.08-2.52.77-3.17.77-.65 0-1.65-.75-2.72-.73-1.4.02-2.69.81-3.41 2.07-1.46 2.52-.38 6.26 1.04 8.31.69 1.01 1.52 2.14 2.61 2.1 1.04-.04 1.44-.68 2.7-.68 1.26 0 1.62.68 2.72.66 1.12-.02 1.83-1.03 2.52-2.04.79-1.16 1.11-2.28 1.13-2.34-.02-.01-2.17-.84-2.19-3.31-.02-2.07 1.69-3.06 1.77-3.11-.97-1.43-2.47-1.59-3-1.62v-.08zm9.62.02v11.1h1.72v-3.8h2.38c2.17 0 3.7-1.49 3.7-3.65s-1.5-3.65-3.64-3.65h-4.16zm1.72 1.45h1.98c1.49 0 2.34.79 2.34 2.2s-.85 2.21-2.35 2.21h-1.97v-4.41zm9.94 9.75c1.08 0 2.08-.55 2.54-1.42h.04v1.33h1.59v-5.52c0-1.6-1.28-2.63-3.24-2.63-1.81 0-3.14.95-3.19 2.25h1.54c.13-.62.71-1.03 1.58-1.03 1.02 0 1.59.47 1.59 1.35v.59l-2.08.12c-1.93.12-2.98.9-2.98 2.27 0 1.39 1.1 2.32 2.61 2.32v.37zm.4-1.25c-.89 0-1.46-.43-1.46-1.09 0-.68.55-1.07 1.6-1.13l1.85-.11v.6c0 1.01-.86 1.73-1.99 1.73z"/>
    </svg>
  )
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#4285F4" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
      <path fill="#FFF" d="M23.5 24.5v3h4.3c-.2 1-.7 1.8-1.4 2.4-1 .8-2.2 1.2-3.8 1.2-3 0-5.5-2.4-5.5-5.4s2.5-5.4 5.5-5.4c1.5 0 2.8.5 3.8 1.5l2.1-2.1c-1.5-1.4-3.5-2.2-5.9-2.2-4.9 0-8.8 3.9-8.8 8.8s3.9 8.2 8.8 8.2c2.5 0 4.5-.8 6-2.2 1.6-1.5 2.1-3.7 2.1-5.4 0-.5 0-1-.1-1.4h-7.1z"/>
      <path fill="#FBBC05" d="M10.2 28.2l-1.6 1.2c1.3 2 3.6 3.3 6.2 3.3 2 0 3.7-.6 5-1.8l-1.5-1.2c-1 .8-2.2 1.2-3.5 1.2-2.1 0-3.9-1.4-4.6-3.4"/>
      <path fill="#34A853" d="M14.8 15.5c2.6 0 4.8 1.3 6.2 3.3l1.6-1.2c-1.8-2.6-4.7-4.3-7.8-4.3-3.5 0-6.5 1.9-8.2 4.7l1.6 1.2c1.3-2.4 3.7-3.7 6.6-3.7"/>
      <path fill="#EA4335" d="M8.6 24.7c0-1 .2-2 .5-2.9l-1.6-1.2c-.7 1.3-1.1 2.7-1.1 4.2 0 1.5.4 2.9 1.1 4.2l1.6-1.2c-.3-.9-.5-1.9-.5-3.1"/>
    </svg>
  )
}

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">LASERTAG KIEV</span>
          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">{t('footer.payment')}:</span>
            <div className="flex items-center gap-2">
              <VisaIcon className="h-7 md:h-8 w-auto rounded" />
              <MastercardIcon className="h-7 md:h-8 w-auto rounded" />
              <ApplePayIcon className="h-7 md:h-8 w-auto rounded" />
              <GooglePayIcon className="h-7 md:h-8 w-auto rounded" />
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} Lasertag Kiev.</span>
            <span>{t('footer.rights')}.</span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>in Kyiv</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
