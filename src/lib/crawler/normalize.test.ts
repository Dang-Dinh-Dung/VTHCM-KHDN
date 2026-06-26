import { describe, it, expect } from 'vitest'
import { stripDiacritics, matchesKeywords } from './normalize'

describe('stripDiacritics', () => {
  it('bo dau tieng Viet va thuong hoa giu nguyen chu', () => {
    expect(stripDiacritics('Hóa Đơn Điện Tử')).toBe('hoa don dien tu')
  })
})

describe('matchesKeywords', () => {
  it('khop khong phan biet dau/hoa thuong', () => {
    expect(matchesKeywords('Nghị định về HÓA ĐƠN điện tử', ['hoa don dien tu'])).toBe(true)
    expect(matchesKeywords('Thông tư về chữ ký số', ['hóa đơn điện tử'])).toBe(false)
  })
  it('keyword co dau van khop', () => {
    expect(matchesKeywords('quy định bảo hiểm xã hội', ['bảo hiểm xã hội'])).toBe(true)
  })
  it('danh sach rong -> false', () => {
    expect(matchesKeywords('bất kỳ', [])).toBe(false)
  })
})
