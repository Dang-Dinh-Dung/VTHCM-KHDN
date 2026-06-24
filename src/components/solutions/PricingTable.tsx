import { Check, X } from 'lucide-react'

import { ButtonLink } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { formatVND } from '@/lib/format'
import type { Solution } from '@/payload-types'

type Tier = NonNullable<Solution['pricingTiers']>[number]

function priceDisplay(tier: Tier): string {
  if (tier.isContactForPrice) return 'Liên hệ'
  if (tier.priceLabel) return tier.priceLabel
  if (tier.price != null) return formatVND(tier.price)
  return 'Liên hệ'
}

export function PricingTable({
  tiers,
  solutionSlug,
  note,
}: {
  tiers?: Tier[] | null
  solutionSlug: string
  note?: string | null
}) {
  if (!tiers || tiers.length === 0) return null

  return (
    <div>
      <div className={cn('grid gap-5', tiers.length >= 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
        {tiers.map((tier, i) => (
          <div
            key={tier.id ?? i}
            className={cn(
              'flex flex-col rounded-2xl border p-6',
              tier.highlight
                ? 'border-viettel-red bg-surface shadow-brand ring-1 ring-viettel-red'
                : 'border-border-soft bg-surface',
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
              {tier.badge && (
                <span className="rounded-full bg-viettel-red px-2.5 py-0.5 text-xs font-semibold text-white">
                  {tier.badge}
                </span>
              )}
            </div>
            <div className="mb-4">
              <span className="text-2xl font-extrabold text-viettel-red">{priceDisplay(tier)}</span>
              {!tier.isContactForPrice && tier.priceSuffix && !tier.priceLabel && (
                <span className="text-sm text-ink-soft"> {tier.priceSuffix}</span>
              )}
            </div>

            <ul className="mb-6 flex-1 space-y-2 text-sm">
              {(tier.features ?? []).map((f, fi) => (
                <li key={fi} className="flex items-start gap-2">
                  {f.included === false ? (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft/40" aria-hidden />
                  ) : (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-pillar-governance" aria-hidden />
                  )}
                  <span className={cn(f.included === false ? 'text-ink-soft/50 line-through' : 'text-ink-soft')}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <ButtonLink
              href={`/dat-lich?solution=${solutionSlug}`}
              variant={tier.highlight ? 'primary' : 'outline'}
              size="md"
              className="w-full"
            >
              {tier.ctaLabel ?? 'Đăng ký tư vấn'}
            </ButtonLink>
          </div>
        ))}
      </div>
      {note && <p className="mt-4 text-sm text-ink-soft">* {note}</p>}
    </div>
  )
}
