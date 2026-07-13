/**
 * Tra nhan taxonomy theo ngon ngu hien tai.
 * taxonomy.ts GIU NGUYEN label tieng Viet (Payload admin can) -> dung lam fallback.
 */
import type { Option } from '@/lib/taxonomy'

export type TaxonomyGroup =
  | 'pillars'
  | 'industries'
  | 'needs'
  | 'companySizes'
  | 'newsCategories'
  | 'policyTypes'

/**
 * Ham dich cua next-intl: useTranslations('taxonomy') hoac getTranslations('taxonomy').
 * `has` la helper cua next-intl v4 de kiem tra key co ton tai khong (khong co trong ban
 * cu hon / mock don gian nen de optional va co fallback phong thu ben duoi).
 */
export type TaxT = ((key: string) => string) & { has?: (key: string) => boolean }

export function taxonomyLabel(
  t: TaxT,
  group: TaxonomyGroup,
  value: string | null | undefined,
  fallbackList: Option[],
): string {
  if (!value) return ''
  const key = `${group}.${value}`
  const viLabel = fallbackList.find((o) => o.value === value)?.label ?? value

  try {
    // Cach chinh: dung t.has() cua next-intl v4 de biet chac key co ban dich khong.
    if (typeof t.has === 'function') {
      return t.has(key) ? t(key) : viLabel
    }

    // Fallback phong thu: khong co t.has (vd mock cu / cau hinh next-intl cu hon).
    // next-intl KHONG tra ve bare key khi thieu ban dich -- no tra ve ca duong dan
    // namespaced (vd "taxonomy.pillars.vien-thong") hoac nem loi. Vi vay ta coi
    // moi ket qua chua chinh key (bare hoac namespaced) la mot cai mieng (miss).
    const translated = t(key)
    if (translated === key || translated.endsWith(`.${key}`)) return viLabel
    return translated
  } catch {
    return viLabel
  }
}
