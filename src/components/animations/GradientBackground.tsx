import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GradientBackgroundProps {
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
}

export function GradientBackground({
  className,
  colors = ['#0090ff', '#0070cc', '#8b5cf6', '#0090ff'],
  speed = 8,
  blur = 100,
}: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    }

    const animate = () => {
      time += 0.001 * speed
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const numBlobs = colors.length
      const blobs = colors.map((color, i) => {
        const angle = (i / numBlobs) * Math.PI * 2 + time
        const x = canvas.width / 2 + Math.cos(angle) * (canvas.width * 0.3)
        const y = canvas.height / 2 + Math.sin(angle * 0.7) * (canvas.height * 0.3)
        return { x, y, color: hexToRgb(color) }
      })

      blobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          Math.max(canvas.width, canvas.height) * 0.5
        )
        gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.4)`)
        gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [colors, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 -z-10', className)}
      style={{ filter: `blur(${blur}px)` }}
    />
  )
}
