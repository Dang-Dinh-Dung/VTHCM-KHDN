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

export function EcosystemSection({ counts }: { counts: Record<string, number> }) {
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

        {/* Nen tang cot loi */}
        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-viettel-red/20 bg-viettel-red/5 px-4 py-2 text-sm font-semibold text-viettel-red">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Nền tảng cốt lõi · Tin cậy &amp; Bảo mật
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.value] ?? ShieldCheck
            return (
              <Link
                key={pillar.value}
                href={`/giai-phap?pillar=${pillar.value}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-viettel-red/40 hover:shadow-brand"
              >
                {/* vien do hien khi hover */}
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-viettel-red transition-transform duration-200 group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-viettel-red/10 text-viettel-red transition-colors duration-200 group-hover:bg-viettel-red group-hover:text-white">
                    <Icon className="h-7 w-7" aria-hidden strokeWidth={1.75} />
                  </span>
                  {counts[pillar.value] ? (
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink-soft">
                      {counts[pillar.value]} giải pháp
                    </span>
                  ) : null}
                </div>
                <h3 className="mb-1.5 text-lg font-bold text-ink transition-colors group-hover:text-viettel-red">
                  {pillar.label}
                </h3>
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {pillar.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-viettel-red">
                  Khám phá
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
