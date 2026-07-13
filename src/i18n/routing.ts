import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en', 'zh'],
  defaultLocale: 'vi',
  // VI khong co tien to (/gia-phap), EN/ZH co (/en/..., /zh/...)
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]

/** Nhan hien thi tren nut chuyen ngon ngu */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  vi: 'VI',
  en: 'EN',
  zh: '中文',
}
