'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

/**
 * Hieu ung xuat hien khi cuon toi (scroll reveal): troi len + mo dan.
 * - Dung IntersectionObserver, chi chay 1 lan khi phan tu vao khung nhin.
 * - Ton trong prefers-reduced-motion (hien ngay, khong animate).
 * - `delay` (ms) de tao hieu ung so le (stagger) giua cac phan tu.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out will-change-transform motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
