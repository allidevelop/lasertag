import { db } from './database'

// Ukrainian translations
const uk = {
  nav: {
    home: "Головна",
    services: "Послуги",
    gallery: "Галерея",
    pricing: "Ціни",
    contact: "Контакти",
    admin: "Адмін"
  },
  hero: {
    title: "LASERTAG KIEV",
    subtitle: "Лазерні бої для дітей від 7 років та дорослих на ВДНГ",
    cta: "Забронювати гру",
    ctaSecondary: "Дізнатися більше"
  },
  services: {
    title: "Наші послуги",
    subtitle: "Лазертаг для дітей та дорослих. 3 площадки, 99+ сценаріїв"
  },
  gallery: {
    title: "Галерея",
    subtitle: "Подивіться як проходять наші ігри"
  },
  pricing: {
    title: "Ціни",
    subtitle: "Оберіть відповідний пакет",
    currency: "грн",
    book: "Забронювати",
    popular: "Популярний"
  },
  testimonials: {
    title: "Відгуки",
    subtitle: "Що кажуть наші клієнти"
  },
  faq: {
    title: "Часті запитання",
    subtitle: "Відповіді на популярні запитання"
  },
  contact: {
    title: "Контакти",
    subtitle: "Зв'яжіться з нами",
    phone: "Телефон",
    email: "Email",
    address: "Адреса",
    workingHours: "Режим роботи",
    followUs: "Ми в соцмережах"
  },
  booking: {
    title: "Забронювати гру",
    name: "Ваше ім'я",
    namePlaceholder: "Введіть ваше ім'я",
    phone: "Телефон",
    phonePlaceholder: "+380 XX XXX XX XX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    date: "Дата",
    time: "Час",
    source: "Звідки ви про нас дізналися?",
    sourcePlaceholder: "Виберіть варіант",
    sourceOptions: {
      google: "Google пошук",
      facebook: "Facebook",
      instagram: "Instagram",
      friends: "Від друзів",
      other: "Інше"
    },
    message: "Додаткова інформація",
    messagePlaceholder: "Кількість гравців, особливі побажання...",
    submit: "Надіслати заявку",
    success: "Заявку надіслано! Ми зв'яжемося з вами найближчим часом.",
    error: "Сталася помилка. Спробуйте ще раз."
  },
  feedback: {
    title: "Зворотній зв'язок",
    name: "Ваше ім'я",
    email: "Email",
    message: "Повідомлення",
    submit: "Надіслати",
    success: "Повідомлення надіслано!",
    error: "Помилка відправки"
  },
  theme: {
    light: "Світла тема",
    dark: "Темна тема"
  },
  language: {
    ru: "Русский",
    uk: "Українська",
    en: "English"
  },
  footer: {
    rights: "Всі права захищені",
    privacy: "Політика конфіденційності"
  }
}

