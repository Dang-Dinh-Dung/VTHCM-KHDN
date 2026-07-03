'use client'

import { useEffect } from 'react'

/**
 * Bat scroll-snap cho trang chu bang cach them class .snap-hero vao <html>.
 * Go bo khi roi trang -> khong anh huong cac trang khac.
 */
export function SnapController() {
  useEffect(() => {
    const el = document.documentElement
    el.classList.add('snap-hero')
    return () => el.classList.remove('snap-hero')
  }, [])
  return null
}
