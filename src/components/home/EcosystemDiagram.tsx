'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Handshake,
  Layers,
  type LucideIcon,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { cn } from '@/lib/cn'
import type { PillarSolutionItem } from '@/lib/queries'
import { PILLARS } from '@/lib/taxonomy'
import { Reveal } from '@/components/ui/Reveal'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

type Props = {
  counts: Record<string, number>
  solutionsByPillar: Record<string, PillarSolutionItem[]>
}

/** Mot the giai phap (dung chung cho ca ban inline mobile lan bang duoi desktop). */
function SolutionCard({ item, color }: { item: PillarSolutionItem; color: string }) {
  const cssVar = { ['--pc']: color } as CSSProperties
  return (
    <Link
      href={`/giai-phap/${item.slug}`}
      style={cssVar}
      className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl border border-border-soft bg-surface p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--pc)] hover:shadow-lg"
    >
      <span
        className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[color:var(--pc)] transition-transform duration-200 group-hover/item:scale-y-100"
        aria-hidden
      />
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted ring-1 ring-border-soft">
        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.name} className="h-8 w-8 object-contain" loading="lazy" />
        ) : (
          <Layers className="h-5 w-5 text-ink-soft/50" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink transition-colors group-hover/item:text-[color:var(--pc)]">
          {item.name}
        </span>
        {item.slogan && <span className="line-clamp-1 text-xs text-ink-soft">{item.slogan}</span>}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-soft transition-colors duration-200 group-hover/item:bg-[color:var(--pc)] group-hover/item:text-white">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  )
}

export function EcosystemDiagram({ counts, solutionsByPillar }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0)
  const left = PILLARS.slice(0, 3)
  const right = PILLARS.slice(3, 6)

  const PillarCard = ({ value }: { value: string }) => {
    const pillar = PILLARS.find((p) => p.value === value)
    if (!pillar) return null
    const Icon = PILLAR_ICONS[pillar.value] ?? ShieldCheck
    const color = pillar.color
    const active = open === pillar.value
    const count = counts[pillar.value]
    const items = solutionsByPillar[pillar.value] ?? []

    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(active ? null : pillar.value)}
          aria-expanded={active}
          className={cn(
            'group relative w-full overflow-hidden rounded-2xl border bg-surface p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-brand',
            active ? 'border-viettel-red shadow-brand ring-1 ring-viettel-red/30' : 'border-border-soft',
          )}
        >
          <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: color }} aria-hidden />
          <span
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12] blur-2xl transition-opacity duration-200 group-hover:opacity-25"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <div className="relative flex items-start gap-3 pl-1.5">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}1f`, color }}
            >
              <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn('text-base font-bold leading-snug transition-colors', active ? 'text-viettel-red' : 'text-ink group-hover:text-viettel-red')}>
                  {pillar.label}
                </h3>
                <span
                  className="mt-0.5 shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: `${color}1f`, color }}
                >
                  {count ? `${count} giải pháp` : 'Mới'}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{pillar.description}</p>
            </div>
            <ChevronDown
              className={cn('mt-1 h-5 w-5 shrink-0 text-ink-soft/50 transition-transform duration-200', active && 'rotate-180 text-viettel-red')}
              aria-hidden
            />
          </div>
        </button>

        {/* MOBILE (<md): bang giai phap bung ra ngay duoi tru cot nay */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-out md:hidden',
            active ? 'mt-2.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: `${color}30`, backgroundImage: `linear-gradient(180deg, ${color}12, transparent 40%)` }}
            >
              {items.length === 0 ? (
                <p className="px-1 py-2 text-sm text-ink-soft">Sắp có giải pháp trong trụ cột này.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map((s) => (
                    <SolutionCard key={s.id} item={s} color={color} />
                  ))}
                </div>
              )}
              <Link
                href={`/giai-phap?pillar=${pillar.value}`}
                style={{ color }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-1 text-sm font-semibold"
              >
                Xem tất cả giải pháp {pillar.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const openPillar = open ? PILLARS.find((p) => p.value === open) : null
  const openItems = open ? solutionsByPillar[open] ?? [] : []

  return (
    <>
      <div className="grid items-start gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <div className="order-2 flex flex-col gap-3 md:order-1">
          {left.map((p, i) => (
            <Reveal key={p.value} delay={i * 90}>
              <PillarCard value={p.value} />
            </Reveal>
          ))}
        </div>

        <div className="order-1 flex justify-center md:order-2 md:pt-2">
          <Reveal delay={140} className="relative">
            <div
              className="flex h-44 w-44 flex-col items-center justify-center rounded-full text-center text-white shadow-brand ring-8 ring-viettel-red/5"
              style={{ background: 'radial-gradient(circle at 30% 25%, #e11537 0%, #c8132f 45%, #a30e28 100%)' }}
            >
              <span className="text-2xl font-black leading-none">Viettel</span>
              <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/85">Hệ sinh thái</span>
              <span className="mt-2 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                {total > 0 ? `${total}+ giải pháp` : '6 trụ cột'}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="order-3 flex flex-col gap-3">
          {right.map((p, i) => (
            <Reveal key={p.value} delay={i * 90 + 60}>
              <PillarCard value={p.value} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* DESKTOP/TABLET (>=md): bang giai phap chi tiet o DUOI CUNG */}
      <div
        className={cn(
          'hidden transition-all duration-300 ease-out md:grid',
          open ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          {openPillar &&
            (() => {
              const color = openPillar.color
              const OpenIcon = PILLAR_ICONS[openPillar.value] ?? ShieldCheck
              return (
                <div
                  className="overflow-hidden rounded-3xl border bg-surface shadow-lg shadow-ink/5"
                  style={{
                    borderColor: `${color}30`,
                    backgroundImage: `linear-gradient(180deg, ${color}14, transparent 32%)`,
                  }}
                >
                  {/* Header tru cot */}
                  <div className="flex items-center gap-3 px-5 pt-5">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      <OpenIcon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-extrabold text-ink">Giải pháp {openPillar.label}</h4>
                      <p className="text-xs text-ink-soft">{openItems.length} sản phẩm trong hệ sinh thái Viettel</p>
                    </div>
                    <Link
                      href={`/giai-phap?pillar=${openPillar.value}`}
                      style={{ backgroundColor: color }}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                    >
                      Xem chi tiết
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>

                  <div className="p-5">
                    {openItems.length === 0 ? (
                      <p className="text-sm text-ink-soft">Sắp có giải pháp trong trụ cột này.</p>
                    ) : (
                      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {openItems.map((s) => (
                          <SolutionCard key={s.id} item={s} color={color} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/giai-phap"
          className="inline-flex items-center gap-1.5 rounded-xl border border-viettel-red/30 px-5 py-2.5 text-sm font-semibold text-viettel-red transition-colors hover:bg-viettel-red/5"
        >
          Xem tất cả giải pháp
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </>
  )
}
