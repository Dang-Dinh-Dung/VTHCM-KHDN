'use client'

import { useState } from 'react'
import { ChevronRight, Menu, Phone, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { buttonClass } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { Link, usePathname } from '@/i18n/navigation'

const NAV = [
  { href: '/giai-phap', key: 'solutions' },
  { href: '/tim-giai-phap', key: 'finder' },
  { href: '/bang-gia', key: 'pricing' },
  { href: '/tin-tuc', key: 'news' },
  { href: '/chinh-sach', key: 'policies' },
  { href: '/lien-he', key: 'contact' },
] as const

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
  const t = useTranslations('nav')
  const tHeader = useTranslations('header')
  const pathname = usePathname()
  const telHref = hotline ? `tel:${hotline.replace(/[^0-9+]/g, '')}` : undefined

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      {/* Thanh nav dang pill noi (bo tron, do bong, nhan do Viettel) */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex h-12 items-center justify-between gap-3 rounded-full border border-white/40 bg-surface/60 pl-5 pr-5 shadow-lg shadow-ink/5 backdrop-blur-lg md:h-14 md:pl-6 md:pr-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            {logoUrl ? (
              // Logo Viettel upload trong admin
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Viettel KHDN Hồ Chí Minh" className="h-8 w-auto object-contain md:h-9" />
            ) : (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-viettel-red text-lg font-black text-white">
                  V
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-extrabold text-ink">Viettel KHDN</span>
                  <span className="block text-[11px] font-medium text-ink-soft">Hồ Chí Minh</span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('ariaMain')}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-viettel-red/10 text-viettel-red'
                    : 'text-ink hover:bg-surface-muted hover:text-viettel-red',
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {hotline && (
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-viettel-red transition-colors hover:bg-viettel-red/5"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {hotline}
              </a>
            )}
            <Link
              href="/dat-lich"
              className="inline-flex items-center gap-1.5 rounded-xl bg-viettel-red px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-viettel-red-dark"
            >
              {tHeader('cta')}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {/* Menu mobile - the noi bo tron */}
        {open && (
          <div className="mt-2 rounded-3xl border border-border-soft bg-surface p-2 shadow-lg shadow-ink/5 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label={t('ariaMobile')}>
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
                  {t(item.key)}
                  <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
                </Link>
              ))}
              <Link
                href="/dat-lich"
                onClick={() => setOpen(false)}
                className={buttonClass('primary', 'lg', 'mt-2')}
              >
                {tHeader('cta')}
              </Link>
              {hotline && (
                <a href={telHref} className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-viettel-red">
                  <Phone className="h-4 w-4" aria-hidden /> {tHeader('hotline')}: {hotline}
                </a>
              )}
              <LanguageSwitcher className="mt-2 self-center" />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
