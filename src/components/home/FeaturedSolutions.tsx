import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Cloud,
  FileSignature,
  FileText,
  Handshake,
  KeyRound,
  LayoutGrid,
  type LucideIcon,
  RadioTower,
  RefreshCw,
  Server,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/ui/primitives'
import { WaveDivider } from '@/components/home/WaveDivider'
import { PILLARS } from '@/lib/taxonomy'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'
import type { Solution } from '@/payload-types'

const pillarOf = (value?: string | null) => PILLARS.find((p) => p.value === value)

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

// Chon icon minh hoa theo dac trung giai phap, fallback ve icon tru cot.
function pickIcon(solution: Solution): LucideIcon {
  const key = `${solution.shortName ?? ''} ${solution.title}`.toLowerCase()
  if (key.includes('invoice') || key.includes('hóa đơn') || key.includes('hoa don')) return FileText
  if (key.includes('-ca') || key.includes('chữ ký') || key.includes('chu ky') || key.includes('mysign'))
    return KeyRound
  if (key.includes('bhxh') || key.includes('contract') || key.includes('hợp đồng')) return FileSignature
  if (key.includes('cloud') || key.includes('server') || key.includes('máy chủ') || key.includes('may chu'))
    return key.includes('server') ? Server : Cloud
  if (key.includes('office') || key.includes('crm') || key.includes('hrm') || key.includes('quản trị'))
    return LayoutGrid
  return PILLAR_ICONS[solution.pillar ?? ''] ?? ShieldCheck
}

function logoUrl(solution: Solution): string | undefined {
  const logo = solution.logo
  if (logo && typeof logo === 'object' && 'url' in logo) return logo.url ?? undefined
  return undefined
}

async function FeaturedCard({ solution }: { solution: Solution }) {
  const t = await getTranslations('taxonomy')
  const pillar = pillarOf(solution.pillar)
  const pillarLabel = pillar ? taxonomyLabel(t, 'pillars', pillar.value, PILLARS) : ''
  const url = logoUrl(solution)
  const Icon = pickIcon(solution)

  return (
    <Link
      href={`/giai-phap/${solution.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:z-10 hover:-translate-y-3 hover:scale-[1.06] hover:shadow-[0_36px_70px_-15px_rgba(120,0,20,0.6)] hover:ring-2 hover:ring-white"
    >
      {/* Vach accent do o canh tren */}
      <span
        className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-viettel-red transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />
      {/* Vang sang do nhe o goc - diem nhan khi hover */}
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-viettel-red opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-15"
        aria-hidden
      />

      <div className="mb-5 mt-1 flex items-center justify-between gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #ee0033 0%, #a30e28 100%)' }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={solution.title} className="h-9 w-9 object-contain" />
          ) : (
            <Icon className="h-7 w-7" aria-hidden strokeWidth={1.75} />
          )}
        </span>
        {pillarLabel && (
          <span className="inline-flex items-center rounded-full bg-viettel-red/10 px-2.5 py-1 text-xs font-semibold text-viettel-red">
            {pillarLabel}
          </span>
        )}
      </div>

      <h3 className="min-h-[3.5rem] text-xl font-bold leading-snug text-ink transition-colors group-hover:text-viettel-red">
        {solution.title}
      </h3>
      {solution.tagline && (
        <p className="mt-2 text-sm font-semibold text-viettel-red/90">{solution.tagline}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{solution.shortDesc}</p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-viettel-red">
        Xem chi tiết
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  )
}

export async function FeaturedSolutions({ solutions }: { solutions: Solution[] }) {
  // Hien thi gon 4 giai phap tren mot hang ngang (desktop).
  const items = solutions.slice(0, 4)

  return (
    <section
      className="relative overflow-hidden py-16 text-white md:py-24"
      style={{ background: 'linear-gradient(135deg, #c8132f 0%, #e11537 50%, #b3112b 100%)' }}
    >
      {/* Duong luon song trang o tren va duoi (khoi trang tran vao khoi do) */}
      <WaveDivider position="top" fill="var(--color-surface)" />
      <WaveDivider position="bottom" fill="var(--color-surface)" />

      {/* Hoa tiet chuyen doi so: luoi tech + cham + mang luoi node + vong song tin hieu */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="fs-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
          <pattern id="fs-dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" opacity="0.10" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fs-grid)" />
        <rect width="100%" height="100%" fill="url(#fs-dots)" />

        {/* Mang luoi node + duong noi (constellation/circuit) o phia tren */}
        <g stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.5" fill="none">
          <path d="M-20 70 L140 70 L185 115 L360 115 L410 65 L600 65" />
          <path d="M185 115 L240 175 L430 175" />
          <path d="M1040 50 L1180 130 L1340 130 L1400 80 L1560 80" />
          <path d="M1180 130 L1230 200 L1420 200" />
        </g>
        <g fill="#ffffff">
          <circle cx="140" cy="70" r="4" opacity="0.22" />
          <circle cx="360" cy="115" r="4" opacity="0.22" />
          <circle cx="430" cy="175" r="3.5" opacity="0.18" />
          <circle cx="1180" cy="130" r="4" opacity="0.22" />
          <circle cx="1400" cy="80" r="3.5" opacity="0.18" />
          <circle className="animate-pulse" cx="185" cy="115" r="5" opacity="0.3" />
          <circle className="animate-pulse" cx="1340" cy="130" r="5" opacity="0.3" />
          <circle className="animate-pulse" cx="240" cy="175" r="4" opacity="0.25" />
        </g>

        {/* Vong song tin hieu dong tam (radar) o goc tren phai */}
        <g fill="none" stroke="#ffffff" strokeOpacity="0.10" strokeWidth="1.5">
          <circle cx="1640" cy="120" r="60" />
          <circle cx="1640" cy="120" r="110" />
          <circle cx="1640" cy="120" r="170" />
          <circle cx="1640" cy="120" r="240" />
        </g>
      </svg>

      {/* Vang sang trang diu o cac goc */}
      <div
        className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ffffff, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7a0a1e, transparent 70%)' }}
        aria-hidden
      />

      <Container className="relative">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/85">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Giải pháp nổi bật
          </p>
          <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
            Được doanh nghiệp tin dùng
          </h2>
          <p className="mt-4 text-base text-white/85 md:text-lg">
            Các giải pháp chuyển đổi số thiết yếu giúp doanh nghiệp vận hành hiệu quả, tuân thủ quy
            định.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <FeaturedCard key={s.id} solution={s} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/giai-phap"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-viettel-red shadow-lg transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#c8132f]"
          >
            Xem tất cả giải pháp
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  )
}
