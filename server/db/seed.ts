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
    // Migrate data if needed
    migrateDataIfNeeded()
    return
  }

  console.log('Seeding database...')

  // Create admin user
  const passwordHash = await bcrypt.hash('lasertag2024', 10)
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', passwordHash)

  // Hero settings
  const heroData = {
    title: 'Лазертаг у Києві',
    subtitle: 'Дні народження • Корпоративи • Компанії друзів • Активний відпочинок',
    ctaText: 'Забронювати гру',
    ctaSecondaryText: 'Дізнатись вартість',
    backgroundImage: 'https://ngame.it/wp-content/uploads/2023/09/lasertag-outdoor-1.jpg',
  }
  db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('hero', JSON.stringify(heroData))

  // Contact settings
  const contactData = {
    phone: '(097) 204-07-07',
    email: 'info@ganz-paintball.com',
    address: 'Київ, ВДНГ, павільйон 21 (пр. Академіка Глушкова, 1)',
    workingHours: 'Пн-Нд: 10:00 - 20:00',
    facebook: 'https://www.facebook.com/ganz.paintball',
    instagram: 'https://www.instagram.com/ganzpaintball',
  }
  db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('contact', JSON.stringify(contactData))

  // Services
  const services = [
    { icon: 'Trees', title: 'Лісовий лазертаг', description: 'Ігри на відкритому повітрі в лісовій зоні ВДНГ. Природні укриття та тактичні позиції для захоплюючих баталій.', sort_order: 1 },
    { icon: 'Building2', title: 'Аренний лазертаг', description: 'Критий лазертаг в приміщенні ТРЦ "Україна". Комфортна гра в будь-яку погоду.', sort_order: 2 },
    { icon: 'Truck', title: 'Виїзний лазертаг', description: 'Організуємо гру на вашій території. Привеземо обладнання та проведемо захід будь-де.', sort_order: 3 },
    { icon: 'Cake', title: 'Дні народження', description: "Незабутні дитячі свята з лазертаг-баталіями. Для дітей від 7 років. Аніматори, квести, кейтеринг.", sort_order: 4 },
    { icon: 'Users', title: 'Корпоративи та тімбілдінг', description: 'Командні ігри для корпоративних заходів. До 30 осіб на площадці. 99+ ігрових сценаріїв.', sort_order: 5 },
    { icon: 'Flame', title: 'Альтанки та барбекю', description: 'Затишні альтанки для відпочинку після гри. Можливість замовлення кейтерингу.', sort_order: 6 },
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

  // Pricing - features are translation keys (rental, instructor, scenarios, stats, photo)
  const pricing = [
    {
      name: '1 година',
      price: '600',
      duration: '60 хвилин',
      features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]),
      popular: 0,
      best_value: 0,
      sort_order: 1,
    },
    {
      name: '1.5 години',
      price: '900',
      duration: '90 хвилин',
      features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]),
      popular: 1,
      best_value: 0,
      sort_order: 2,
    },
    {
      name: '2 години',
      price: '1100',
      duration: '120 хвилин',
      features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]),
      popular: 0,
      best_value: 1,
      sort_order: 3,
    },
  ]
  const insertPricing = db.prepare('INSERT INTO pricing (name, price, duration, features, popular, best_value, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)')
  for (const plan of pricing) {
    insertPricing.run(plan.name, plan.price, plan.duration, plan.features, plan.popular, plan.best_value, plan.sort_order)
  }

  // Testimonials
  const testimonials = [
    { name: 'Олена М.', text: "Сьогодні відвідали це чудове місце. Грали в гру лазертаг. І хоча рахунок 2:2, але кожен відчув себе переможцем. Дякую привітним інструкторам. Місце куди я хочу ще повернутися!", rating: 5 },
    { name: 'Ірина К.', text: "Дуже сподобалось! Святкували дитяче день народження, замовили лазертаг. Малі були в захваті, такі атмосферні бої були, стільки вражень. Сподобалось, що все проходило на відкритому повітрі.", rating: 5 },
    { name: 'Марія С.', text: "Дякую за чудову гру! Діти в захваті! Окрема подяка інструктору Артему!", rating: 5 },
    { name: 'Андрій В.', text: "Ми провели тут тімбілдінг і всім дуже сподобалось! Дуже багато захисних споруд на полі, що роблять гру набагато цікавішою. Рекомендую для корпоративів!", rating: 5 },
    { name: 'Дмитро Л.', text: 'Грали з друзями на день народження. Інструктор Сергій все чудово організував. Цікава локація в лісі на ВДНГ. Задоволення отримали не тільки хлопці, а й дівчата!', rating: 5 },
    { name: 'Олександр П.', text: "Були з колегами на тімбілдінгу. Спочатку скептично ставився до лазертагу, думав це для дітей. Але коли почалася гра — всі перетворились на справжніх бійців! Емоції неймовірні, особливо коли виграєш у фіналі. Інструктор пояснив правила дуже зрозуміло.", rating: 5 },
    { name: 'Катерина Б.', text: "Святкували день народження доньки (9 років). Діти грали 2 години і не хотіли зупинятись! Дуже зручно, що є альтанка — поки діти грали, ми спокійно підготували стіл. Окреме дякую за терпіння з малечею.", rating: 5 },
    { name: 'Віталій М.', text: "Вже втретє приїжджаємо з друзями. Подобається, що кожного разу нові сценарії — не набридає. Локація в лісі атмосферна, є де сховатись і влаштувати засідку. Ціни адекватні, обладнання працює без збоїв.", rating: 5 },
    { name: 'Наталія К.', text: "Чоловік подарував на річницю весілля гру в лазертаг замість ресторану. Спочатку здивувалась, але це було найкраще побачення за останні роки! Сміялись як діти, бігали по лісу. Рекомендую парам для незвичайного відпочинку.", rating: 5 },
  ]
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')
  for (const testimonial of testimonials) {
    insertTestimonial.run(testimonial.name, testimonial.text, testimonial.rating)
  }

  // FAQ
  const faq = [
    { question: 'З якого віку можна грати в лазертаг?', answer: 'Мінімальний вік для участі — 7 років. Гра абсолютно безпечна для дітей та дорослих, лазерні (інфрачервоні) промені нешкідливі.', sort_order: 1 },
    { question: 'Що потрібно взяти з собою?', answer: 'Тільки зручний одяг та спортивне взуття. Рекомендуємо кепку. Все обладнання надається на місці. Спеціальна екіпіровка не потрібна.', sort_order: 2 },
    { question: 'Скільки людей може грати одночасно?', answer: 'На одній площадці можуть грати до 30 осіб. У нас є 3 ігрові площадки, тому можемо прийняти великі групи.', sort_order: 3 },
    { question: 'Чи є лазертаг чесною грою?', answer: 'Так! Всі влучання фіксуються електронно датчиками на жилетах. Після гри кожен гравець отримує статистику: кількість влучань та поразок.', sort_order: 4 },
    { question: 'Чи можна замовити їжу та напої?', answer: "Так, у нас є затишні альтанки для відпочинку та можливість замовлення кейтерингу. Ідеально для святкування днів народження та корпоративів.", sort_order: 5 },
  ]
  const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)')
  for (const item of faq) {
    insertFaq.run(item.question, item.answer, item.sort_order)
  }

  // How to Play steps
  const howToPlay = [
    { icon: 'Users', text: 'Збираєте компанію від 8 осіб', sort_order: 1 },
    { icon: 'Calendar', text: 'Обираєте дату та час гри', sort_order: 2 },
    { icon: 'Phone', text: 'Замовляєте гру на сайті або за телефоном', sort_order: 3 },
    { icon: 'Clock', text: 'Приходите в клуб за 15 хвилин раніше', sort_order: 4 },
    { icon: 'Crosshair', text: 'Отримуєте комплект обладнання та проходите інструктаж', sort_order: 5 },
    { icon: 'Smile', text: 'Граєте та отримуєте позитив!', sort_order: 6 },
  ]
  const insertHowToPlay = db.prepare('INSERT INTO how_to_play (icon, text, sort_order) VALUES (?, ?, ?)')
  for (const step of howToPlay) {
    insertHowToPlay.run(step.icon, step.text, step.sort_order)
  }

  // Seed translations
  seedTranslationsIfNeeded()

  console.log('Database seeded successfully')
}

