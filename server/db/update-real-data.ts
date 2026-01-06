import { db } from './database'

// Real data from lasertag.kiev.ua and ganz-paintball.com

export function updateWithRealData() {
  console.log('Updating database with real data...')

  // Update contact info
  const contactData = {
    phone: '(097) 204-07-07',
    email: 'info@ganz-paintball.com',
    address: 'Київ, ВДНГ, павільйон 21 (пр. Академіка Глушкова, 1)',
    workingHours: 'Пн-Нд: 10:00 - 20:00',
    facebook: 'https://www.facebook.com/ganz.paintball',
    instagram: 'https://www.instagram.com/ganzpaintball',
  }
  db.prepare('UPDATE site_settings SET value = ? WHERE key = ?').run(JSON.stringify(contactData), 'contact')
  console.log('  - Contact info updated')

  // Update hero
  const heroData = {
    title: 'LASERTAG KIEV',
    subtitle: 'Лазерні бої для дітей від 7 років та дорослих на ВДНГ',
    ctaText: 'Забронювати гру',
    ctaSecondaryText: 'Дізнатися більше',
  }
  db.prepare('UPDATE site_settings SET value = ? WHERE key = ?').run(JSON.stringify(heroData), 'hero')
  console.log('  - Hero updated')

  // Update services with real data
  db.prepare('DELETE FROM services').run()
  const services = [
    {
      icon: 'Trees',
      title: 'Лісовий лазертаг',
      description: 'Ігри на відкритому повітрі в лісовій зоні ВДНГ. Природні укриття та тактичні позиції для захоплюючих баталій.',
      sort_order: 1
    },
    {
      icon: 'Building2',
      title: 'Аренний лазертаг',
      description: 'Критий лазертаг в приміщенні ТРЦ "Україна". Комфортна гра в будь-яку погоду.',
      sort_order: 2
    },
    {
      icon: 'Truck',
      title: 'Виїзний лазертаг',
      description: 'Організуємо гру на вашій території. Привеземо обладнання та проведемо захід будь-де.',
      sort_order: 3
    },
    {
      icon: 'Cake',
      title: 'Дні народження',
      description: 'Незабутні дитячі свята з лазертаг-баталіями. Для дітей від 7 років. Аніматори, квести, кейтеринг.',
      sort_order: 4
    },
    {
      icon: 'Users',
      title: 'Корпоративи та тімбілдінг',
      description: 'Командні ігри для корпоративних заходів. До 30 осіб на площадці. 99+ ігрових сценаріїв.',
      sort_order: 5
    },
    {
      icon: 'Flame',
      title: 'Альтанки та барбекю',
      description: 'Затишні альтанки для відпочинку після гри. Можливість замовлення кейтерингу.',
      sort_order: 6
    },
  ]
  const insertService = db.prepare('INSERT INTO services (icon, title, description, sort_order) VALUES (?, ?, ?, ?)')
  for (const service of services) {
    insertService.run(service.icon, service.title, service.description, service.sort_order)
  }
  console.log('  - Services updated')

  // Update pricing with real data
  db.prepare('DELETE FROM pricing').run()
  const pricing = [
    {
      name: '1 година',
      price: '500',
      duration: '60 хвилин',
      features: JSON.stringify(['Оренда ігрової площадки', 'Персональний інструктор', '99+ сценаріїв гри', 'Статистика після гри']),
      popular: 0,
      sort_order: 1,
    },
    {
      name: '1.5 години',
      price: '700',
      duration: '90 хвилин',
      features: JSON.stringify(['Оренда ігрової площадки', 'Персональний інструктор', '99+ сценаріїв гри', 'Статистика після гри', 'Фото на память']),
      popular: 1,
      sort_order: 2,
    },
    {
      name: '2 години',
      price: '900',
      duration: '120 хвилин',
      features: JSON.stringify(['Оренда ігрової площадки', 'Персональний інструктор', '99+ сценаріїв гри', 'Статистика після гри', 'Фото та відео зйомка', 'Альтанка для відпочинку']),
      popular: 0,
      sort_order: 3,
    },
  ]
  const insertPricing = db.prepare('INSERT INTO pricing (name, price, duration, features, popular, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
  for (const plan of pricing) {
    insertPricing.run(plan.name, plan.price, plan.duration, plan.features, plan.popular, plan.sort_order)
  }
  console.log('  - Pricing updated')

  // Update testimonials with REAL reviews
  db.prepare('DELETE FROM testimonials').run()
  const testimonials = [
    {
      name: 'Олена М.',
      text: 'Сьогодні відвідали це чудове місце. Грали в гру лазертаг. І хоча рахунок 2:2, але кожен відчув себе переможцем. Дякую привітним інструкторам. Місце куди я хочу ще повернутися!',
      rating: 5
    },
    {
      name: 'Ірина К.',
      text: 'Дуже сподобалось! Святкували дитяче день народження, замовили лазертаг. Малі були в захваті, такі атмосферні бої були, стільки вражень. Сподобалось, що все проходило на відкритому повітрі.',
      rating: 5
    },
    {
      name: 'Марія С.',
      text: 'Дякую за чудову гру! Діти в захваті! Окрема подяка інструктору Артему!',
      rating: 5
    },
    {
      name: 'Андрій В.',
      text: 'Ми провели тут тімбілдінг і всім дуже сподобалось! Дуже багато захисних споруд на полі, що роблять гру набагато цікавішою. Рекомендую для корпоративів!',
      rating: 5
    },
    {
      name: 'Дмитро Л.',
      text: 'Грали з друзями на день народження. Інструктор Сергій все чудово організував. Цікава локація в лісі на ВДНГ. Задоволення отримали не тільки хлопці, а й дівчата!',
      rating: 5
    },
  ]
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')
  for (const testimonial of testimonials) {
    insertTestimonial.run(testimonial.name, testimonial.text, testimonial.rating)
  }
  console.log('  - Testimonials updated with REAL reviews')

  // Update FAQ with real info
  db.prepare('DELETE FROM faq').run()
  const faq = [
    {
      question: 'З якого віку можна грати в лазертаг?',
      answer: 'Мінімальний вік для участі — 7 років. Гра абсолютно безпечна для дітей та дорослих, лазерні (інфрачервоні) промені нешкідливі.',
      sort_order: 1
    },
    {
      question: 'Що потрібно взяти з собою?',
      answer: 'Тільки зручний одяг та спортивне взуття. Рекомендуємо кепку. Все обладнання надається на місці. Спеціальна екіпіровка не потрібна.',
      sort_order: 2
    },
    {
      question: 'Скільки людей може грати одночасно?',
      answer: 'На одній площадці можуть грати до 30 осіб. У нас є 3 ігрові площадки, тому можемо прийняти великі групи.',
      sort_order: 3
    },
    {
      question: 'Чи є лазертаг чесною грою?',
      answer: 'Так! Всі влучання фіксуються електронно датчиками на жилетах. Після гри кожен гравець отримує статистику: кількість влучань та поразок.',
      sort_order: 4
    },
    {
      question: 'Чи можна замовити їжу та напої?',
      answer: 'Так, у нас є затишні альтанки для відпочинку та можливість замовлення кейтерингу. Ідеально для святкування днів народження та корпоративів.',
      sort_order: 5
    },
  ]
  const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)')
  for (const item of faq) {
    insertFaq.run(item.question, item.answer, item.sort_order)
  }
  console.log('  - FAQ updated')

  console.log('Database updated with real data successfully!')
}

// Run if executed directly
updateWithRealData()
