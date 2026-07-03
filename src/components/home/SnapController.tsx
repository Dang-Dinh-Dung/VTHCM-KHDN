'use client'

import { useEffect } from 'react'

/**
 * Trang chu (desktop): dang o hero, lan chuot xuong MOT cai -> tu cuon muot toi
 * khung noi dung (fill man hinh ngay). O dau khung noi dung, lan len -> ve hero.
 * Chi bat tren desktop (>=1024px) va ton trong prefers-reduced-motion.
 */
export function SnapController() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let locked = false
    const unlock = () => {
      locked = false
    }

    const onWheel = (e: WheelEvent) => {
      const content = document.getElementById('home-content')
      if (!content) return
      const contentTop = content.getBoundingClientRect().top + window.scrollY
      const y = window.scrollY

      if (locked) {
        e.preventDefault()
        return
      }
      // Trong vung hero, lan xuong -> nhay toi khung noi dung
      if (e.deltaY > 0 && y < contentTop - 8) {
        e.preventDefault()
        locked = true
        window.scrollTo({ top: contentTop, behavior: 'smooth' })
        window.setTimeout(unlock, 750)
      }
      // O dau khung noi dung, lan len -> ve hero
      else if (e.deltaY < 0 && y > 0 && y <= contentTop + 8) {
        e.preventDefault()
        locked = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        window.setTimeout(unlock, 750)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  return null
}
