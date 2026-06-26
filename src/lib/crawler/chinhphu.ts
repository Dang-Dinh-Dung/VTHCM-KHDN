import * as cheerio from 'cheerio'

import { mapDocumentType, parseVnDate } from './normalize'

/**
 * Kiem tra robots.txt: tra ve true neu targetUrl bi Disallow duoi User-agent: *.
 * Loi fetch/parse -> false (fail-open: tiep tuc crawl).
 */
async function isDisallowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const url = new URL(targetUrl)
    const robotsUrl = `${url.origin}/robots.txt`
    const res = await fetch(robotsUrl)
    if (!res.ok) return false
    const text = await res.text()
    const lines = text.split(/\r?\n/)
    let inStarGroup = false
    for (const raw of lines) {
      const line = raw.trim()
      if (line.startsWith('User-agent:')) {
        const agent = line.slice('User-agent:'.length).trim()
        inStarGroup = agent === '*'
      } else if (inStarGroup && line.startsWith('Disallow:')) {
        const disallowedPath = line.slice('Disallow:'.length).trim()
        if (disallowedPath && url.pathname.startsWith(disallowedPath)) {
          return true
        }
      }
    }
    return false
  } catch {
    return false
  }
}

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
  if (await isDisallowedByRobots(LISTING_URL)) {
    throw new Error('Bi chan boi robots.txt: ' + LISTING_URL)
  }
  const res = await fetch(LISTING_URL, {
    headers: { 'User-Agent': 'KHDN-Viettel-HCM-bot/1.0 (+landing page tra cuu chinh sach)' },
  })
  if (!res.ok) throw new Error(`Fetch nguon that bai: ${res.status}`)
  const html = await res.text()
  const items = parseListingHtml(html, LISTING_URL)
  return typeof opts.maxItems === 'number' ? items.slice(0, opts.maxItems) : items
}
