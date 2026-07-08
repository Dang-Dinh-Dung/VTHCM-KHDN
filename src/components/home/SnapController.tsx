'use client'

import { useEffect } from 'react'

/**
 * Trang chu (desktop): CHI snap giua HERO va khoi noi dung dau tien (Ve Viettel).
 * - Cuon xuong o hero -> tu cuon muot toi dau khoi noi dung (duoi nav noi).
 * - Cuon len o dau noi dung -> ve hero.
 * - Tu "Ve Viettel" tro xuong: cuon TU NHIEN, khong nhay trang.
 * Chi desktop (>=1024px) + ton trong reduced-motion.
 */
export function SnapController() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let locked = false
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const dir = y > lastY ? 'down' : y < lastY ? 'up' : 'none'
      lastY = y
      if (locked || dir === 'none') return

      const content = document.getElementById('home-content')
      if (!content) return
      const contentTop = content.getBoundingClientRect().top + window.scrollY
      // Dung thap hon nav noi mot khoang -> chua dai do tren cung cho nav noi bat
      const NAV_GAP = 88
      const snapPos = Math.max(0, contentTop - NAV_GAP)

      // Dang o vung hero (giua dau trang va vi tri snap) -> keo han sang mot phia
      if (y > 4 && y < snapPos - 4) {
        locked = true
        const target = dir === 'up' ? 0 : snapPos
        window.scrollTo({ top: target, behavior: 'smooth' })
        window.setTimeout(() => {
          locked = false
          lastY = window.scrollY
        }, 700)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
