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

import { Container, Section, SectionHeading } from '@/components/ui/primitives'
import { PILLARS } from '@/lib/taxonomy'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'vien-thong': RadioTower,
  'chuyen-doi-so': RefreshCw,
  'data-center-an-ninh-mang': ShieldCheck,
  'quan-tri-doanh-nghiep': Building2,
  'logistics-van-tai-nang-luong': Truck,
  'san-pham-hop-tac': Handshake,
}

/** The tru cot: icon mau + ten + so giai phap + mo ta san pham chi tiet */
function PillarCard({ value, count }: { value: string; count?: number }) {
  const pillar = PILLARS.find((p) => p.value === value)
  if (!pillar) return null
  const Icon = PILLAR_ICONS[pillar.value] ?? ShieldCheck
  const color = pillar.color
  return (
    <Link
      href={`/giai-phap?pillar=${pillar.value}`}
      className="group relative overflow-hidden rounded-2xl border border-border-soft bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-brand"
    >
      {/* Thanh mau nhan dien ben trai */}
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: color }} aria-hidden />
      {/* Vang mau nhe goc tren phai */}
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
            <h3 className="truncate text-sm font-bold text-ink transition-colors group-hover:text-viettel-red">
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
        <ArrowRight
          className="mt-1 h-4 w-4 shrink-0 text-ink-soft/40 transition-all group-hover:translate-x-0.5 group-hover:text-viettel-red"
          aria-hidden
        />
      </div>
    </Link>
  )
}

export function EcosystemSection({ counts }: { counts: Record<string, number> }) {
  const totalSolutions = Object.values(counts).reduce((a, b) => a + (b || 0), 0)
  const left = PILLARS.slice(0, 3)
  const right = PILLARS.slice(3, 6)

  return (
    <Section className="relative overflow-hidden bg-surface">
      {/* Nen trang tri do nhe */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Hệ sinh thái sản phẩm"
          title="Giải pháp toàn diện theo 6 trụ cột"
          description="Đồng hành cùng doanh nghiệp trên mọi hành trình chuyển đổi số."
        />

        {/* So do the: loi trung tam + 3 the moi ben */}
        <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* Cot trai */}
          <div className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1 lg:flex lg:flex-col">
            {left.map((p) => (
              <PillarCard key={p.value} value={p.value} count={counts[p.value]} />
            ))}
          </div>

          {/* Loi trung tam */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              {/* Duong noi gach dut sang 2 ben (chi desktop) */}
              <span
                className="absolute right-full top-1/2 hidden h-px w-8 -translate-y-1/2 border-t border-dashed border-viettel-red/30 lg:block"
                aria-hidden
              />
              <span
                className="absolute left-full top-1/2 hidden h-px w-8 -translate-y-1/2 border-t border-dashed border-viettel-red/30 lg:block"
                aria-hidden
              />
              <div
                className="flex h-44 w-44 flex-col items-center justify-center rounded-full text-center text-white shadow-brand ring-8 ring-viettel-red/5"
                style={{
                  background:
                    'radial-gradient(circle at 30% 25%, #e11537 0%, #c8132f 45%, #a30e28 100%)',
                }}
              >
                <span className="text-2xl font-black leading-none">Viettel</span>
                <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/85">
                  Hệ sinh thái
                </span>
                <span className="mt-2 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                  {totalSolutions > 0 ? `${totalSolutions}+ giải pháp` : '6 trụ cột'}
                </span>
              </div>
            </div>
          </div>

          {/* Cot phai */}
          <div className="order-3 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-col">
            {right.map((p) => (
              <PillarCard key={p.value} value={p.value} count={counts[p.value]} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/giai-phap"
            className="inline-flex items-center gap-1.5 rounded-xl border border-viettel-red/30 px-5 py-2.5 text-sm font-semibold text-viettel-red transition-colors hover:bg-viettel-red/5"
          >
            Xem tất cả giải pháp
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
