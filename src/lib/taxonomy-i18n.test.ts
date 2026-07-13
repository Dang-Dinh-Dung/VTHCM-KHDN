import { describe, expect, it } from 'vitest'

import { taxonomyLabel } from './taxonomy-i18n'
import { PILLARS } from './taxonomy'

// Gia lap ham dich cua next-intl: co ban dich thi tra ve, thieu thi tra ve chinh key
const makeT = (dict: Record<string, string>) => (key: string) => dict[key] ?? key

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
})
