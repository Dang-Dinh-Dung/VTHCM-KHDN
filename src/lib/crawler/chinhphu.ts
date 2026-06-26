import * as cheerio from 'cheerio'

import { mapDocumentType, parseVnDate } from './normalize'

export type CrawledPolicy = {
  title: string
  documentNumber?: string
  documentType: string
  issuingBody?: string
  effectiveDate?: string
  summary?: string
  sourceUrl: string
}

const LISTING_URL =
  process.env.POLICY_SOURCE_URL || 'https://vanban.chinhphu.vn/he-thong-van-ban'

/**
 * Parse HTML trang danh sach -> CrawledPolicy[].
 * SELECTOR duoi day theo cau truc bang gia dinh; chinh theo HTML that.
 */
export function parseListingHtml(html: string, baseUrl: string): CrawledPolicy[] {
  const $ = cheerio.load(html)
  const out: CrawledPolicy[] = []

  $('table.list-vb tbody tr').each((_, el) => {
    const row = $(el)
    const link = row.find('td.col-title a').first()
    const title = link.text().trim()
    const href = link.attr('href')?.trim()
    if (!title || !href) return // bo qua hang thieu du lieu

    const sourceUrl = new URL(href, baseUrl).toString()
    const typeText = row.find('td.col-type').text().trim()
    const number = row.find('td.col-number').text().trim()
    const body = row.find('td.col-body').text().trim()
    const dateText = row.find('td.col-date').text().trim()

    out.push({
      title,
      documentNumber: number || undefined,
      documentType: mapDocumentType(typeText || title),
      issuingBody: body || undefined,
      effectiveDate: parseVnDate(dateText),
      sourceUrl,
    })
  })

  return out
}

/** Fetch trang that roi parse. Nem loi neu fetch that bai. */
export async function fetchPolicyCandidates(
  opts: { maxItems?: number } = {},
): Promise<CrawledPolicy[]> {
  const res = await fetch(LISTING_URL, {
    headers: { 'User-Agent': 'KHDN-Viettel-HCM-bot/1.0 (+landing page tra cuu chinh sach)' },
  })
  if (!res.ok) throw new Error(`Fetch nguon that bai: ${res.status}`)
  const html = await res.text()
  const items = parseListingHtml(html, LISTING_URL)
  return typeof opts.maxItems === 'number' ? items.slice(0, opts.maxItems) : items
}
