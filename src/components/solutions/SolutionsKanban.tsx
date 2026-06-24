import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Handshake,
  type LucideIcon,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { PILLARS } from '@/lib/taxonomy'
import type { Solution } from '@/payload-types'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

function logoUrl(solution: Solution): string | undefined {
  const logo = solution.logo
  if (logo && typeof logo === 'object' && 'url' in logo) return logo.url ?? undefined
  return undefined
}

/** Lam dam mot mau hex theo ti le (0-1) de tao gradient cho header cot. */
function shade(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  const r = Math.round(((num >> 16) & 255) * (1 - amount))
  const g = Math.round(((num >> 8) & 255) * (1 - amount))
  const b = Math.round((num & 255) * (1 - amount))
  return `rgb(${r}, ${g}, ${b})`
}

function KanbanCard({ solution, color }: { solution: Solution; color: string }) {
  const url = logoUrl(solution)
  const Icon = PILLAR_ICONS[solution.pillar ?? ''] ?? ShieldCheck
  return (
    <Link
      href={`/giai-phap/${solution.slug}`}
      className="group block rounded-xl border border-border-soft border-t-[3px] bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-brand"
      style={{ borderTopColor: color }}
    >
      <div className="flex items-start gap-3">
        {url ? (
          // Logo that cua giai phap (upload trong admin) - tile trang, logo lap day
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-soft bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Logo ${solution.title}`}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </span>
        ) : (
          // Chua co logo -> icon tru cot lam placeholder
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-7 w-7" aria-hidden strokeWidth={1.75} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-ink group-hover:text-viettel-red">
            {solution.title}
          </h3>
          {solution.tagline && (
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-ink-soft">{solution.tagline}</p>
          )}
        </div>
      </div>
      {solution.shortDesc && (
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">{solution.shortDesc}</p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-viettel-red">
        Xem chi tiết
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  )
}

export function SolutionsKanban({ solutions }: { solutions: Solution[] }) {
  // Gom giai phap theo trung tru cot, giu thu tu PILLARS; bo cot rong.
  const columns = PILLARS.map((pillar) => ({
    pillar,
    items: solutions.filter((s) => s.pillar === pillar.value),
  })).filter((c) => c.items.length > 0)

  if (columns.length === 0) return null

  return (
    <div className="flex flex-col gap-6" role="list" aria-label="Giải pháp theo trụ cột">
      {columns.map(({ pillar, items }) => {
        const Icon = PILLAR_ICONS[pillar.value] ?? ShieldCheck
        return (
          <section
            key={pillar.value}
            role="listitem"
            className="overflow-hidden rounded-2xl border border-border-soft shadow-sm"
            style={{ backgroundColor: `${pillar.color}0a` }}
          >
            {/* Header cot: pill gradient + badge dem tron (phong cach Kanban hien dai) */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 text-white"
              style={{ background: `linear-gradient(135deg, ${pillar.color}, ${shade(pillar.color, 0.28)})` }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-5 w-5" aria-hidden strokeWidth={2} />
                </span>
                <h2 className="truncate text-base font-extrabold">{pillar.label}</h2>
              </div>
              <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full bg-white/25 px-2 text-sm font-bold tabular-nums">
                {items.length}
              </span>
            </div>

            {/* The giai phap chay ngang trong dai, tu xuong dong */}
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((s) => (
                <KanbanCard key={s.id} solution={s} color={pillar.color} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
