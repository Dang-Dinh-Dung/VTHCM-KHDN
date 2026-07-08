/** Tien ich SEO dung chung: JSON-LD builder (breadcrumb...) */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const siteUrl = (path = '') => `${BASE}${path}`

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
