const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Font paths
const fontsDir = path.join(__dirname, 'fonts');
const regularFont = path.join(fontsDir, 'Roboto-Regular.ttf');
const boldFont = path.join(fontsDir, 'Roboto-Bold.ttf');
const italicFont = path.join(fontsDir, 'Roboto-Italic.ttf');

// Create a document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 }
});

// Register fonts
doc.registerFont('Regular', regularFont);
doc.registerFont('Bold', boldFont);
doc.registerFont('Italic', italicFont);

// Pipe to a file
doc.pipe(fs.createWriteStream('INSTRUCTION_FOR_CLIENT.pdf'));

// Helper functions
const title = (text) => {
  doc.fontSize(24).font('Bold').fillColor('#1a1a1a').text(text);
  doc.moveDown(0.5);
};

const heading = (text) => {
  doc.moveDown(0.5);
  doc.fontSize(18).font('Bold').fillColor('#2563eb').text(text);
  doc.moveDown(0.3);
};

const subheading = (text) => {
  doc.moveDown(0.3);
  doc.fontSize(14).font('Bold').fillColor('#1a1a1a').text(text);
  doc.moveDown(0.2);
};

const paragraph = (text) => {
  doc.fontSize(11).font('Regular').fillColor('#374151').text(text, { lineGap: 3 });
  doc.moveDown(0.3);
};

const listItem = (text, indent = 0) => {
  const x = doc.x + indent;
  doc.fontSize(11).font('Regular').fillColor('#374151')
    .text(`•  ${text}`, x, doc.y, { lineGap: 3 });
  doc.moveDown(0.1);
};

const numberedItem = (num, text) => {
  doc.fontSize(11).font('Regular').fillColor('#374151')
    .text(`${num}. ${text}`, { lineGap: 3 });
  doc.moveDown(0.1);
};

const note = (text) => {
  doc.moveDown(0.2);
  doc.fontSize(10).font('Italic').fillColor('#6b7280')
    .text(text, { lineGap: 2 });
  doc.moveDown(0.3);
};

const separator = () => {
  doc.moveDown(0.5);
  doc.strokeColor('#e5e7eb').lineWidth(1)
    .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
};

const box = (text) => {
  doc.moveDown(0.3);
  const startY = doc.y;
  doc.rect(50, startY, 495, 70).fillAndStroke('#f3f4f6', '#d1d5db');
  doc.fillColor('#1a1a1a').fontSize(11).font('Regular')
    .text(text, 60, startY + 15, { lineGap: 6 });
  doc.y = startY + 80;
  doc.moveDown(0.3);
};

// ========== CONTENT ==========

// Title
title('Інструкція по управлінню сайтом');
doc.fontSize(14).font('Regular').fillColor('#6b7280').text('Lasertag Kiev');
doc.moveDown(0.5);
paragraph('Ця інструкція допоможе вам отримати доступ до управління вашим сайтом.');

separator();

// Part 1
heading('Частина 1: Створення акаунту на Railway');
paragraph('Railway — це сервіс, де "живе" ваш сайт. Вам потрібно створити там акаунт, щоб ми могли передати вам сайт.');

subheading('Крок 1: Відкрийте сайт Railway');
numberedItem(1, 'Відкрийте браузер (Chrome, Firefox або будь-який інший)');
numberedItem(2, 'В адресному рядку введіть: railway.app');
numberedItem(3, 'Натисніть Enter');

subheading('Крок 2: Почніть реєстрацію');
numberedItem(1, 'На головній сторінці знайдіть кнопку "Login" (Увійти) у правому верхньому куті');
numberedItem(2, 'Натисніть на неї');

subheading('Крок 3: Виберіть спосіб реєстрації');
paragraph('Ви побачите кілька варіантів входу. Виберіть "Login with Email" (Увійти через Email).');
note('Це найпростіший спосіб — вам не потрібні додаткові акаунти.');

subheading('Крок 4: Введіть вашу пошту');
numberedItem(1, 'В поле введіть вашу електронну пошту (наприклад: ivan@gmail.com)');
numberedItem(2, 'Натисніть кнопку "Email me a login link"');

subheading('Крок 5: Перевірте пошту');
numberedItem(1, 'Відкрийте вашу електронну пошту (Gmail, Ukr.net тощо)');
numberedItem(2, 'Знайдіть лист від Railway (може потрапити в папку "Спам"!)');
numberedItem(3, 'В листі натисніть на кнопку "Log in to Railway"');

