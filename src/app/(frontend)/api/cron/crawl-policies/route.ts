import { NextResponse } from 'next/server'
import type { Where } from 'payload'

import type { Policy } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { fetchPolicyCandidates } from '@/lib/crawler/chinhphu'
import { matchesKeywords } from '@/lib/crawler/normalize'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get('secret') === secret
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const errors: string[] = []
  let fetched = 0
  let matched = 0
  let created = 0
  let skippedExisting = 0

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

    if (!settings?.policyCrawlEnabled) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'disabled' })
    }
    const keywords = (settings.policyCrawlKeywords ?? [])
      .map((k: { keyword?: string }) => (k?.keyword ?? '').trim())
      .filter(Boolean)

    const candidates = await fetchPolicyCandidates({ maxItems: 50 })
    fetched = candidates.length

    for (const c of candidates) {
      try {
        if (!matchesKeywords(`${c.title} ${c.summary ?? ''}`, keywords)) continue
        matched += 1

        // Dedupe theo documentNumber roi toi sourceUrl
        const or: Where[] = []
        if (c.documentNumber) or.push({ documentNumber: { equals: c.documentNumber } })
        or.push({ sourceUrl: { equals: c.sourceUrl } })
        const existing = await payload.find({
          collection: 'policies',
          where: { or },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        if (existing.totalDocs > 0) {
          skippedExisting += 1
          continue
        }

        await payload.create({
          collection: 'policies',
          overrideAccess: true,
          data: {
            title: c.title,
            summary: c.summary || c.title,
            documentType: c.documentType as Policy['documentType'],
            documentNumber: c.documentNumber,
            issuingBody: c.issuingBody,
            effectiveDate: c.effectiveDate,
            sourceUrl: c.sourceUrl,
            source: 'crawl',
            crawledAt: new Date().toISOString(),
            status: 'draft',
          },
        })
        created += 1
      } catch (itemErr) {
        errors.push(`item "${c.title}": ${String(itemErr)}`)
      }
    }

    return NextResponse.json({ ok: true, fetched, matched, created, skippedExisting, errors })
  } catch (err) {
    console.error('[cron/crawl-policies] failed:', err)
    // Khong nem 500 vi loi fetch/parse: tra ket qua de cron khong bao loi lien tuc
    return NextResponse.json({ ok: false, error: String(err), fetched, matched, created, skippedExisting, errors })
  }
}
