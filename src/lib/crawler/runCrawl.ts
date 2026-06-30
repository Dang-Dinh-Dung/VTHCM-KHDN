import type { Payload, Where } from 'payload'

import type { Policy } from '@/payload-types'
import { fetchPolicyCandidates } from '@/lib/crawler/chinhphu'
import { matchesKeywords } from '@/lib/crawler/normalize'

export type CrawlResult = {
  ok: boolean
  skipped?: boolean
  reason?: string
  fetched: number
  matched: number
  created: number
  skippedExisting: number
  errors: string[]
  error?: string
}

/**
 * Logic crawl chinh sach dung chung cho ca cron (tu dong) lan nut admin (thu cong):
 * doc cau hinh -> fetch ung vien -> loc tu khoa -> dedupe -> tao Policies draft (source=crawl).
 * Khong bao gio nem loi: tra ve ket qua thong ke de caller xu ly.
 */
export async function runPolicyCrawl(payload: Payload): Promise<CrawlResult> {
  const errors: string[] = []
  let fetched = 0
  let matched = 0
  let created = 0
  let skippedExisting = 0

  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

    if (!settings?.policyCrawlEnabled) {
      return { ok: true, skipped: true, reason: 'disabled', fetched, matched, created, skippedExisting, errors }
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

        // Tai file PDF dinh kem (neu co) -> luu vao collection media -> gan vao attachment.
        // Loi tai file khong chan tao van ban (van tao, chi thieu file dinh kem).
        let attachmentId: number | undefined
        if (c.fileUrl) {
          try {
            const fileRes = await fetch(c.fileUrl)
            if (fileRes.ok) {
              const buffer = Buffer.from(await fileRes.arrayBuffer())
              const name = c.fileUrl.split('/').pop()?.split('?')[0] || `${c.documentNumber || 'vanban'}.pdf`
              const media = await payload.create({
                collection: 'media',
                overrideAccess: true,
                data: { alt: c.title.slice(0, 200) },
                file: { data: buffer, mimetype: 'application/pdf', name, size: buffer.length },
              })
              attachmentId = media.id as number
            }
          } catch (fileErr) {
            errors.push(`pdf "${c.title}": ${String(fileErr)}`)
          }
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
            attachment: attachmentId,
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

    return { ok: true, fetched, matched, created, skippedExisting, errors }
  } catch (err) {
    console.error('[runPolicyCrawl] failed:', err)
    return { ok: false, error: String(err), fetched, matched, created, skippedExisting, errors }
  }
}
