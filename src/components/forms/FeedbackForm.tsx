import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

export function FeedbackForm() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  })

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        reset()
      }, 3000)
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Ошибка отправки. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <p className="text-lg font-medium">{t('feedback.success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="feedback-name">{t('feedback.name')}</Label>
        <Input
          id="feedback-name"
          placeholder={t('feedback.namePlaceholder')}
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="feedback-email">{t('feedback.email')}</Label>
        <Input
          id="feedback-email"
          type="email"
          placeholder={t('feedback.emailPlaceholder')}
          {...register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="feedback-phone">{t('feedback.phone')}</Label>
        <Input
          id="feedback-phone"
          type="tel"
          placeholder={t('feedback.phonePlaceholder')}
          {...register('phone')}
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="feedback-message">{t('feedback.message')}</Label>
        <Textarea
          id="feedback-message"
          placeholder={t('feedback.messagePlaceholder')}
          {...register('message')}
          rows={5}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
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
          t('feedback.submit')
        )}
      </Button>
    </form>
  )
}
