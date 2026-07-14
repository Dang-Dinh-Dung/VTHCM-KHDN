import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

import { taxonomyLabel } from '@/lib/taxonomy-i18n'
import { POLICY_TYPES } from '@/lib/taxonomy'
import type { Policy } from '@/payload-types'

export async function PolicyRow({ item }: { item: Policy }) {
  const t = await getTranslations('taxonomy')
  const date = item.effectiveDate ? new Date(item.effectiveDate).toLocaleDateString('vi-VN') : null
  return (
    <Link
      href={`/chinh-sach/${item.slug}`}
      className="block rounded-xl border border-border-soft bg-surface p-4 transition-colors hover:border-viettel-red"
    >
      <div className="flex flex-wrap items-center gap-2">
        {item.documentNumber && (
          <span className="rounded bg-viettel-red/10 px-2 py-0.5 text-xs font-semibold text-viettel-red">{item.documentNumber}</span>
        )}
        <span className="text-xs font-medium text-ink-soft">{taxonomyLabel(t, 'policyTypes', item.documentType, POLICY_TYPES)}</span>
      </div>
      <h3 className="mt-2 font-semibold text-ink">{item.title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        {item.issuingBody && <span>{item.issuingBody}</span>}
        {date && <span>Hiệu lực: {date}</span>}
      </div>
    </Link>
  )
}
