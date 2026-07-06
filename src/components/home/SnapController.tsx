'use client'

import { useEffect } from 'react'

/**
 * Trang chu (desktop): moi lan lan chuot NHAY THANG sang muc truoc/sau
 * (hero -> Ve Viettel -> He sinh thai -> Vi sao chon -> ...), moi muc
 * hien tron man hinh. Cac muc duoc danh dau bang thuoc tinh [data-snap].
 * - Chi desktop (>=1024px) + ton trong reduced-motion.
 * - Cham/keyboard/thanh cuon van hoat dong tu nhien (chi chan wheel).
 * - Qua khoi muc cuoi (footer) -> tra lai cuon tu nhien.
 */
export function SnapController() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Khoang chua duoi nav noi khi dung o dau moi muc
    const NAV_GAP = 88
    let locked = false

    const getTargets = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'))
      return els.map((el, i) => {
        const top = el.getBoundingClientRect().top + window.scrollY
        return i === 0 ? 0 : Math.max(0, top - NAV_GAP)
      })
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return // zoom bang Ctrl+lan chuot
      const targets = getTargets()
      if (targets.length === 0) return

      const y = window.scrollY
      const last = targets[targets.length - 1]

      // Da qua muc cuoi (vung footer)
      if (y > last + 40) {
        if (e.deltaY > 0) return // cuon xuong tu nhien trong footer
        // cuon len tu footer -> nhay ve muc cuoi
        e.preventDefault()
        if (locked) return
        locked = true
        window.scrollTo({ top: last, behavior: 'smooth' })
        window.setTimeout(() => (locked = false), 850)
        return
      }

      e.preventDefault()
      if (locked || Math.abs(e.deltaY) < 8) return

      const dir = e.deltaY > 0 ? 1 : -1
      // Muc hien tai: moc gan nhat phia tren vi tri cuon
      let idx = 0
      for (let i = 0; i < targets.length; i++) {
        if (y >= targets[i] - 8) idx = i
      }
      const next = Math.min(targets.length - 1, Math.max(0, idx + dir))
      if (next === idx) {
        // Dang o muc cuoi va cuon xuong -> tha cho troi xuong footer
        if (dir > 0) window.scrollBy({ top: e.deltaY })
        return
      }

      locked = true
      window.scrollTo({ top: targets[next], behavior: 'smooth' })
      window.setTimeout(() => (locked = false), 850)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  return null
}
