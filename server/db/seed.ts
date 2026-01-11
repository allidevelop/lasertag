import { db } from './database'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

// Helper to check if table has data
function tableHasData(tableName: string): boolean {
  const result = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number }
  return result.count > 0
}

export async function seedDatabase() {
  console.log('Checking database state...')

  // Only create admin if not exists
  if (!tableHasData('admins')) {
    console.log('Creating admin user...')
    const passwordHash = await bcrypt.hash('lasertag2024', 10)
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', passwordHash)
  } else {
    console.log('Admin already exists, skipping...')
  }

  // Only seed site_settings if empty
  if (!tableHasData('site_settings')) {
    console.log('Seeding site settings...')

    const heroData = {
      title: 'Лазертаг у Києві',
      subtitle: 'Дні народження • Корпоративи • Компанії друзів • Активний відпочинок',
      ctaText: 'Забронювати гру',
      ctaSecondaryText: 'Дізнатись вартість',
      backgroundImage: 'https://ngame.it/wp-content/uploads/2023/09/lasertag-outdoor-1.jpg',
    }
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('hero', JSON.stringify(heroData))

    const contactData = {
      phone: '(097) 204-07-07',
      email: 'info@ganz-paintball.com',
      address: 'Київ, ВДНГ, павільйон 21 (пр. Академіка Глушкова, 1)',
      workingHours: 'Пн-Нд: 10:00 - 20:00',
      facebook: 'https://www.facebook.com/ganz.paintball',
      instagram: 'https://www.instagram.com/ganzpaintball',
    }
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('contact', JSON.stringify(contactData))
  } else {
    console.log('Site settings exist, skipping...')
  }

  // Only seed services if empty
  if (!tableHasData('services')) {
    console.log('Seeding services...')
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
  } else {
    console.log('Services exist, skipping...')
  }

  // Only seed gallery if empty
  if (!tableHasData('gallery')) {
    console.log('Seeding gallery...')
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
  } else {
    console.log('Gallery exists, skipping...')
  }

  // Only seed pricing if empty
  if (!tableHasData('pricing')) {
    console.log('Seeding pricing...')
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
  } else {
    console.log('Pricing exists, skipping...')
  }

  // Only seed testimonials if empty
  if (!tableHasData('testimonials')) {
    console.log('Seeding testimonials...')
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
  } else {
    console.log('Testimonials exist, skipping...')
  }

  // Only seed FAQ if empty
  if (!tableHasData('faq')) {
    console.log('Seeding FAQ...')
    const faq = [
      {
        question: JSON.stringify({
          uk: 'З якого віку можна грати?',
          ru: 'С какого возраста можно играть?',
          en: 'What is the minimum age to play?'
        }),
        answer: JSON.stringify({
          uk: 'Ми рекомендуємо починати грати дітям від 7 років',
          ru: 'Мы рекомендуем начинать играть детям от 7 лет',
          en: 'We recommend children start playing from 7 years old'
        }),
        sort_order: 1
      },
      {
        question: JSON.stringify({
          uk: 'Чи безпечно це?',
          ru: 'Безопасно ли это?',
          en: 'Is it safe?'
        }),
        answer: JSON.stringify({
          uk: 'Так. Лазертаг не має фізичного контакту',
          ru: 'Да. Лазертаг не имеет физического контакта',
          en: 'Yes. Lasertag has no physical contact'
        }),
        sort_order: 2
      },
      {
        question: JSON.stringify({
          uk: 'Скільки триває гра?',
          ru: 'Сколько длится игра?',
          en: 'How long does the game last?'
        }),
        answer: JSON.stringify({
          uk: 'Середня тривалість гри 1.5 години, але ви можете самі обрати від однієї години',
          ru: 'Средняя продолжительность игры 1.5 часа, но вы можете сами выбрать от одного часа',
          en: 'Average game duration is 1.5 hours, but you can choose from one hour'
        }),
        sort_order: 3
      },
      {
        question: JSON.stringify({
          uk: 'Скільки людей мінімум?',
          ru: 'Сколько людей минимум?',
          en: 'Minimum number of people?'
        }),
        answer: JSON.stringify({
          uk: 'Мінімальна кількість для гри — 8 гравців',
          ru: 'Минимальное количество для игры — 8 игроков',
          en: 'Minimum number for a game is 8 players'
        }),
        sort_order: 4
      },
      {
        question: JSON.stringify({
          uk: 'Що вдягати?',
          ru: 'Что надевать?',
          en: 'What to wear?'
        }),
        answer: JSON.stringify({
          uk: 'Зручний одяг та взуття. Обов\'язково взяти кепку або панамку',
          ru: 'Удобную одежду и обувь. Обязательно взять кепку или панамку',
          en: 'Comfortable clothes and shoes. Make sure to bring a cap or hat'
        }),
        sort_order: 5
      },
    ]
    const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)')
    for (const item of faq) {
      insertFaq.run(item.question, item.answer, item.sort_order)
    }
  } else {
    console.log('FAQ exists, skipping...')
  }

  // Only seed how_to_play if empty
  if (!tableHasData('how_to_play')) {
    console.log('Seeding How to Play...')
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
  } else {
    console.log('How to Play exists, skipping...')
  }

  // Only seed translations if empty
  if (!tableHasData('translations')) {
    console.log('Seeding translations...')
    const localesDir = path.join(process.cwd(), 'src', 'i18n', 'locales')
    const languages = ['uk', 'ru', 'en']
    const insertTranslation = db.prepare('INSERT INTO translations (lang, data) VALUES (?, ?)')

    for (const lang of languages) {
      try {
        const filePath = path.join(localesDir, `${lang}.json`)
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath, 'utf-8')
          JSON.parse(data) // Validate JSON
          insertTranslation.run(lang, data)
          console.log(`  - ${lang} translations loaded`)
        }
      } catch (error) {
        console.error(`Failed to load ${lang} translations:`, error)
      }
    }
  } else {
    console.log('Translations exist, skipping...')
  }

  console.log('Database check completed!')
}
