import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/i18n'
import App from './App.tsx'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ContentProvider } from '@/contexts/ContentContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </ThemeProvider>
  </StrictMode>,
)
