import { describe, it, expect } from 'vitest'
import { stripDiacritics, matchesKeywords, mapDocumentType, parseVnDate } from './normalize'

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

describe('mapDocumentType', () => {
  it('nhan dien cac loai pho bien', () => {
    expect(mapDocumentType('Nghị định')).toBe('nghi-dinh')
    expect(mapDocumentType('THÔNG TƯ 12')).toBe('thong-tu')
    expect(mapDocumentType('Quyết định')).toBe('quyet-dinh')
    expect(mapDocumentType('Luật')).toBe('luat')
    expect(mapDocumentType('Công văn')).toBe('cong-van')
  })
  it('khong nhan dien -> nghi-dinh', () => {
    expect(mapDocumentType('Văn bản lạ')).toBe('nghi-dinh')
  })
})

describe('parseVnDate', () => {
  it('dd/mm/yyyy -> ISO', () => {
    expect(parseVnDate('15/03/2026')?.slice(0, 10)).toBe('2026-03-15')
  })
  it('chuoi rac -> undefined', () => {
    expect(parseVnDate('không phải ngày')).toBeUndefined()
    expect(parseVnDate('')).toBeUndefined()
  })
})
