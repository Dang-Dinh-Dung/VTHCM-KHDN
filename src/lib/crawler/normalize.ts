/** Bo dau tieng Viet (NFD) + thuong hoa, giu khoang trang. */
export function stripDiacritics(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/** True neu text chua it nhat 1 keyword (so khop sau khi bo dau/thuong hoa). */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  if (!keywords || keywords.length === 0) return false
  const haystack = stripDiacritics(text)
  return keywords.some((k) => {
    const needle = stripDiacritics(k)
    return needle.length > 0 && haystack.includes(needle)
  })
}

/** Map text loai van ban -> value trong POLICY_TYPES; mac dinh nghi-dinh. */
export function mapDocumentType(raw: string): string {
  const t = stripDiacritics(raw)
  if (t.includes('thong tu')) return 'thong-tu'
  if (t.includes('quyet dinh')) return 'quyet-dinh'
  if (t.includes('cong van')) return 'cong-van'
  if (t.includes('luat')) return 'luat'
  if (t.includes('nghi dinh')) return 'nghi-dinh'
  return 'nghi-dinh'
}

/**
 * Map loai van ban tu MA SO HIEU (vd "239/2026/NĐ-CP", "1155/QĐ-TTg", "12/2024/QH15").
 * Trang vanban.chinhphu.vn chi hien ma so, khong hien chu loai -> suy tu duoi ma.
 * Mac dinh nghi-dinh.
 */
export function mapDocumentTypeFromCode(code: string): string {
  const c = stripDiacritics(code) // vd "239/2026/nd-cp"
  if (c.includes('nd-')) return 'nghi-dinh'
  if (c.includes('qd-')) return 'quyet-dinh'
  if (c.includes('ttlt') || c.includes('tt-')) return 'thong-tu'
  if (c.includes('qh')) return 'luat' // luat do Quoc hoi ban hanh: .../QH15
  if (c.includes('cv-') || c.includes('-cv')) return 'cong-van'
  return 'nghi-dinh'
}

/** Parse ngay dd/mm/yyyy -> ISO string; loi -> undefined. */
export function parseVnDate(raw: string): string | undefined {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return undefined
  const [, dd, mm, yyyy] = m
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)))
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}
