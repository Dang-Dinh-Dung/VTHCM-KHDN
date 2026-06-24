import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Sinh khi co request de tranh phu thuoc DB luc build (CI/Docker)
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/giai-phap',
    '/tim-giai-phap',
    '/bang-gia',
    '/tin-tuc',
    '/chinh-sach',
    '/dat-lich',
    '/lien-he',
  ].map((path) => ({ url: `${BASE}${path}`, changeFrequency: 'weekly', priority: path === '' ? 1 : 0.7 }))

  const collect = async (collection: 'solutions' | 'news' | 'policies', prefix: string) => {
    const res = await payload.find({
      collection,
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true } as never,
    })
    return res.docs
      .filter((d) => (d as { slug?: string }).slug)
      .map((d) => ({
        url: `${BASE}${prefix}/${(d as { slug: string }).slug}`,
        lastModified: (d as { updatedAt?: string }).updatedAt
          ? new Date((d as { updatedAt: string }).updatedAt)
          : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
  }

  const [solutions, news, policies] = await Promise.all([
    collect('solutions', '/giai-phap'),
    collect('news', '/tin-tuc'),
    collect('policies', '/chinh-sach'),
  ])

  return [...staticRoutes, ...solutions, ...news, ...policies]
}