// Russian translations
const ru = {
  nav: {
    home: "Главная",
    services: "Услуги",
    gallery: "Галерея",
    pricing: "Цены",
    contact: "Контакты",
    admin: "Админ"
  },
  hero: {
    title: "LASERTAG KIEV",
    subtitle: "Лазерные бои для детей от 7 лет и взрослых на ВДНХ",
    cta: "Забронировать игру",
    ctaSecondary: "Узнать больше"
  },
  services: {
    title: "Наши услуги",
    subtitle: "Лазертаг для детей и взрослых. 3 площадки, 99+ сценариев"
  },
  gallery: {
    title: "Галерея",
    subtitle: "Посмотрите как проходят наши игры"
  },
  pricing: {
    title: "Цены",
    subtitle: "Выберите подходящий пакет",
    currency: "грн",
    book: "Забронировать",
    popular: "Популярный"
  },
  testimonials: {
    title: "Отзывы",
    subtitle: "Что говорят наши клиенты"
  },
  faq: {
    title: "Частые вопросы",
    subtitle: "Ответы на популярные вопросы"
  },
  contact: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    workingHours: "Режим работы",
    followUs: "Мы в соцсетях"
  },
  booking: {
    title: "Забронировать игру",
    name: "Ваше имя",
    namePlaceholder: "Введите ваше имя",
    phone: "Телефон",
    phonePlaceholder: "+380 XX XXX XX XX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    date: "Дата",
    time: "Время",
    source: "Откуда вы о нас узнали?",
    sourcePlaceholder: "Выберите вариант",
    sourceOptions: {
      google: "Google поиск",
      facebook: "Facebook",
      instagram: "Instagram",
      friends: "От друзей",
      other: "Другое"
    },
    message: "Дополнительная информация",
    messagePlaceholder: "Количество игроков, особые пожелания...",
    submit: "Отправить заявку",
    success: "Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
    error: "Произошла ошибка. Попробуйте ещё раз."
  },
  feedback: {
    title: "Обратная связь",
    name: "Ваше имя",
    email: "Email",
    message: "Сообщение",
    submit: "Отправить",
    success: "Сообщение отправлено!",
    error: "Ошибка отправки"
  },
  theme: {
    light: "Светлая тема",
    dark: "Тёмная тема"
  },
  language: {
    ru: "Русский",
    uk: "Українська",
    en: "English"
  },
  footer: {
    rights: "Все права защищены",
    privacy: "Политика конфиденциальности"
  }
}

// English translations
const en = {
  nav: {
    home: "Home",
    services: "Services",
    gallery: "Gallery",
    pricing: "Pricing",
    contact: "Contact",
    admin: "Admin"
  },
  hero: {
    title: "LASERTAG KIEV",
    subtitle: "Laser battles for children from 7 years and adults at VDNH",
    cta: "Book a game",
    ctaSecondary: "Learn more"
  },
  services: {
    title: "Our Services",
    subtitle: "Laser tag for children and adults. 3 arenas, 99+ scenarios"
  },
  gallery: {
    title: "Gallery",
    subtitle: "See how our games go"
  },
  pricing: {
    title: "Pricing",
    subtitle: "Choose the right package",
    currency: "UAH",
    book: "Book now",
    popular: "Popular"
  },
  testimonials: {
    title: "Testimonials",
    subtitle: "What our clients say"
  },
  faq: {
    title: "FAQ",
    subtitle: "Answers to common questions"
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch",
    phone: "Phone",
    email: "Email",
    address: "Address",
    workingHours: "Working Hours",
    followUs: "Follow us"
  },
  booking: {
    title: "Book a Game",
    name: "Your name",
    namePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "+380 XX XXX XX XX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    date: "Date",
    time: "Time",
    source: "How did you hear about us?",
    sourcePlaceholder: "Select an option",
    sourceOptions: {
      google: "Google search",
      facebook: "Facebook",
      instagram: "Instagram",
      friends: "From friends",
      other: "Other"
    },
    message: "Additional information",
    messagePlaceholder: "Number of players, special requests...",
    submit: "Submit request",
    success: "Request sent! We will contact you shortly.",
    error: "An error occurred. Please try again."
  },
  feedback: {
    title: "Feedback",
    name: "Your name",
    email: "Email",
    message: "Message",
    submit: "Send",
    success: "Message sent!",
    error: "Sending error"
  },
  theme: {
    light: "Light theme",
    dark: "Dark theme"
  },
  language: {
    ru: "Русский",
    uk: "Українська",
    en: "English"
  },
  footer: {
    rights: "All rights reserved",
    privacy: "Privacy Policy"
  }
}

export function updateTranslations() {
  console.log('Updating translations in database...')

  const update = db.prepare('UPDATE translations SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE lang = ?')

  update.run(JSON.stringify(uk), 'uk')
  console.log('  - Ukrainian translations updated')

  update.run(JSON.stringify(ru), 'ru')
  console.log('  - Russian translations updated')

  update.run(JSON.stringify(en), 'en')
  console.log('  - English translations updated')

  console.log('Translations updated successfully!')
}

updateTranslations()