subheading('Крок 6: Готово!');
paragraph('Вітаємо! Тепер у вас є акаунт на Railway.');
doc.fontSize(11).font('Bold').fillColor('#2563eb')
  .text('Напишіть нам вашу пошту, яку ви використали для реєстрації — ми надішлемо вам запрошення на передачу сайту.');
doc.moveDown(0.5);

separator();

// Part 2
doc.addPage();
heading('Частина 2: Прийняття передачі сайту');
paragraph('Після того як ми надішлемо вам запрошення:');

subheading('Крок 1: Перевірте пошту');
numberedItem(1, 'Вам прийде лист від Railway про передачу проекту');
numberedItem(2, 'Відкрийте цей лист');

subheading('Крок 2: Прийміть запрошення');
numberedItem(1, 'В листі натисніть кнопку "Accept Transfer" (Прийняти передачу)');
numberedItem(2, 'Вас перенаправить на сайт Railway');
numberedItem(3, 'Якщо потрібно — увійдіть у свій акаунт');

subheading('Крок 3: Підтвердіть');
numberedItem(1, 'Натисніть кнопку підтвердження');
numberedItem(2, 'Тепер сайт належить вам!');

separator();

// Part 3
heading('Частина 3: Управління сайтом (Адмін-панель)');
paragraph('Для зміни інформації на сайті (ціни, відгуки, послуги тощо) використовуйте адмін-панель.');

subheading('Як відкрити адмін-панель');
numberedItem(1, 'Відкрийте браузер');
numberedItem(2, 'Введіть в адресному рядку: www.lasertag.kiev.ua/admin');
numberedItem(3, 'Натисніть Enter');

subheading('Що можна робити в адмін-панелі');
listItem('Ціни — назви тарифів, ціни, тривалість гри');
listItem('Відгуки — додавати нові відгуки клієнтів');
listItem('Послуги — опис послуг (лазертаг, дні народження тощо)');
listItem('FAQ — питання та відповіді');
listItem('Заявки — перегляд заявок на бронювання');

subheading('Як змінити ціну (приклад)');
numberedItem(1, 'Відкрийте адмін-панель: www.lasertag.kiev.ua/admin');
numberedItem(2, 'Знайдіть розділ "Ціни" (або "Pricing")');
numberedItem(3, 'Натисніть на картку з ціною, яку хочете змінити');
numberedItem(4, 'Змініть потрібні поля (ціна, назва, опис)');
numberedItem(5, 'Натисніть кнопку "Зберегти"');
numberedItem(6, 'Готово! Зміни одразу з\'являться на сайті');

separator();

// Part 4
doc.addPage();
heading('Частина 4: Якщо щось зламалось');

subheading('Сайт не відкривається');
numberedItem(1, 'Зачекайте 5 хвилин і спробуйте знову');
numberedItem(2, 'Спробуйте відкрити з телефону');
numberedItem(3, 'Якщо не працює більше години — напишіть нам');

subheading('Не можу увійти в адмін-панель');
numberedItem(1, 'Перевірте адресу: www.lasertag.kiev.ua/admin');
numberedItem(2, 'Спробуйте інший браузер');
numberedItem(3, 'Очистіть кеш браузера (Ctrl + Shift + Delete)');

subheading('Випадково видалив щось важливе');
paragraph('Не панікуйте! Напишіть нам — ми допоможемо відновити.');

separator();

// Contacts
heading('Контакти для підтримки');
paragraph('Якщо у вас виникли питання або проблеми, пишіть:');
doc.moveDown(0.3);
listItem('Email: _____________________');
listItem('Telegram: _____________________');
listItem('Телефон: _____________________');

separator();

// Quick reference
heading('Пам\'ятка (роздрукуйте і повісьте на стіну)');
box('САЙТ:              www.lasertag.kiev.ua\n\nАДМІН-ПАНЕЛЬ:  www.lasertag.kiev.ua/admin\n\nХОСТИНГ:           railway.app');

doc.moveDown(1);
doc.fontSize(9).font('Italic').fillColor('#9ca3af')
  .text('Інструкція створена для проекту Lasertag Kiev', { align: 'center' });

// Finalize PDF
doc.end();

console.log('PDF created: INSTRUCTION_FOR_CLIENT.pdf');
