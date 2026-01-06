const API_BASE = '/api'

export function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

export function setToken(token: string): void {
  localStorage.setItem('admin_token', token)
}

export function removeToken(): void {
  localStorage.removeItem('admin_token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(`${response.status}: ${error.error || 'HTTP error'}`)
  }

  return response.json()
}

// Auth
export async function login(username: string, password: string) {
  const data = await fetchApi<{ token: string; user: { id: number; username: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(data.token)
  return data
}

export async function verifyToken() {
  return fetchApi<{ id: number; username: string }>('/auth/me')
}

export function logout() {
  removeToken()
}

// Content
export async function getContent() {
  return fetchApi<any>('/content')
}

export async function updateHero(data: { title: string; subtitle: string; ctaText: string; ctaSecondaryText: string; backgroundImage?: string }) {
  return fetchApi<any>('/content/hero', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function updateContact(data: {
  phone: string
  email: string
  address: string
  workingHours: string
  facebook: string
  instagram: string
}) {
  return fetchApi<any>('/content/contact', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Services
export async function getServices() {
  return fetchApi<any[]>('/content/services')
}

export async function createService(data: { icon: string; title: string; description: string }) {
  return fetchApi<any>('/content/services', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateService(id: number, data: { icon: string; title: string; description: string }) {
  return fetchApi<any>(`/content/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteService(id: number) {
  return fetchApi<any>(`/content/services/${id}`, { method: 'DELETE' })
}

// Gallery
export async function getGallery() {
  return fetchApi<any[]>('/content/gallery')
}

export async function createGalleryItem(data: { src: string; alt: string }) {
  return fetchApi<any>('/content/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateGalleryItem(id: number, data: { src: string; alt: string }) {
  return fetchApi<any>(`/content/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteGalleryItem(id: number) {
  return fetchApi<any>(`/content/gallery/${id}`, { method: 'DELETE' })
}

// Pricing
export async function getPricing() {
  return fetchApi<any[]>('/content/pricing')
}

export async function createPricing(data: { name: string; price: string; duration: string; features: string[]; popular: boolean }) {
  return fetchApi<any>('/content/pricing', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePricing(id: number, data: { name: string; price: string; duration: string; features: string[]; popular: boolean }) {
  return fetchApi<any>(`/content/pricing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePricing(id: number) {
  return fetchApi<any>(`/content/pricing/${id}`, { method: 'DELETE' })
}

// Testimonials
export async function getTestimonials() {
  return fetchApi<any[]>('/content/testimonials')
}

export async function createTestimonial(data: { name: string; text: string; rating: number }) {
  return fetchApi<any>('/content/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTestimonial(id: number, data: { name: string; text: string; rating: number }) {
  return fetchApi<any>(`/content/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTestimonial(id: number) {
  return fetchApi<any>(`/content/testimonials/${id}`, { method: 'DELETE' })
}

// FAQ
export async function getFaq() {
  return fetchApi<any[]>('/content/faq')
}

export async function createFaq(data: { question: string; answer: string }) {
  return fetchApi<any>('/content/faq', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateFaq(id: number, data: { question: string; answer: string }) {
  return fetchApi<any>(`/content/faq/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteFaq(id: number) {
  return fetchApi<any>(`/content/faq/${id}`, { method: 'DELETE' })
}

// How to Play
export async function getHowToPlay() {
  return fetchApi<any[]>('/content/how-to-play')
}

export async function createHowToPlayStep(data: { icon: string; text: string }) {
  return fetchApi<any>('/content/how-to-play', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateHowToPlayStep(id: number, data: { icon: string; text: string }) {
  return fetchApi<any>(`/content/how-to-play/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteHowToPlayStep(id: number) {
  return fetchApi<any>(`/content/how-to-play/${id}`, { method: 'DELETE' })
}

// Bookings
export async function getBookings() {
  return fetchApi<any[]>('/bookings')
}

export async function updateBookingStatus(id: number, status: string) {
  return fetchApi<any>(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function deleteBooking(id: number) {
  return fetchApi<any>(`/bookings/${id}`, { method: 'DELETE' })
}

// Feedback
export async function getFeedback() {
  return fetchApi<any[]>('/feedback')
}

export async function deleteFeedback(id: number) {
  return fetchApi<any>(`/feedback/${id}`, { method: 'DELETE' })
}

// Translations
export async function getTranslations(lang: string) {
  return fetchApi<Record<string, any>>(`/translations/${lang}`)
}

export async function getAvailableLanguages() {
  return fetchApi<Array<{ lang: string; updatedAt: string }>>('/translations')
}

export async function updateTranslations(lang: string, data: Record<string, any>) {
  return fetchApi<{ success: boolean }>(`/translations/${lang}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  })
}

export async function addLanguage(lang: string, data: Record<string, any>) {
  return fetchApi<{ success: boolean }>('/translations', {
    method: 'POST',
    body: JSON.stringify({ lang, data }),
  })
}

export async function deleteLanguage(lang: string) {
  return fetchApi<{ success: boolean }>(`/translations/${lang}`, { method: 'DELETE' })
}

// Section Images
export async function updateSectionImages(data: {
  forWhom?: string
  whyLasertag?: string
  howToPlay?: string
  equipment?: string
  events?: string
}) {
  return fetchApi<any>('/content/section-images', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Upload
export async function uploadImage(file: File): Promise<{ url: string }> {
  const token = getToken()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}