// Migrate data if structure changed
function migrateDataIfNeeded() {
  // Check if we have old Russian data (look for "Базовый" in pricing)
  const oldPricing = db.prepare("SELECT * FROM pricing WHERE name LIKE '%Базов%' OR name LIKE '%Стандарт%' OR name LIKE '%Преміум%'").get()

  // If we have old Russian data, replace with new Ukrainian
  if (oldPricing) {
    console.log('Migrating to new data...')

    // Clear old data
    db.exec('DELETE FROM testimonials')
    db.exec('DELETE FROM services')
    db.exec('DELETE FROM pricing')
    db.exec('DELETE FROM faq')
    db.exec('DELETE FROM how_to_play')

    // Re-seed with new data (will use the arrays defined in seedDatabase)
    // For simplicity, we'll add inline here

    // Testimonials
    const testimonials = [
      { name: 'Олена М.', text: "Сьогодні відвідали це чудове місце. Грали в гру лазертаг. І хоча рахунок 2:2, але кожен відчув себе переможцем. Дякую привітним інструкторам. Місце куди я хочу ще повернутися!", rating: 5 },
      { name: 'Ірина К.', text: "Дуже сподобалось! Святкували дитяче день народження, замовили лазертаг. Малі були в захваті, такі атмосферні бої були, стільки вражень.", rating: 5 },
      { name: 'Марія С.', text: "Дякую за чудову гру! Діти в захваті! Окрема подяка інструктору Артему!", rating: 5 },
      { name: 'Андрій В.', text: "Ми провели тут тімбілдінг і всім дуже сподобалось! Дуже багато захисних споруд на полі, що роблять гру набагато цікавішою.", rating: 5 },
      { name: 'Дмитро Л.', text: 'Грали з друзями на день народження. Інструктор Сергій все чудово організував. Цікава локація в лісі на ВДНГ.', rating: 5 },
      { name: 'Олександр П.', text: "Були з колегами на тімбілдінгу. Спочатку скептично ставився до лазертагу, думав це для дітей. Але коли почалася гра — всі перетворились на справжніх бійців!", rating: 5 },
      { name: 'Катерина Б.', text: "Святкували день народження доньки (9 років). Діти грали 2 години і не хотіли зупинятись! Дуже зручно, що є альтанка.", rating: 5 },
      { name: 'Віталій М.', text: "Вже втретє приїжджаємо з друзями. Подобається, що кожного разу нові сценарії — не набридає. Локація в лісі атмосферна.", rating: 5 },
      { name: 'Наталія К.', text: "Чоловік подарував на річницю весілля гру в лазертаг замість ресторану. Спочатку здивувалась, але це було найкраще побачення за останні роки!", rating: 5 },
    ]
    const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')
    for (const t of testimonials) {
      insertTestimonial.run(t.name, t.text, t.rating)
    }

    // Services
    const services = [
      { icon: 'Trees', title: 'Лісовий лазертаг', description: 'Ігри на відкритому повітрі в лісовій зоні ВДНГ. Природні укриття та тактичні позиції для захоплюючих баталій.', sort_order: 1 },
      { icon: 'Building2', title: 'Аренний лазертаг', description: 'Критий лазертаг в приміщенні ТРЦ "Україна". Комфортна гра в будь-яку погоду.', sort_order: 2 },
      { icon: 'Truck', title: 'Виїзний лазертаг', description: 'Організуємо гру на вашій території. Привеземо обладнання та проведемо захід будь-де.', sort_order: 3 },
      { icon: 'Cake', title: 'Дні народження', description: "Незабутні дитячі свята з лазертаг-баталіями. Для дітей від 7 років.", sort_order: 4 },
      { icon: 'Users', title: 'Корпоративи та тімбілдінг', description: 'Командні ігри для корпоративних заходів. До 30 осіб на площадці.', sort_order: 5 },
      { icon: 'Flame', title: 'Альтанки та барбекю', description: 'Затишні альтанки для відпочинку після гри. Можливість замовлення кейтерингу.', sort_order: 6 },
    ]
    const insertService = db.prepare('INSERT INTO services (icon, title, description, sort_order) VALUES (?, ?, ?, ?)')
    for (const s of services) {
      insertService.run(s.icon, s.title, s.description, s.sort_order)
    }

    // Pricing - features are translation keys
    const pricing = [
      { name: '1 година', price: '600', duration: '60 хвилин', features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]), popular: 0, best_value: 0, sort_order: 1 },
      { name: '1.5 години', price: '900', duration: '90 хвилин', features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]), popular: 1, best_value: 0, sort_order: 2 },
      { name: '2 години', price: '1100', duration: '120 хвилин', features: JSON.stringify(["rental", "instructor", "scenarios", "stats", "photo"]), popular: 0, best_value: 1, sort_order: 3 },
    ]
    const insertPricing = db.prepare('INSERT INTO pricing (name, price, duration, features, popular, best_value, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)')
    for (const p of pricing) {
      insertPricing.run(p.name, p.price, p.duration, p.features, p.popular, p.best_value, p.sort_order)
    }

    // FAQ
    const faq = [
      { question: 'З якого віку можна грати в лазертаг?', answer: 'Мінімальний вік для участі — 7 років. Гра абсолютно безпечна для дітей та дорослих.', sort_order: 1 },
      { question: 'Що потрібно взяти з собою?', answer: 'Тільки зручний одяг та спортивне взуття. Рекомендуємо кепку. Все обладнання надається на місці.', sort_order: 2 },
      { question: 'Скільки людей може грати одночасно?', answer: 'На одній площадці можуть грати до 30 осіб. У нас є 3 ігрові площадки.', sort_order: 3 },
      { question: 'Чи є лазертаг чесною грою?', answer: 'Так! Всі влучання фіксуються електронно датчиками на жилетах.', sort_order: 4 },
      { question: 'Чи можна замовити їжу та напої?', answer: "Так, у нас є затишні альтанки для відпочинку та можливість замовлення кейтерингу.", sort_order: 5 },
    ]
    const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)')
    for (const f of faq) {
      insertFaq.run(f.question, f.answer, f.sort_order)
    }

    // How to Play
    const howToPlay = [
      { icon: 'Users', text: 'Збираєте компанію від 8 осіб', sort_order: 1 },
      { icon: 'Calendar', text: 'Обираєте дату та час гри', sort_order: 2 },
      { icon: 'Phone', text: 'Замовляєте гру на сайті або за телефоном', sort_order: 3 },
      { icon: 'Clock', text: 'Приходите в клуб за 15 хвилин раніше', sort_order: 4 },
      { icon: 'Crosshair', text: 'Отримуєте комплект обладнання та проходите інструктаж', sort_order: 5 },
      { icon: 'Smile', text: 'Граєте та отримуєте позитив!', sort_order: 6 },
    ]
    const insertHowToPlay = db.prepare('INSERT INTO how_to_play (icon, text, sort_order) VALUES (?, ?, ?)')
    for (const h of howToPlay) {
      insertHowToPlay.run(h.icon, h.text, h.sort_order)
    }

    // Update site settings
    const heroData = {
      title: 'Лазертаг у Києві',
      subtitle: 'Дні народження • Корпоративи • Компанії друзів • Активний відпочинок',
      ctaText: 'Забронювати гру',
      ctaSecondaryText: 'Дізнатись вартість',
      backgroundImage: 'https://ngame.it/wp-content/uploads/2023/09/lasertag-outdoor-1.jpg',
    }
    db.prepare("UPDATE site_settings SET value = ? WHERE key = 'hero'").run(JSON.stringify(heroData))

    const contactData = {
      phone: '(097) 204-07-07',
      email: 'info@ganz-paintball.com',
      address: 'Київ, ВДНГ, павільйон 21 (пр. Академіка Глушкова, 1)',
      workingHours: 'Пн-Нд: 10:00 - 20:00',
      facebook: 'https://www.facebook.com/ganz.paintball',
      instagram: 'https://www.instagram.com/ganzpaintball',
    }
    db.prepare("UPDATE site_settings SET value = ? WHERE key = 'contact'").run(JSON.stringify(contactData))

    console.log('Data migration completed')
  }
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
