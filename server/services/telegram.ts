// Telegram notification service

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8543054496:AAFAPCqK7zm6TzXuDpkaSVRhTMUUsqGJaFI'
const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || '88017031,472415624').split(',')

interface BookingData {
  name: string
  phone: string
  email: string
  date: string
  time: string
  source?: string | null
  message?: string | null
}

interface FeedbackData {
  name: string
  email: string
  phone?: string
  message: string
}

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`Telegram API error for chat ${chatId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Failed to send Telegram message to ${chatId}:`, error)
    return false
  }
}

async function sendToAllChats(text: string): Promise<void> {
  const promises = CHAT_IDS.map((chatId) => sendTelegramMessage(chatId.trim(), text))
  await Promise.allSettled(promises)
}

export async function notifyNewBooking(booking: BookingData): Promise<void> {
  const message = `
🎯 <b>НОВА ЗАЯВКА НА БРОНЮВАННЯ!</b>

👤 <b>Ім'я:</b> ${escapeHtml(booking.name)}
📱 <b>Телефон:</b> ${escapeHtml(booking.phone)}
📧 <b>Email:</b> ${escapeHtml(booking.email)}
📅 <b>Дата:</b> ${escapeHtml(booking.date)}
🕐 <b>Час:</b> ${escapeHtml(booking.time)}
${booking.source ? `📢 <b>Звідки дізнались:</b> ${escapeHtml(booking.source)}` : ''}
${booking.message ? `💬 <b>Повідомлення:</b> ${escapeHtml(booking.message)}` : ''}

🔗 <a href="https://www.lasertag.kiev.ua/admin">Відкрити адмін-панель</a>
`.trim()

  await sendToAllChats(message)
}

export async function notifyNewFeedback(feedback: FeedbackData): Promise<void> {
  const message = `
📨 <b>НОВЕ ПОВІДОМЛЕННЯ!</b>

👤 <b>Ім'я:</b> ${escapeHtml(feedback.name)}
📧 <b>Email:</b> ${escapeHtml(feedback.email)}
${feedback.phone ? `📱 <b>Телефон:</b> ${escapeHtml(feedback.phone)}` : ''}

💬 <b>Повідомлення:</b>
${escapeHtml(feedback.message)}

🔗 <a href="https://www.lasertag.kiev.ua/admin">Відкрити адмін-панель</a>
`.trim()

  await sendToAllChats(message)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
