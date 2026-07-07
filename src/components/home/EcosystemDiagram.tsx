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
import { Reveal } from '@/components/ui/Reveal'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

// Bo tri quanh khoi cau (theo thiet ke tham khao): tren - trai x2 - phai x2 - duoi
const TOP_PILLAR = 'vien-thong'
const LEFT_PILLARS = ['chuyen-doi-so', 'data-center-an-ninh-mang']
const RIGHT_PILLARS = ['quan-tri-doanh-nghiep', 'logistics-van-tai-nang-luong']
const BOTTOM_PILLAR = 'san-pham-hop-tac'

type Props = {
  counts: Record<string, number>
  solutionsByPillar: Record<string, PillarSolutionItem[]>
}

/** The giai phap dang dung (bang chi tiet duoi cung - desktop/tablet). */
function SolutionTile({ item }: { item: PillarSolutionItem }) {
  return (
    <Link
      href={`/giai-phap/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-viettel-red/40 hover:shadow-lg"
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-viettel-red/10 text-viettel-red ring-1 ring-viettel-red/10">
        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.name} className="h-7 w-7 object-contain" loading="lazy" />
        ) : (
          <Layers className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="mt-2.5 block truncate text-sm font-bold text-ink transition-colors group-hover:text-viettel-red">
        {item.name}
      </span>
      {item.slogan && (
        <span className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-soft">{item.slogan}</span>
      )}
      <span className="mt-3 inline-flex items-center gap-1 self-start rounded-full bg-viettel-red px-3 py-1 text-xs font-semibold text-white transition-colors group-hover:bg-viettel-red-dark">
        Chi tiết
        <ArrowRight className="h-3 w-3" aria-hidden />
      </span>
    </Link>
  )
}

/** The giai phap dang hang ngang (bung duoi tru cot - mobile). */
function SolutionRow({ item }: { item: PillarSolutionItem }) {
  return (
    <Link
      href={`/giai-phap/${item.slug}`}
      className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl border border-border-soft bg-surface p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-viettel-red/50 hover:shadow-lg"
    >
      <span
        className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-viettel-red transition-transform duration-200 group-hover/item:scale-y-100"
        aria-hidden
      />
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-viettel-red/10 ring-1 ring-viettel-red/10">
        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.name} className="h-8 w-8 object-contain" loading="lazy" />
        ) : (
          <Layers className="h-5 w-5 text-viettel-red" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink transition-colors group-hover/item:text-viettel-red">
          {item.name}
        </span>
        {item.slogan && <span className="line-clamp-1 text-xs text-ink-soft">{item.slogan}</span>}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-soft transition-colors duration-200 group-hover/item:bg-viettel-red group-hover/item:text-white">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  )
}

export function EcosystemDiagram({ counts, solutionsByPillar }: Props) {
  // Mac dinh mo tru cot dau tien co giai phap (desktop hien bang duoi nhu thiet ke)
  const firstWithItems =
    PILLARS.find((p) => (solutionsByPillar[p.value] ?? []).length > 0)?.value ?? null
  const [open, setOpen] = useState<string | null>(firstWithItems)
  const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0)

  /** The tru cot pill trang, icon tron do (theo thiet ke tham khao). */
  const PillarCard = ({ value }: { value: string }) => {
    const pillar = PILLARS.find((p) => p.value === value)
    if (!pillar) return null
    const Icon = PILLAR_ICONS[pillar.value] ?? ShieldCheck
    const active = open === pillar.value
    const count = counts[pillar.value]

    return (
      <button
        type="button"
        onClick={() => setOpen(active ? null : pillar.value)}
        aria-expanded={active}
        className={cn(
          'group relative w-full rounded-[1.75rem] border bg-surface p-4 text-left shadow-[0_10px_30px_-12px_rgba(200,19,47,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-brand md:p-5',
          active ? 'border-viettel-red ring-1 ring-viettel-red/30' : 'border-border-soft',
        )}
      >
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-md shadow-viettel-red/30"
            style={{ background: 'linear-gradient(135deg, #e11537 0%, #a30e28 100%)' }}
          >
            <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  'text-base font-bold leading-snug transition-colors',
                  active ? 'text-viettel-red' : 'text-ink group-hover:text-viettel-red',
                )}
              >
                {pillar.label}
              </h3>
              <span className="mt-0.5 shrink-0 whitespace-nowrap rounded-full bg-viettel-red px-2.5 py-0.5 text-[11px] font-bold text-white">
                {count ? `${count} giải pháp` : 'Mới'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
              {pillar.description}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'mt-1 hidden h-5 w-5 shrink-0 text-ink-soft/40 transition-transform duration-200 md:block',
              active && 'rotate-180 text-viettel-red',
            )}
            aria-hidden
          />
        </div>
      </button>
    )
  }

  /** Khoi cau do trung tam. */
  const CenterCore = () => (
    <div className="relative">
      {/* Vong cham dut bao quanh */}
      <span className="absolute -inset-3 rounded-full border-2 border-dashed border-viettel-red/25" aria-hidden />
      <div
        className="flex h-44 w-44 flex-col items-center justify-center rounded-full text-center text-white shadow-[0_20px_50px_-12px_rgba(200,19,47,0.55)] ring-8 ring-viettel-red/5 md:h-48 md:w-48"
        style={{ background: 'radial-gradient(circle at 30% 25%, #e11537 0%, #c8132f 45%, #a30e28 100%)' }}
      >
        <span className="text-3xl font-black leading-none">Viettel</span>
        <span className="mt-2.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          {total > 0 ? `${total}+ giải pháp` : '6 trụ cột'}
        </span>
      </div>
    </div>
  )

  /** Bang giai phap bung ra ngay duoi tru cot (mobile). */
  const MobileInlinePanel = ({ value }: { value: string }) => {
    const pillar = PILLARS.find((p) => p.value === value)
    if (!pillar) return null
    const active = open === pillar.value
    const items = solutionsByPillar[pillar.value] ?? []
    return (
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          active ? 'mt-2.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-viettel-red/20 bg-viettel-red/[0.04] p-3">
            {items.length === 0 ? (
              <p className="px-1 py-2 text-sm text-ink-soft">Sắp có giải pháp trong trụ cột này.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((s) => (
                  <SolutionRow key={s.id} item={s} />
                ))}
              </div>
            )}
            <Link
              href={`/giai-phap?pillar=${pillar.value}`}
              className="mt-2.5 inline-flex items-center gap-1.5 px-1 text-sm font-semibold text-viettel-red"
            >
              Xem tất cả giải pháp {pillar.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const openPillar = open ? PILLARS.find((p) => p.value === open) : null
  const openItems = open ? solutionsByPillar[open] ?? [] : []
  const OpenIcon = openPillar ? PILLAR_ICONS[openPillar.value] ?? ShieldCheck : ShieldCheck

  return (
    <>
      {/* ===== MOBILE (<md): the xep doc, giai phap bung ngay duoi tru cot ===== */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="mb-1 flex justify-center">
          <CenterCore />
        </div>
        {PILLARS.map((p) => (
          <div key={p.value}>
            <PillarCard value={p.value} />
            <MobileInlinePanel value={p.value} />
          </div>
        ))}
      </div>

      {/* ===== DESKTOP/TABLET (>=md): 6 the bao quanh khoi cau + duong noi ===== */}
      <div className="relative hidden md:block">
        {/* Duong noi toa ra tu tam (trang tri) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <g stroke="#ee0033" strokeOpacity="0.22" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
            <line x1="50" y1="50" x2="50" y2="10" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="50" y2="90" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="17" y2="27" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="17" y2="73" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="83" y2="27" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2="83" y2="73" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 lg:gap-x-12">
          {/* Cot trai: 2 tru cot */}
          <div className="flex flex-col gap-14">
            {LEFT_PILLARS.map((v, i) => (
              <Reveal key={v} delay={i * 90 + 60}>
                <PillarCard value={v} />
              </Reveal>
            ))}
          </div>

          {/* Cot giua: tru cot tren - khoi cau - tru cot duoi */}
          <div className="flex max-w-md flex-col items-center gap-7">
            <Reveal delay={0} className="w-full">
              <PillarCard value={TOP_PILLAR} />
            </Reveal>
            <Reveal delay={140}>
              <CenterCore />
            </Reveal>
            <Reveal delay={200} className="w-full">
              <PillarCard value={BOTTOM_PILLAR} />
            </Reveal>
          </div>

          {/* Cot phai: 2 tru cot */}
          <div className="flex flex-col gap-14">
            {RIGHT_PILLARS.map((v, i) => (
              <Reveal key={v} delay={i * 90 + 120}>
                <PillarCard value={v} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bang giai phap chi tiet cua tru cot dang mo */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-out',
            open ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            {openPillar && (
              <div>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md shadow-viettel-red/30"
                      style={{ background: 'linear-gradient(135deg, #e11537 0%, #a30e28 100%)' }}
                    >
                      <OpenIcon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                    </span>
                    <div>
                      <h4 className="text-lg font-extrabold text-ink">
                        Giải pháp {openPillar.label}
                      </h4>
                      <p className="text-xs text-ink-soft">
                        {openItems.length} sản phẩm trong hệ sinh thái{' '}
                        <span className="font-bold text-viettel-red">Viettel</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/giai-phap?pillar=${openPillar.value}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-viettel-red px-4 py-2 text-sm font-semibold text-white shadow-md shadow-viettel-red/30 transition-transform hover:-translate-y-0.5"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>

                {openItems.length === 0 ? (
                  <p className="text-sm text-ink-soft">Sắp có giải pháp trong trụ cột này.</p>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
                    {openItems.map((s) => (
                      <SolutionTile key={s.id} item={s} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nut kham pha tat ca */}
      <div className="mt-7 flex justify-center">
        <Link
          href="/giai-phap"
          className="inline-flex items-center gap-2 rounded-full bg-viettel-red px-7 py-3 text-sm font-bold text-white shadow-lg shadow-viettel-red/30 transition-all hover:-translate-y-0.5 hover:bg-viettel-red-dark"
        >
          Khám phá tất cả giải pháp
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </>
  )
}
