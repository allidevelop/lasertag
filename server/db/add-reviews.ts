import { db } from './database'

// Add 4 more realistic reviews
const newReviews = [
  {
    name: 'Олександр П.',
    text: 'Були з колегами на тімбілдінгу. Спочатку скептично ставився до лазертагу, думав це для дітей. Але коли почалася гра — всі перетворились на справжніх бійців! Емоції неймовірні, особливо коли виграєш у фіналі. Інструктор пояснив правила дуже зрозуміло.',
    rating: 5
  },
  {
    name: 'Катерина Б.',
    text: 'Святкували день народження доньки (9 років). Діти грали 2 години і не хотіли зупинятись! Дуже зручно, що є альтанка — поки діти грали, ми спокійно підготували стіл. Окреме дякую за терпіння з малечею.',
    rating: 5
  },
  {
    name: 'Віталій М.',
    text: 'Вже втретє приїжджаємо з друзями. Подобається, що кожного разу нові сценарії — не набридає. Локація в лісі атмосферна, є де сховатись і влаштувати засідку. Ціни адекватні, обладнання працює без збоїв.',
    rating: 5
  },
  {
    name: 'Наталія К.',
    text: 'Чоловік подарував на річницю весілля гру в лазертаг замість ресторану. Спочатку здивувалась, але це було найкраще побачення за останні роки! Сміялись як діти, бігали по лісу. Рекомендую парам для незвичайного відпочинку.',
    rating: 5
  },
]

console.log('Adding new reviews...')

const insertTestimonial = db.prepare('INSERT INTO testimonials (name, text, rating) VALUES (?, ?, ?)')

for (const review of newReviews) {
  insertTestimonial.run(review.name, review.text, review.rating)
  console.log(`  - Added review from ${review.name}`)
}

const count = db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as { count: number }
console.log(`Total reviews now: ${count.count}`)
