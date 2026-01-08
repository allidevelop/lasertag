// Email notification service
import nodemailer from 'nodemailer'

const EMAIL_USER = process.env.EMAIL_USER || 'lasertag.kiev@gmail.com'
const EMAIL_PASS = process.env.EMAIL_PASS || 'WHsF345v4ThEg0AjA'
const EMAIL_TO = process.env.EMAIL_TO || 'info@ganz-paintball.com'

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

interface BookingData {
  name: string
  phone: string
  players?: string | null
  date: string
  time: string
  source?: string | null
  message?: string | null
}

interface FeedbackData {
  name: string
  email: string
  phone?: string | null
  message: string
}

export async function sendBookingEmail(booking: BookingData): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
        🎯 Нова заявка на бронювання!
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">👤 Ім'я:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📱 Телефон:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${booking.phone}" style="color: #2563eb;">${booking.phone}</a>
          </td>
        </tr>
        ${booking.players ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">👥 Гравців:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.players}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📅 Дата:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.date}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">🕐 Час:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.time}</td>
        </tr>
        ${booking.source ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📢 Звідки дізнались:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.source}</td>
        </tr>
        ` : ''}
        ${booking.message ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">💬 Повідомлення:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.message}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px;">
        <a href="https://www.lasertag.kiev.ua/admin"
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Відкрити адмін-панель
        </a>
      </p>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Цей лист надіслано автоматично з сайту lasertag.kiev.ua
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Lasertag Kiev" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `🎯 Нова заявка: ${booking.name} на ${booking.date}`,
      html,
    })
    console.log('Booking email sent successfully')
  } catch (error) {
    console.error('Failed to send booking email:', error)
  }
}

export async function sendFeedbackEmail(feedback: FeedbackData): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
        📨 Нове повідомлення!
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">👤 Ім'я:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${feedback.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📧 Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${feedback.email}" style="color: #2563eb;">${feedback.email}</a>
          </td>
        </tr>
        ${feedback.phone ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">📱 Телефон:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${feedback.phone}" style="color: #2563eb;">${feedback.phone}</a>
          </td>
        </tr>
        ` : ''}
      </table>

      <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
        <strong>💬 Повідомлення:</strong>
        <p style="margin-top: 10px; white-space: pre-wrap;">${feedback.message}</p>
      </div>

      <p style="margin-top: 20px;">
        <a href="https://www.lasertag.kiev.ua/admin"
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Відкрити адмін-панель
        </a>
      </p>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Цей лист надіслано автоматично з сайту lasertag.kiev.ua
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Lasertag Kiev" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `📨 Повідомлення від ${feedback.name}`,
      html,
    })
    console.log('Feedback email sent successfully')
  } catch (error) {
    console.error('Failed to send feedback email:', error)
  }
}
