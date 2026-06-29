import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'
import { parseListingHtml } from './chinhphu'

const html = readFileSync(path.join(__dirname, '__fixtures__/listing.html'), 'utf-8')

describe('parseListingHtml', () => {
  const items = parseListingHtml(html, 'https://vanban.chinhphu.vn')

  it('lay dung so luong van ban (bo qua hang tieu de)', () => {
    expect(items.length).toBe(2)
  })
  it('chuan hoa cac truong tu cau truc that vanban.chinhphu.vn', () => {
    const first = items[0]
    expect(first.title).toBe('Sửa đổi quy định về hóa đơn điện tử trong hoạt động thương mại')
    expect(first.documentNumber).toBe('239/2026/NĐ-CP')
    expect(first.documentType).toBe('nghi-dinh')
    expect(first.effectiveDate?.slice(0, 10)).toBe('2026-06-26')
    expect(first.sourceUrl).toBe('https://vanban.chinhphu.vn/?pageid=27160&docid=218591')
    expect(first.issuingBody).toBeUndefined()
  })
  it('suy loai van ban tu duoi ma so (QĐ -> quyet-dinh)', () => {
    expect(items[1].documentType).toBe('quyet-dinh')
    expect(items[1].documentNumber).toBe('1155/QĐ-TTg')
  })
})
