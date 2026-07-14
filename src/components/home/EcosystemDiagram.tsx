'use client'

import { Link } from '@/i18n/navigation'
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
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'
import type { PillarSolutionItem } from '@/lib/queries'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'
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

const TOP_PILLAR = 'vien-thong'
const LEFT_PILLARS = ['chuyen-doi-so', 'data-center-an-ninh-mang']
const RIGHT_PILLARS = ['quan-tri-doanh-nghiep', 'logistics-van-tai-nang-luong']
const BOTTOM_PILLAR = 'san-pham-hop-tac'

type Props = {
  counts: Record<string, number>
  solutionsByPillar: Record<string, PillarSolutionItem[]>
}

/** The giai phap dang dung (bang chi tiet duoi cung - desktop/tablet). */
function SolutionTile({ item, color }: { item: PillarSolutionItem; color: string }) {
  const cssVar = { ['--pc']: color } as CSSProperties
  return (
    <Link
      href={`/giai-phap/${item.slug}`}
      style={cssVar}
      className="group flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--pc)] hover:shadow-[0_18px_40px_-16px_var(--pc)]"
    >
      <span className="mb-2.5 flex h-11 items-center">
        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.name} className="max-h-11 max-w-full object-contain" loading="lazy" />
        ) : (
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            <Layers className="h-5 w-5" aria-hidden />
          </span>
        )}
      </span>
      <span className="block truncate text-sm font-bold text-ink transition-colors group-hover:text-[color:var(--pc)]">
        {item.name}
      </span>
      {item.slogan && (
        <span className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-soft">{item.slogan}</span>
      )}
      <span
        className="mt-3 inline-flex items-center gap-1 self-start rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm transition-transform group-hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      >
        Chi tiết
        <ArrowRight className="h-3 w-3" aria-hidden />
      </span>
    </Link>
  )
}

