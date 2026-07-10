/** Tien ich SEO dung chung: JSON-LD builder (breadcrumb...) + build metadata tung trang */

import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/queries'
import type { Media } from '@/payload-types'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const siteUrl = (path = '') => `${BASE}${path}`

/** Khoa cac trang co the cau hinh SEO tu admin (Cau hinh website -> tab SEO). */
export type PageSeoKey =
  | 'home'
  | 'giai-phap'
  | 'bang-gia'
  | 'tim-giai-phap'
  | 'tin-tuc'
  | 'chinh-sach'
  | 'dat-lich'
  | 'lien-he'

function mediaUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const m = ref as Media
    return m.sizes?.og?.url ?? m.url ?? undefined
  }
  return undefined
}

/**
 * Tao Metadata cho 1 trang cong khai, uu tien cau hinh SEO tu admin (site-settings)
 * roi moi den mac dinh trong code. `title`/`description` truyen vao la ban mac dinh.
 */
export async function buildPageMetadata(opts: {
  key: PageSeoKey
  path: string
  title?: string
  description?: string
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const override = (settings.pageSeo ?? []).find((p) => p.page === opts.key)

  const metaTitle = override?.metaTitle?.trim() || undefined
  const description = override?.metaDescription?.trim() || opts.description
  const ogImage = mediaUrl(override?.ogImage) ?? mediaUrl(settings.seoDefaultOgImage)

  // Admin nhap tieu de -> dung nguyen van (absolute, khong ghep template thuong hieu).
  // Bo trong -> dung mac dinh trong code (co ghep template "%s | KHDN Viettel HCM").
  const title: Metadata['title'] | undefined = metaTitle
    ? { absolute: metaTitle }
    : opts.title

  const ogTitle = metaTitle || opts.title

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: opts.path },
    openGraph: {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(description ? { description } : {}),
      url: opts.path,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

/** JSON-LD BreadcrumbList tu danh sach [ten, duong dan] */
export function breadcrumbJsonLd(items: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: siteUrl(path),
    })),
  }
}

/** Render <script type="application/ld+json"> an toan */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
