'use client'

import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { cn } from '@/lib/cn'
import { Link, usePathname } from '@/i18n/navigation'
import { LOCALE_LABELS, routing, type AppLocale } from '@/i18n/routing'

export function LanguageSwitcher({
  className,
  onNavigate,
}: {
  className?: string
  /** Goi khi nguoi dung bam chon ngon ngu (vd: dong menu mobile). */
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const active = useLocale()
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()
  const href = queryString ? `${pathname}?${queryString}` : pathname

  return (
    <div
      className={cn('flex shrink-0 items-center gap-0.5 rounded-full bg-surface-muted p-0.5', className)}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active
        return (
          <Link
            key={locale}
            href={href}
            locale={locale}
            hrefLang={locale}
            onClick={onNavigate}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold transition-colors 2xl:px-2.5',
              isActive
                ? 'bg-viettel-red text-white'
                : 'text-ink-soft hover:bg-surface hover:text-viettel-red',
            )}
          >
            {LOCALE_LABELS[locale as AppLocale]}
          </Link>
        )
      })}
    </div>
  )
}
