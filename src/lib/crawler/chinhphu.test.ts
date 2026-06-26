import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'
import { parseListingHtml } from './chinhphu'

const html = readFileSync(path.join(__dirname, '__fixtures__/listing.html'), 'utf-8')

describe('parseListingHtml', () => {
  const items = parseListingHtml(html, 'https://vanban.chinhphu.vn')

  it('lay dung so luong van ban co title + link', () => {
    expect(items.length).toBe(2)
  })
  it('chuan hoa cac truong', () => {
    const first = items[0]
    expect(first.title).toBe('Nghị định về hóa đơn điện tử')
    expect(first.documentType).toBe('nghi-dinh')
    expect(first.documentNumber).toBe('70/2026/NĐ-CP')
    expect(first.issuingBody).toBe('Bộ Tài chính')
    expect(first.effectiveDate?.slice(0, 10)).toBe('2026-03-15')
    expect(first.sourceUrl).toBe('https://vanban.chinhphu.vn/he-thong-van-ban?id=123')
  })
})
