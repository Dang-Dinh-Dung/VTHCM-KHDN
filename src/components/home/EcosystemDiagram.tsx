'use client'

import Link from 'next/link'
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
    return (
      <button
        type="button"
        onClick={() => setOpen(active ? null : pillar.value)}
        aria-expanded={active}
        className={cn(
          'group relative w-full overflow-hidden rounded-2xl border bg-surface p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-brand',
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1f`, color }}
          >
            <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className={cn('truncate text-sm font-bold transition-colors', active ? 'text-viettel-red' : 'text-ink group-hover:text-viettel-red')}>
                {pillar.label}
              </h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: `${color}1f`, color }}
              >
                {count ? `${count} giải pháp` : 'Mới'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{pillar.description}</p>
          </div>
          <ChevronDown
            className={cn('mt-1 h-4 w-4 shrink-0 text-ink-soft/50 transition-transform duration-200', active && 'rotate-180 text-viettel-red')}
            aria-hidden
          />
        </div>
      </button>
    )
  }

  const openPillar = open ? PILLARS.find((p) => p.value === open) : null
  const openItems = open ? solutionsByPillar[open] ?? [] : []

  return (
    <>
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <div className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1 lg:flex lg:flex-col">
          {left.map((p) => (
            <PillarCard key={p.value} value={p.value} />
          ))}
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            <span className="absolute right-full top-1/2 hidden h-px w-8 -translate-y-1/2 border-t border-dashed border-viettel-red/30 lg:block" aria-hidden />
            <span className="absolute left-full top-1/2 hidden h-px w-8 -translate-y-1/2 border-t border-dashed border-viettel-red/30 lg:block" aria-hidden />
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
          </div>
        </div>

        <div className="order-3 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-col">
          {right.map((p) => (
            <PillarCard key={p.value} value={p.value} />
          ))}
        </div>
      </div>

      {/* Bang xo xuong: danh sach giai phap cua tru cot dang mo */}
      <div className={cn('grid transition-all duration-300 ease-out', open ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          {openPillar && (
            <div className="rounded-2xl border border-border-soft bg-surface-muted/60 p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-4 w-1.5 rounded-full" style={{ backgroundColor: openPillar.color }} aria-hidden />
                <h4 className="text-base font-bold text-ink">
                  Giải pháp {openPillar.label}
                </h4>
                <span className="text-sm text-ink-soft">({openItems.length})</span>
              </div>
              {openItems.length === 0 ? (
                <p className="text-sm text-ink-soft">Chưa có giải pháp trong trụ cột này.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {openItems.map((s) => (
                    <Link
                      key={s.id}
                      href={`/giai-phap/${s.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-border-soft bg-surface p-3 transition-all hover:-translate-y-0.5 hover:border-viettel-red/40 hover:shadow-sm"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted">
                        {s.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.logoUrl} alt={s.name} className="h-9 w-9 object-contain" loading="lazy" />
                        ) : (
                          <Layers className="h-5 w-5 text-ink-soft/50" aria-hidden />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-viettel-red">{s.name}</span>
                        {s.slogan && <span className="line-clamp-1 text-xs text-ink-soft">{s.slogan}</span>}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft/30 transition-all group-hover:translate-x-0.5 group-hover:text-viettel-red" aria-hidden />
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link href={`/giai-phap?pillar=${openPillar.value}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-viettel-red">
                  Xem chi tiết {openPillar.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
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