/** The giai phap hang ngang (bung duoi tru cot - mobile). */
function SolutionRow({ item, color }: { item: PillarSolutionItem; color: string }) {
  const cssVar = { ['--pc']: color } as CSSProperties
  return (
    <Link
      href={`/giai-phap/${item.slug}`}
      style={cssVar}
      className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl border border-border-soft bg-surface p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--pc)] hover:shadow-lg"
    >
      <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[color:var(--pc)] transition-transform duration-200 group-hover/item:scale-y-100" aria-hidden />
      {item.logoUrl ? (
        <span className="flex h-11 w-14 shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.logoUrl} alt={item.name} className="max-h-11 max-w-full object-contain" loading="lazy" />
        </span>
      ) : (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
        >
          <Layers className="h-5 w-5" aria-hidden />
        </span>
      )}
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
  const t = useTranslations('taxonomy')
  const firstWithItems =
    PILLARS.find((p) => (solutionsByPillar[p.value] ?? []).length > 0)?.value ?? null
  const [open, setOpen] = useState<string | null>(firstWithItems)
  const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0)

  /** The tru cot: glow theo mau, icon gradient (phong cach tech tren nen trang). */
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
        style={{
          borderColor: active ? color : `${color}55`,
          backgroundImage: `linear-gradient(140deg, ${color}14, transparent 55%)`,
          boxShadow: active ? `0 18px 44px -16px ${color}` : `0 12px 32px -18px ${color}`,
        }}
        className="group relative w-full rounded-2xl border bg-surface p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 md:flex md:h-[6.5rem] md:items-center"
      >
        <div className="flex w-full items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(140deg, ${color}, ${color} 55%, rgba(0,0,0,0.28) 150%)`, boxShadow: `0 6px 16px -6px ${color}` }}
          >
            <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="line-clamp-2 text-[15px] font-bold leading-snug text-ink transition-colors"
                style={active ? { color } : undefined}
              >
                {taxonomyLabel(t, 'pillars', pillar.value, PILLARS)}
              </h3>
              <span
                className="mt-0.5 shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${color}1f`, color }}
              >
                {count ? `${count} giải pháp` : 'Mới'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{pillar.description}</p>
          </div>
          <ChevronDown
            className={cn('mt-0.5 hidden h-5 w-5 shrink-0 text-ink-soft/40 transition-transform duration-200 md:block', active && 'rotate-180')}
            style={active ? { color } : undefined}
            aria-hidden
          />
        </div>
      </button>
    )
  }

  /** Khoi cau nang luong do phat sang o tam. */
  const CenterCore = () => (
    <div className="relative flex items-center justify-center">
      {/* Quang sang do */}
      <span className="absolute -inset-5 rounded-full bg-viettel-red/20 blur-2xl" aria-hidden />
      {/* Vong xoay */}
      <span className="absolute -inset-3.5 rounded-full border border-viettel-red/25 [animation:spin_22s_linear_infinite]" aria-hidden />
      <span className="absolute -inset-1.5 rounded-full border-2 border-dashed border-viettel-red/30 [animation:spin_16s_linear_infinite_reverse]" aria-hidden />
      <div
        className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full text-center text-white shadow-[0_16px_44px_-12px_rgba(200,19,47,0.6)] md:h-36 md:w-36"
        style={{ background: 'radial-gradient(circle at 32% 26%, #ff4d6d 0%, #e11537 40%, #a30e28 100%)' }}
      >
        <span className="absolute left-5 top-5 h-8 w-8 rounded-full bg-white/25 blur-md" aria-hidden />
        <span className="relative text-xl font-black leading-none drop-shadow md:text-2xl">Viettel</span>
        <span className="relative mt-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm">
          {total > 0 ? `${total}+ giải pháp` : '6 trụ cột'}
        </span>
      </div>
    </div>
  )

  /** Panel bung duoi tru cot (mobile). */
  const MobileInlinePanel = ({ value }: { value: string }) => {
    const pillar = PILLARS.find((p) => p.value === value)
    if (!pillar) return null
    const color = pillar.color
    const active = open === pillar.value
    const items = solutionsByPillar[pillar.value] ?? []
    return (
      <div className={cn('grid transition-all duration-300 ease-out', active ? 'mt-2.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          <div className="rounded-2xl border p-3" style={{ borderColor: `${color}30`, backgroundImage: `linear-gradient(180deg, ${color}10, transparent 40%)` }}>
            {items.length === 0 ? (
              <p className="px-1 py-2 text-sm text-ink-soft">Sắp có giải pháp trong trụ cột này.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((s) => (
                  <SolutionRow key={s.id} item={s} color={color} />
                ))}
              </div>
            )}
            <Link href={`/giai-phap?pillar=${pillar.value}`} style={{ color }} className="mt-2.5 inline-flex items-center gap-1.5 px-1 text-sm font-semibold">
              Xem tất cả giải pháp {taxonomyLabel(t, 'pillars', pillar.value, PILLARS)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const openPillar = open ? PILLARS.find((p) => p.value === open) : null
  const openColor = openPillar ? openPillar.color : '#ee0033'
  const openItems = open ? solutionsByPillar[open] ?? [] : []
  const OpenIcon = openPillar ? PILLAR_ICONS[openPillar.value] ?? ShieldCheck : ShieldCheck

  return (
    <>
      {/* ===== MOBILE (<md) ===== */}
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

      {/* ===== DESKTOP/TABLET (>=md): 6 the bao quanh khoi cau + elip quy dao ===== */}
      <div className="relative hidden md:block">
        <div className="relative grid grid-cols-3 items-center gap-x-5 lg:gap-x-8">
          {/* Elip quy dao chay qua 6 tru cot - tam trung voi khoi cau (giua luoi) */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="eco-orbit" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ee0033" />
                <stop offset="0.5" stopColor="#d926a9" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="34" ry="40" fill="none" stroke="url(#eco-orbit)" strokeOpacity="0.4" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <ellipse cx="50" cy="50" rx="34" ry="40" fill="none" stroke="url(#eco-orbit)" strokeOpacity="0.16" strokeWidth="6" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="flex flex-col gap-4">
            {LEFT_PILLARS.map((v, i) => (
              <Reveal key={v} delay={i * 90 + 60}>
                <PillarCard value={v} />
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
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

          <div className="flex flex-col gap-4">
            {RIGHT_PILLARS.map((v, i) => (
              <Reveal key={v} delay={i * 90 + 120}>
                <PillarCard value={v} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bang giai phap chi tiet cua tru cot dang mo */}
        <div className={cn('grid transition-all duration-300 ease-out', open ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
          <div className="overflow-hidden">
            {openPillar && (
              <div>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                      style={{ background: `linear-gradient(140deg, ${openColor}, ${openColor}bb)`, boxShadow: `0 8px 20px -6px ${openColor}` }}
                    >
                      <OpenIcon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                    </span>
                    <div>
                      <h4 className="text-lg font-extrabold text-ink">
                        Giải pháp {taxonomyLabel(t, 'pillars', openPillar.value, PILLARS)}
                      </h4>
                      <p className="text-xs text-ink-soft">
                        {openItems.length} sản phẩm trong hệ sinh thái{' '}
                        <span className="font-bold text-viettel-red">Viettel</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/giai-phap?pillar=${openPillar.value}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${openColor}, ${openColor}cc)` }}
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
                      <SolutionTile key={s.id} item={s} color={openColor} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nut kham pha - gradient do -> tim */}
      <div className="mt-7 flex justify-center">
        <Link
          href="/giai-phap"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg shadow-viettel-red/30 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #ee0033 0%, #d926a9 55%, #7c3aed 100%)' }}
        >
          Khám phá tất cả giải pháp
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </>
  )
}
