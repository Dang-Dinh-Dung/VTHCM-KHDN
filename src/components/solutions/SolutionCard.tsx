import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Badge } from '@/components/ui/primitives'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'
import { PILLARS } from '@/lib/taxonomy'
import type { Solution } from '@/payload-types'

const pillarOf = (value?: string | null) => PILLARS.find((p) => p.value === value)

function logoUrl(solution: Solution): string | undefined {
  const logo = solution.logo
  if (logo && typeof logo === 'object' && 'url' in logo) return logo.url ?? undefined
  return undefined
}

export async function SolutionCard({ solution }: { solution: Solution }) {
  const t = await getTranslations('taxonomy')
  const pillar = pillarOf(solution.pillar)
  const url = logoUrl(solution)

  return (
    <Link
      href={`/giai-phap/${solution.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-viettel-red/40 hover:shadow-brand"
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white"
          style={{ backgroundColor: pillar?.color ?? '#ee0033' }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={solution.title} className="h-8 w-8 object-contain" />
          ) : (
            (solution.shortName ?? solution.title).charAt(0)
          )}
        </div>
        {pillar && (
          <Badge color={pillar.color}>{taxonomyLabel(t, 'pillars', pillar.value, PILLARS)}</Badge>
        )}
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-viettel-red">
        {solution.title}
      </h3>
      {solution.tagline && <p className="mt-1 text-sm font-medium text-ink-soft">{solution.tagline}</p>}
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{solution.shortDesc}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-viettel-red">
        Xem chi tiết
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  )
}
