'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Handshake,
  LayoutGrid,
  type LucideIcon,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { cn } from '@/lib/cn'
import { PILLARS } from '@/lib/taxonomy'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

export type ExplorerSolution = {
  id: string
  slug: string
  title: string
  shortName?: string
  tagline?: string
  shortDesc?: string
  pillar?: string
  logoUrl?: string
  popular: boolean
}

type Sort = 'popular' | 'name'

export function SolutionsExplorer({
  sols,
  initialPillar = 'all',
}: {
  sols: ExplorerSolution[]
  initialPillar?: string
}) {
  const pillarsPresent = useMemo(
    () =>
      PILLARS.map((p) => ({
        value: p.value,
        label: p.label,
        count: sols.filter((s) => s.pillar === p.value).length,
      })).filter((p) => p.count > 0),
    [sols],
  )

  const validInitial = initialPillar !== 'all' && pillarsPresent.some((p) => p.value === initialPillar)
  const [pillar, setPillar] = useState(validInitial ? initialPillar : 'all')
  const [sort, setSort] = useState<Sort>('popular')

  const filtered = useMemo(() => {
    const list = pillar === 'all' ? sols : sols.filter((s) => s.pillar === pillar)
    return [...list].sort((a, b) =>
      sort === 'name'
        ? a.title.localeCompare(b.title, 'vi')
        : Number(b.popular) - Number(a.popular) || a.title.localeCompare(b.title, 'vi'),
    )
  }, [sols, pillar, sort])

  const tabs = [{ value: 'all', label: 'Tất cả', count: sols.length }, ...pillarsPresent]

  return (
    <div>
      {/* ===== Tabs tru cot (tu xuong hang khi het cho) ===== */}
      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((p) => {
          const Icon = p.value === 'all' ? LayoutGrid : (PILLAR_ICONS[p.value] ?? ShieldCheck)
          const active = p.value === pillar
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setPillar(p.value)}
              className={cn(
                'flex min-w-[12rem] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
                active
                  ? 'border-viettel-red bg-viettel-red/5 shadow-brand'
                  : 'border-border-soft bg-surface hover:border-viettel-red/40',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  active ? 'bg-viettel-red text-white' : 'bg-surface-muted text-ink-soft',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className={cn('block text-sm font-bold leading-snug', active ? 'text-viettel-red' : 'text-ink')}>
                  {p.label}
                </span>
                <span className="text-xs text-ink-soft">{p.count} giải pháp</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* ===== Thanh sap xep ===== */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-ink">
          {pillar === 'all' ? 'Tất cả giải pháp' : tabs.find((t) => t.value === pillar)?.label}
          <span className="ml-2 text-sm font-medium text-ink-soft">({filtered.length})</span>
        </h2>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Sắp xếp:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm font-medium text-ink focus:border-viettel-red focus:outline-none"
          >
            <option value="popular">Nổi bật</option>
            <option value="name">Tên A → Z</option>
          </select>
        </label>
      </div>

      {/* ===== Luoi the giai phap (bam -> trang chi tiet) ===== */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center text-ink-soft">
          Chưa có giải pháp trong nhóm này.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SolutionCard key={s.id} sol={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function SolutionCard({ sol }: { sol: ExplorerSolution }) {
  const Icon = PILLAR_ICONS[sol.pillar ?? ''] ?? ShieldCheck
  const pillarLabel = PILLARS.find((p) => p.value === sol.pillar)?.label
  return (
    <Link
      href={`/giai-phap/${sol.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-viettel-red/40 hover:shadow-brand"
    >
      {sol.popular && (
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-viettel-red/10 px-2 py-0.5 text-[11px] font-bold text-viettel-red">
          Nổi bật
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-viettel-red/10">
          {sol.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sol.logoUrl} alt={sol.title} className="max-h-9 max-w-full object-contain" loading="lazy" />
          ) : (
            <Icon className="h-6 w-6 text-viettel-red" aria-hidden />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink group-hover:text-viettel-red">
            {sol.shortName || sol.title}
          </h3>
          {sol.tagline && <p className="truncate text-xs text-viettel-red/80">{sol.tagline}</p>}
        </div>
      </div>

      {sol.shortDesc && (
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">{sol.shortDesc}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-soft pt-3">
        {pillarLabel && (
          <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-soft">
            {pillarLabel}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-viettel-red">
          Xem chi tiết
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
