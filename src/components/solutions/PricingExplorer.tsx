'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  Handshake,
  Headset,
  type LucideIcon,
  Minus,
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

export type PricingTierData = {
  name: string
  badge?: string
  highlight?: boolean
  priceLabel: string
  features: { text: string; included: boolean }[]
}
export type PricingSolution = {
  id: string
  slug: string
  title: string
  shortName?: string
  tagline?: string
  shortDesc?: string
  pillar?: string
  logoUrl?: string
  popular: boolean
  minPrice: number
  tiers: PricingTierData[]
}

type Sort = 'popular' | 'price-asc'

export function PricingExplorer({ sols }: { sols: PricingSolution[] }) {
  // Cac tru cot co giai phap co gia, theo thu tu PILLARS
  const pillarsPresent = useMemo(() => {
    return PILLARS.map((p) => ({
      value: p.value,
      label: p.label,
      count: sols.filter((s) => s.pillar === p.value).length,
    })).filter((p) => p.count > 0)
  }, [sols])

  const [pillar, setPillar] = useState(pillarsPresent[0]?.value ?? '')
  const [sort, setSort] = useState<Sort>('popular')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const list = sols.filter((s) => s.pillar === pillar)
    return [...list].sort((a, b) =>
      sort === 'price-asc' ? a.minPrice - b.minPrice : Number(b.popular) - Number(a.popular),
    )
  }, [sols, pillar, sort])

  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null

  const onPillar = (v: string) => {
    setPillar(v)
    setSelectedId(null)
  }

  return (
    <div>
      {/* ===== Tabs tru cot ===== */}
      <div className="relative mb-8">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pillarsPresent.map((p) => {
            const Icon = PILLAR_ICONS[p.value] ?? ShieldCheck
            const active = p.value === pillar
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPillar(p.value)}
                className={cn(
                  'flex min-w-[13rem] shrink-0 snap-start items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
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
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
        {/* ===== Luoi the giai phap ===== */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-ink">Các giải pháp</h2>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Sắp xếp:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm font-medium text-ink focus:border-viettel-red focus:outline-none"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((s) => (
              <SolutionCard
                key={s.id}
                sol={s}
                active={selected?.id === s.id}
                onSelect={() => setSelectedId(s.id)}
              />
            ))}
          </div>
        </div>

        {/* ===== Panel so sanh goi cua giai phap dang chon ===== */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {selected ? <ComparePanel sol={selected} /> : null}
          <ConsultCard />
        </div>
      </div>
    </div>
  )
}

function SolutionCard({
  sol,
  active,
  onSelect,
}: {
  sol: PricingSolution
  active: boolean
  onSelect: () => void
}) {
  const Icon = PILLAR_ICONS[sol.pillar ?? ''] ?? ShieldCheck
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-brand',
        active ? 'border-viettel-red ring-1 ring-viettel-red/30 shadow-brand' : 'border-border-soft',
      )}
    >
      {sol.popular && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-viettel-red/10 px-2 py-0.5 text-[11px] font-bold text-viettel-red">
          Phổ biến
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-viettel-red/10">
          {sol.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sol.logoUrl} alt={sol.title} className="max-h-8 max-w-full object-contain" loading="lazy" />
          ) : (
            <Icon className="h-5 w-5 text-viettel-red" aria-hidden />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-ink group-hover:text-viettel-red">
            {sol.shortName || sol.title}
          </h3>
          {sol.tagline && <p className="truncate text-xs text-ink-soft">{sol.tagline}</p>}
        </div>
      </div>

      {sol.shortDesc && (
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{sol.shortDesc}</p>
      )}

      {/* Cac goi gia */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {sol.tiers.slice(0, 3).map((t, i) => (
          <div
            key={i}
            className={cn(
              'rounded-lg border px-2 py-2 text-center',
              t.highlight ? 'border-viettel-red/40 bg-viettel-red/5' : 'border-border-soft',
            )}
          >
            <div className="truncate text-[11px] font-semibold text-ink-soft">{t.name}</div>
            <div className="mt-1 text-[13px] font-extrabold leading-tight text-viettel-red">
              {t.priceLabel}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <Link
          href={`/giai-phap/${sol.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm font-semibold text-viettel-red hover:underline"
        >
          Xem chi tiết <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          href={`/dat-lich?solution=${sol.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="ml-auto inline-flex items-center rounded-lg bg-viettel-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-viettel-red-dark"
        >
          Nhận tư vấn
        </Link>
      </div>
    </button>
  )
}

function ComparePanel({ sol }: { sol: PricingSolution }) {
  const tiers = sol.tiers.slice(0, 3)
  // Union cac dong tinh nang (theo thu tu xuat hien)
  const featureRows = useMemo(() => {
    const seen = new Set<string>()
    const rows: string[] = []
    for (const t of tiers) {
      for (const f of t.features) {
        if (!seen.has(f.text)) {
          seen.add(f.text)
          rows.push(f.text)
        }
      }
    }
    return rows
  }, [tiers])

  const has = (t: PricingTierData, text: string) => t.features.some((f) => f.text === text && f.included)

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
      <div className="border-b border-border-soft px-4 py-3.5">
        <h3 className="text-base font-extrabold text-ink">
          {sol.shortName || sol.title} <span className="font-semibold text-ink-soft">— các gói</span>
        </h3>
        <p className="text-xs text-ink-soft">So sánh tính năng các gói dịch vụ</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-ink-soft">Tính năng</th>
              {tiers.map((t, i) => (
                <th key={i} className="px-2 py-2.5 text-center">
                  <span className={cn('text-xs font-bold', t.highlight ? 'text-viettel-red' : 'text-ink')}>
                    {t.name}
                  </span>
                  {t.highlight && (
                    <span className="mx-auto mt-0.5 block w-fit rounded-full bg-viettel-red px-1.5 py-0.5 text-[9px] font-bold text-white">
                      Phổ biến
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((text, r) => (
              <tr key={r} className="border-t border-border-soft/70">
                <td className="px-3 py-2 text-[13px] text-ink">{text}</td>
                {tiers.map((t, i) => (
                  <td key={i} className="px-2 py-2 text-center">
                    {has(t, text) ? (
                      <Check className="mx-auto h-4 w-4 text-viettel-red" aria-label="Có" />
                    ) : (
                      <Minus className="mx-auto h-4 w-4 text-ink-soft/30" aria-label="Không" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Dong gia */}
            <tr className="border-t border-border-soft bg-surface-muted/40">
              <td className="px-3 py-2.5 text-[13px] font-bold text-ink">Giá</td>
              {tiers.map((t, i) => (
                <td key={i} className="px-2 py-2.5 text-center">
                  <span className={cn('text-[13px] font-extrabold', t.highlight ? 'text-viettel-red' : 'text-ink')}>
                    {t.priceLabel}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3">
        <Link
          href={`/dat-lich?solution=${sol.slug}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-viettel-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viettel-red-dark"
        >
          Nhận tư vấn {sol.shortName || sol.title}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

function ConsultCard() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border-soft bg-surface-muted/50 p-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
        <Headset className="h-7 w-7" aria-hidden strokeWidth={1.75} />
      </span>
      <h3 className="mt-3 text-base font-bold text-ink">Bạn cần giải pháp phù hợp hơn?</h3>
      <p className="mt-1.5 text-sm text-ink-soft">
        Đội ngũ chuyên gia KHDN Viettel HCM luôn sẵn sàng tư vấn giải pháp tối ưu cho doanh nghiệp.
      </p>
      <Link
        href="/dat-lich"
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-viettel-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-viettel-red-dark"
      >
        Nhận tư vấn miễn phí
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}
