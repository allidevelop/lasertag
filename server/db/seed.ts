import { db } from './database'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

export async function seedDatabase() {
  // Check if already seeded
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number }
  if (adminExists.count > 0) {
    console.log('Database already seeded, skipping...')
    // But still check if translations need to be seeded
    seedTranslationsIfNeeded()
    // Add more testimonials if needed
    addMoreTestimonialsIfNeeded()
    return
  }

  console.log('Seeding database...')

  // Create admin user
  const passwordHash = await bcrypt.hash('lasertag2024', 10)
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', passwordHash)

  // Hero settings
  const heroData = {
    title: 'LASERTAG KIEV',
    subtitle: 'Незабываемые лазерные бои на ВДНГ',
    ctaText: 'Забронировать игру',
    ctaSecondaryText: 'Узнать больше',
  }
  db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('hero', JSON.stringify(heroData))

  // Contact settings
  const contactData = {
    phone: '(097) 204-07-07',
    email: 'info@lasertag.kiev.ua',
    address: 'Киев, ВДНГ (Выставка достижений народного хозяйства)',
    workingHours: 'Пн-Вс: 10:00 - 22:00',
    facebook: 'https://www.facebook.com/ganz.paintball',
    instagram: 'https://www.instagram.com/ganzpaintball',
  }
  db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('contact', JSON.stringify(contactData))

  // Services
  const services = [
    { icon: 'Target', title: 'Лазертаг на открытом воздухе', description: 'Большие игровые площадки на территории ВДНГ с естественными укрытиями и тактическими позициями.', sort_order: 1 },
    { icon: 'Building', title: 'Крытый лазертаг', description: 'Комфортная игра в любую погоду в специально оборудованном крытом помещении.', sort_order: 2 },
    { icon: 'PartyPopper', title: 'Дни рождения', description: 'Организация незабываемых детских и взрослых праздников с лазертаг-баталиями.', sort_order: 3 },
    { icon: 'Users', title: 'Корпоративы', description: 'Командные игры и тимбилдинг для корпоративных мероприятий любого масштаба.', sort_order: 4 },
    { icon: 'Flame', title: 'Зона барбекю', description: 'Отдохните после игры в уютной зоне барбекю с друзьями и семьей.', sort_order: 5 },
    { icon: 'Trophy', title: 'Турниры', description: 'Регулярные соревнования и турниры с призами для настоящих любителей лазертага.', sort_order: 6 },
  ]
  const insertService = db.prepare('INSERT INTO services (icon, title, description, sort_order) VALUES (?, ?, ?, ?)')
  for (const service of services) {
    insertService.run(service.icon, service.title, service.description, service.sort_order)
  }

  // Gallery
  const gallery = [
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/1.jpg', alt: 'Зображення 1', sort_order: 1 },
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/2.jpg', alt: 'Зображення 2', sort_order: 2 },
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/3.jpg', alt: 'Зображення 3', sort_order: 3 },
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/4.jpg', alt: 'Зображення 4', sort_order: 4 },
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/5.jpg', alt: 'Зображення 5', sort_order: 5 },
    { src: 'https://lasertag.kiev.ua/wp-content/uploads/2020/06/6.jpg', alt: 'Зображення 6', sort_order: 6 },
  ]
  const insertGallery = db.prepare('INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)')
  for (const image of gallery) {
    insertGallery.run(image.src, image.alt, image.sort_order)
  }

  // Pricing
  const pricing = [
    {
      name: 'Базовый',
      price: '300',
      duration: '1 час',
      features: JSON.stringify(['Аренда оборудования', 'Инструктаж', 'До 10 игроков', 'Открытая площадка']),
      popular: 0,
      sort_order: 1,
    },
    {
      name: 'Стандарт',
      price: '500',
      duration: '2 часа',
      features: JSON.stringify(['Аренда оборудования', 'Инструктаж', 'До 20 игроков', 'Открытая + крытая площадка', 'Фото на память']),
      popular: 1,
      sort_order: 2,
    },
    {
      name: 'Премиум',
      price: '800',
      duration: '3 часа',
      features: JSON.stringify(['Премиум оборудование', 'Персональный инструктор', 'До 30 игроков', 'Все площадки', 'Фото и видео съемка', 'Зона барбекю']),
      popular: 0,
      sort_order: 3,
    },
  ]
  const insertPricing = db.prepare('INSERT INTO pricing (name, price, duration, features, popular, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
  for (const plan of pricing) {
    insertPricing.run(plan.name, plan.price, plan.duration, plan.features, plan.popular, plan.sort_order)
  }

  // Testimonials
  const testimonials = [
    { name: 'Александр К.', text: 'Отличное место для корпоратива! Команда осталась в восторге, уже планируем следующий визит.', rating: 5 },
    { name: 'Мария С.', text: 'Праздновали день рождения сына. Дети были счастливы, организация на высшем уровне!', rating: 5 },
    { name: 'Дмитрий В.', text: 'Современное оборудование, большая территория, приветливый персонал. Рекомендую!', rating: 5 },
    { name: 'Олена П.', text: 'Чудове місце для активного відпочинку! Діти в захваті, а дорослі нарешті відволіклися від телефонів.', rating: 5 },
    { name: 'Іван Т.', text: 'Вже третій раз приходимо з друзями. Завжди весело, інструктори професійні, атмосфера супер!', rating: 5 },
    { name: 'Наталія К.', text: 'Святкували день народження доньки. Все організовано на найвищому рівні, дякуємо команді!', rating: 5 },
    { name: 'Сергій М.', text: 'Прийшли компанією з роботи на тімбілдінг. Всі залишились задоволені, особливо сподобалися тактичні сценарії.', rating: 5 },
    { name: 'Андрій Л.', text: 'Сучасне обладнання, велика територія, привітний персонал. Однозначно рекомендую для сімейного відпочинку!', rating: 5 },
    { name: 'Юлія В.', text: 'Нарешті знайшли ідеальне місце для активного дозвілля. Діти просять повернутися щотижня!', rating: 5 },
  ]
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')
  for (const testimonial of testimonials) {
    insertTestimonial.run(testimonial.name, testimonial.text, testimonial.rating)
  }

  // FAQ
  const faq = [
    { question: 'С какого возраста можно играть в лазертаг?', answer: 'Минимальный возраст для участия — 6 лет. Для детей до 12 лет рекомендуется присутствие взрослого.', sort_order: 1 },
    { question: 'Что нужно взять с собой?', answer: 'Только удобную одежду и обувь. Все оборудование предоставляется на месте.', sort_order: 2 },
    { question: 'Можно ли забронировать площадку для частного мероприятия?', answer: 'Да, мы организуем частные мероприятия, корпоративы и дни рождения. Свяжитесь с нами для деталей.', sort_order: 3 },
  ]
  const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)')
  for (const item of faq) {
    insertFaq.run(item.question, item.answer, item.sort_order)
  }

  // Seed translations
  seedTranslationsIfNeeded()

  console.log('Database seeded successfully')
}

