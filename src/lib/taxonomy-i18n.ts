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

/** Ham dich cua next-intl: useTranslations('taxonomy') hoac getTranslations('taxonomy') */
export type TaxT = (key: string) => string

export function taxonomyLabel(
  t: TaxT,
  group: TaxonomyGroup,
  value: string | null | undefined,
  fallbackList: Option[],
): string {
  if (!value) return ''
  const viLabel = fallbackList.find((o) => o.value === value)?.label ?? value
  try {
    const translated = t(`${group}.${value}`)
    // next-intl tra ve chinh key khi thieu ban dich -> coi nhu chua dich, lui ve VI
    return translated === `${group}.${value}` ? viLabel : translated
  } catch {
    return viLabel
  }
}
