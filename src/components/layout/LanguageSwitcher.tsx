'use client'

import { useLocale } from 'next-intl'

import { cn } from '@/lib/cn'
import { Link, usePathname } from '@/i18n/navigation'
import { LOCALE_LABELS, routing, type AppLocale } from '@/i18n/routing'

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const active = useLocale()

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-full bg-surface-muted p-0.5', className)}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
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
