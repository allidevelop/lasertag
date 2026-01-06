import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { uk, ru, enUS } from 'date-fns/locale'
import { Loader2, CheckCircle, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  players: z.string().refine((val) => {
    const num = parseInt(val, 10)
    return !isNaN(num) && num >= 8
  }, 'Мінімальна група для бронювання 8 гравців'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  source: z.string().min(1, 'Please select an option'),
  message: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const locales = { uk, ru, en: enUS }

export function BookingForm() {
  const { t, i18n } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const currentLocale = locales[i18n.language as keyof typeof locales] || enUS

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        reset()
      }, 3000)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Ошибка отправки. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00',
  ]

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <p className="text-lg font-medium">{t('booking.success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('booking.name')}</Label>
        <Input
          id="name"
          placeholder={t('booking.namePlaceholder')}
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">{t('booking.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('booking.phonePlaceholder')}
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="players">{t('booking.players')}</Label>
          <Input
            id="players"
            type="number"
            placeholder={t('booking.playersPlaceholder')}
            {...register('players')}
            className={errors.players ? 'border-destructive' : ''}
          />
          {errors.players && (
            <p className="text-sm text-destructive mt-1">{errors.players.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>{t('booking.date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                  errors.date && 'border-destructive'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'dd MMMM yyyy', { locale: currentLocale })
                ) : (
                  <span>{t('booking.datePlaceholder')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  if (date) {
                    setValue('date', format(date, 'yyyy-MM-dd'))
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={currentLocale}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="time">{t('booking.time')}</Label>
          <Select onValueChange={(value) => setValue('time', value)}>
            <SelectTrigger className={errors.time ? 'border-destructive' : ''}>
              <SelectValue placeholder={t('booking.time')} />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && (
            <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="source">{t('booking.source')}</Label>
        <Select onValueChange={(value) => setValue('source', value)}>
          <SelectTrigger className={errors.source ? 'border-destructive' : ''}>
            <SelectValue placeholder={t('booking.sourcePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">{t('booking.sourceOptions.google')}</SelectItem>
            <SelectItem value="facebook">{t('booking.sourceOptions.facebook')}</SelectItem>
            <SelectItem value="instagram">{t('booking.sourceOptions.instagram')}</SelectItem>
            <SelectItem value="friends">{t('booking.sourceOptions.friends')}</SelectItem>
            <SelectItem value="other">{t('booking.sourceOptions.other')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.source && (
          <p className="text-sm text-destructive mt-1">{errors.source.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">{t('booking.message')}</Label>
        <Textarea
          id="message"
          placeholder={t('booking.messagePlaceholder')}
          {...register('message')}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        variant="glow"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          t('booking.submit')
        )}
      </Button>
    </form>
  )
}