// Add more testimonials if there are only 3
function addMoreTestimonialsIfNeeded() {
  const count = db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as { count: number }
  if (count.count >= 6) {
    return // Already have enough
  }

  console.log('Adding more testimonials...')

  const newTestimonials = [
    { name: 'Олена П.', text: 'Чудове місце для активного відпочинку! Діти в захваті, а дорослі нарешті відволіклися від телефонів.', rating: 5 },
    { name: 'Іван Т.', text: 'Вже третій раз приходимо з друзями. Завжди весело, інструктори професійні, атмосфера супер!', rating: 5 },
    { name: 'Наталія К.', text: 'Святкували день народження доньки. Все організовано на найвищому рівні, дякуємо команді!', rating: 5 },
    { name: 'Сергій М.', text: 'Прийшли компанією з роботи на тімбілдінг. Всі залишились задоволені, особливо сподобалися тактичні сценарії.', rating: 5 },
    { name: 'Андрій Л.', text: 'Сучасне обладнання, велика територія, привітний персонал. Однозначно рекомендую для сімейного відпочинку!', rating: 5 },
    { name: 'Юлія В.', text: 'Нарешті знайшли ідеальне місце для активного дозвілля. Діти просять повернутися щотижня!', rating: 5 },
  ]

  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')
  for (const testimonial of newTestimonials) {
    insertTestimonial.run(testimonial.name, testimonial.text, testimonial.rating)
  }

  console.log('Added 6 new testimonials')
}

// Seed translations from JSON files
function seedTranslationsIfNeeded() {
  const translationsCount = db.prepare('SELECT COUNT(*) as count FROM translations').get() as { count: number }
  if (translationsCount.count > 0) {
    return // Already seeded
  }

  console.log('Seeding translations...')

  const localesDir = path.join(process.cwd(), 'src', 'i18n', 'locales')
  const languages = ['uk', 'ru', 'en']

  const insertTranslation = db.prepare('INSERT INTO translations (lang, data) VALUES (?, ?)')

  for (const lang of languages) {
    try {
      const filePath = path.join(localesDir, `${lang}.json`)
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8')
        // Validate JSON
        JSON.parse(data)
        insertTranslation.run(lang, data)
        console.log(`  - ${lang} translations loaded`)
      }
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error)
    }
  }
}
