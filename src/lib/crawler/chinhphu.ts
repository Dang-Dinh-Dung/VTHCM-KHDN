import * as cheerio from 'cheerio'

import { mapDocumentTypeFromCode, parseVnDate } from './normalize'

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
 * Parse HTML danh sach van ban cua vanban.chinhphu.vn -> CrawledPolicy[].
 * Moi van ban la 1 <tr> trong table.search-result:
 *  - span.code     : so hieu (vd "239/2026/NĐ-CP")
 *  - span.issued-date: ngay ban hanh (dd/mm/yyyy)
 *  - span.substract: trich yeu (tieu de)
 *  - a[href*=docid]: link trang chi tiet
 * Loai van ban suy tu duoi ma so (trang khong hien chu loai).
 */
export function parseListingHtml(html: string, baseUrl: string): CrawledPolicy[] {
  const $ = cheerio.load(html)
  const out: CrawledPolicy[] = []

  $('table.search-result tr').each((_, el) => {
    const row = $(el)
    const code = row.find('span.code').first().text().trim()
    const title = row.find('span.substract').first().text().trim()
    if (!code || !title) return // bo qua hang tieu de (th) / hang thieu du lieu

    const href =
      row.find("a[href*='docid']").first().attr('href')?.trim() ||
      row.find('td a').first().attr('href')?.trim()
    if (!href) return
    const sourceUrl = new URL(href, baseUrl).toString()

    const dateText = row.find('span.issued-date').first().text().trim()

    out.push({
      title,
      documentNumber: code || undefined,
      documentType: mapDocumentTypeFromCode(code),
      issuingBody: undefined, // trang danh sach khong hien co quan ban hanh
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
