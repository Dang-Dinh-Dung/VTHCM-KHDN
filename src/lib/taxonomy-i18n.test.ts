import { describe, expect, it } from 'vitest'

import { taxonomyLabel } from './taxonomy-i18n'
import { PILLARS } from './taxonomy'

// Gia lap ham dich cua next-intl (namespace 'taxonomy'):
// - t.has(key) tra ve true/false neu key ton tai trong tu dien
// - t(key) tra ve ban dich neu co, hoac TOAN BO duong dan namespaced (vd 'taxonomy.pillars.vien-thong')
//   khi thieu ban dich -- KHONG bao gio tra ve chi bare key nhu 'pillars.vien-thong'
const makeT = (dict: Record<string, string>) => {
  const t = (key: string) => dict[key] ?? `taxonomy.${key}`
  t.has = (key: string) => key in dict
  return t
}

describe('taxonomyLabel', () => {
  it('tra ve ban dich khi tu dien co key', () => {
    const t = makeT({ 'pillars.vien-thong': 'Telecommunications' })
    expect(taxonomyLabel(t, 'pillars', 'vien-thong', PILLARS)).toBe('Telecommunications')
  })

  it('lui ve label tieng Viet khi thieu ban dich', () => {
    const t = makeT({}) // khong co ban dich nao
    expect(taxonomyLabel(t, 'pillars', 'vien-thong', PILLARS)).toBe('Viễn thông')
  })

  it('tra ve chuoi rong khi value rong', () => {
    const t = makeT({})
    expect(taxonomyLabel(t, 'pillars', null, PILLARS)).toBe('')
    expect(taxonomyLabel(t, 'pillars', undefined, PILLARS)).toBe('')
  })

  it('tra ve chinh value khi value khong co trong danh sach va khong co ban dich', () => {
    const t = makeT({})
    expect(taxonomyLabel(t, 'pillars', 'khong-ton-tai', PILLARS)).toBe('khong-ton-tai')
  })

  it('tuy chon moi them vao taxonomy.ts nhung chua co trong tu dien phai lui ve label tieng Viet, khong bao gio ra raw key', () => {
    // Mo phong tinh huong thuc te: option da co trong fallbackList (taxonomy.ts)
    // nhung chua duoc dich trong messages/*.json
    const newOption = { value: 'nong-nghiep-cong-nghe-cao', label: 'Nông nghiệp công nghệ cao' }
    const fallbackListWithNewOption = [...PILLARS, newOption]
    const t = makeT({}) // tu dien chua co ban dich cho gia tri moi
    const result = taxonomyLabel(t, 'pillars', newOption.value, fallbackListWithNewOption)
    expect(result).toBe('Nông nghiệp công nghệ cao')
    expect(result).not.toContain('taxonomy.')
    expect(result).not.toContain('pillars.')
  })
})
