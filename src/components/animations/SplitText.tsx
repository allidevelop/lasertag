import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'

interface SplitTextProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitBy?: 'chars' | 'words' | 'lines'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  rootMargin?: string
  textAlign?: CSSProperties['textAlign']
  onAnimationComplete?: () => void
}

export function SplitText({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  ease = 'power3.out',
  splitBy = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const text = typeof children === 'string' ? children : container.textContent || ''
    let elements: string[] = []

    switch (splitBy) {
      case 'chars':
        elements = text.split('')
        break
      case 'words':
        elements = text.split(' ')
        break
      case 'lines':
        elements = text.split('\n')
        break
    }

    container.innerHTML = elements
      .map((el, i) => {
        const content = el === ' ' ? '&nbsp;' : el
        return `<span class="split-element inline-block" style="display: inline-block;" data-index="${i}">${content}</span>`
      })
      .join(splitBy === 'words' ? '<span class="inline-block">&nbsp;</span>' : '')

    const splitElements = container.querySelectorAll('.split-element')

    gsap.set(splitElements, from)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            gsap.to(splitElements, {
              ...to,
              duration,
              ease,
              stagger: 0.03,
              delay,
              onComplete: onAnimationComplete,
            })
            observer.disconnect()
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [children, delay, duration, ease, splitBy, from, to, threshold, rootMargin, onAnimationComplete])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ textAlign }}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  )
}
