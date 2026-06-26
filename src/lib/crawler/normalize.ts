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
