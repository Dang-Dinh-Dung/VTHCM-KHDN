'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight, Menu, Phone, Search, X } from 'lucide-react'

import { buttonClass } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/giai-phap', label: 'Giải pháp' },
  { href: '/tim-giai-phap', label: 'Tìm giải pháp' },
  { href: '/bang-gia', label: 'Bảng giá' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/chinh-sach', label: 'Nghị định & chính sách' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export function SiteHeader({
  hotline,
  logoUrl,
}: {
  hotline?: string | null
  email?: string | null
  departmentName?: string | null
  logoUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const telHref = hotline ? `tel:${hotline.replace(/[^0-9+]/g, '')}` : undefined

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50">
      {/* Thanh chinh */}
      <div className="border-b border-border-soft bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            {logoUrl ? (
              // Logo Viettel upload trong admin
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Viettel KHDN Hồ Chí Minh" className="h-9 w-auto object-contain md:h-10" />
            ) : (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-viettel-red text-lg font-black text-white">
                  V
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-extrabold text-ink">Viettel KHDN</span>
                  <span className="block text-[11px] font-medium text-ink-soft">Hồ Chí Minh</span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Điều hướng chính">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-viettel-red'
                    : 'text-ink hover:text-viettel-red',
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-viettel-red" aria-hidden />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/giai-phap"
              aria-label="Tìm kiếm giải pháp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-muted"
            >
              <Search className="h-5 w-5" aria-hidden />
            </Link>
            {hotline && (
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-xl border border-viettel-red/30 px-3 py-2 text-sm font-bold text-viettel-red transition-colors hover:bg-viettel-red/5"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {hotline}
              </a>
            )}
            <Link href="/dat-lich" className={buttonClass('primary', 'md')}>
              Đăng ký tư vấn
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-muted lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="border-t border-border-soft bg-surface lg:hidden">
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Điều hướng di động">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    isActive(item.href) ? 'bg-viettel-red/5 text-viettel-red' : 'text-ink hover:bg-surface-muted',
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
                </Link>
              ))}
              <Link
                href="/dat-lich"
                onClick={() => setOpen(false)}
                className={buttonClass('primary', 'lg', 'mt-2')}
              >
                Đăng ký tư vấn
              </Link>
              {hotline && (
                <a href={telHref} className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-viettel-red">
                  <Phone className="h-4 w-4" aria-hidden /> Hotline: {hotline}
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
