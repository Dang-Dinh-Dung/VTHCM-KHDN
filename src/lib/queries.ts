import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'
import type { News, Policy, SiteSetting, Solution } from '@/payload-types'

/**
 * Luu y: Local API mac dinh overrideAccess = true (bo qua access control),
 * nen cac ham doc cong khai PHAI tu loc status = 'published'.
 */

export type PillarSolutionItem = {
  id: string | number
  name: string
  slug: string
  slogan: string
  logoUrl?: string
}

/** Nhom giai phap (da xuat ban) theo tru cot: dung cho accordion so do he sinh thai. */
export async function getSolutionsByPillar(): Promise<Record<string, PillarSolutionItem[]>> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'solutions',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 1,
    sort: 'title',
  })
  const out: Record<string, PillarSolutionItem[]> = {}
  for (const s of res.docs as Solution[]) {
    const pillar = s.pillar
    if (!pillar) continue
    // Dung anh GOC (khong dung thumbnail vi thumbnail bi crop giua -> xen logo rong)
    const logo = s.logo && typeof s.logo === 'object' ? (s.logo.url ?? undefined) : undefined
    if (!s.slug) continue
    ;(out[pillar] ??= []).push({
      id: s.id,
      name: s.shortName || s.title,
      slug: s.slug,
      slogan: s.shortDesc || '',
      logoUrl: logo ?? undefined,
    })
  }
  return out
}

export type SolutionFilters = {
  pillar?: string
  productGroup?: string
  industry?: string
  need?: string
  companySize?: string
  q?: string
  page?: number
  limit?: number
  sort?: string
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export async function getSolutions(filters: SolutionFilters = {}) {
  const payload = await getPayloadClient()
  const and: Where[] = [{ status: { equals: 'published' } }]

  if (filters.pillar) and.push({ pillar: { equals: filters.pillar } })
  if (filters.productGroup) and.push({ productGroup: { equals: filters.productGroup } })
  if (filters.industry) and.push({ industries: { contains: filters.industry } })
  if (filters.need) and.push({ needs: { contains: filters.need } })
  if (filters.companySize) and.push({ companySizes: { contains: filters.companySize } })
  if (filters.q) {
    and.push({
      or: [
        { title: { like: filters.q } },
        { shortName: { like: filters.q } },
        { shortDesc: { like: filters.q } },
      ],
    })
  }

  return payload.find({
    collection: 'solutions',
    where: { and },
    sort: filters.sort ?? 'order',
    page: filters.page ?? 1,
    limit: filters.limit ?? 24,
    depth: 1,
  })
}

export async function getFeaturedSolutions(limit = 6): Promise<Solution[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'solutions',
    where: { and: [{ status: { equals: 'published' } }, { isFeatured: { equals: true } }] },
    sort: 'order',
    limit,
    depth: 1,
  })
  return res.docs
}

export async function getSolutionBySlug(slug: string): Promise<Solution | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'solutions',
    where: { and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getAllSolutionSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'solutions',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
    select: { slug: true },
  })
  return res.docs.map((d) => d.slug).filter(Boolean) as string[]
}

/** Dem so giai phap theo tung tru cot (cho trang chu & bo loc) */
export async function getPillarCounts(): Promise<Record<string, number>> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'solutions',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    select: { pillar: true },
  })
  const counts: Record<string, number> = {}
  for (const d of res.docs) {
    const p = (d as { pillar?: string }).pillar
    if (p) counts[p] = (counts[p] ?? 0) + 1
  }
  return counts
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'news',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return res.docs
}

export async function getNewsList(opts: { category?: string; page?: number; limit?: number } = {}) {
  const payload = await getPayloadClient()
  const and: Where[] = [{ status: { equals: 'published' } }]
  if (opts.category) and.push({ category: { equals: opts.category } })
  return payload.find({
    collection: 'news',
    where: { and },
    sort: '-publishedAt',
    page: opts.page ?? 1,
    limit: opts.limit ?? 9,
    depth: 1,
  })
}

export async function getPoliciesList(
  opts: { documentType?: string; q?: string; issuingBody?: string; year?: string; page?: number; limit?: number } = {},
) {
  const payload = await getPayloadClient()
  const and: Where[] = [{ status: { equals: 'published' } }]
  if (opts.documentType) and.push({ documentType: { equals: opts.documentType } })
  if (opts.issuingBody) and.push({ issuingBody: { equals: opts.issuingBody } })
  if (opts.q && opts.q.trim()) {
    const q = opts.q.trim()
    and.push({
      or: [
        { title: { like: q } },
        { documentNumber: { like: q } },
        { summary: { like: q } },
      ],
    })
  }
  if (opts.year && /^\d{4}$/.test(opts.year)) {
    and.push({ effectiveDate: { greater_than_equal: `${opts.year}-01-01T00:00:00.000Z` } })
    and.push({ effectiveDate: { less_than_equal: `${opts.year}-12-31T23:59:59.999Z` } })
  }
  return payload.find({
    collection: 'policies',
    where: { and },
    sort: '-effectiveDate',
    page: opts.page ?? 1,
    limit: opts.limit ?? 12,
    depth: 1,
  })
}

/** Danh sach co quan ban hanh (distinct, da xuat ban) cho bo loc. */
export async function getPolicyIssuingBodies(): Promise<string[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'policies',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
  })
  const set = new Set<string>()
  for (const d of res.docs as Array<{ issuingBody?: string | null }>) {
    if (d.issuingBody) set.add(d.issuingBody)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'))
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'news',
    where: { and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getLatestPolicies(limit = 4): Promise<Policy[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'policies',
    where: { status: { equals: 'published' } },
    sort: '-effectiveDate',
    limit,
    depth: 1,
  })
  return res.docs
}

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'policies',
    where: { and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}
