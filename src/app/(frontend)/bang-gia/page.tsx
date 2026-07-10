import Link from 'next/link'
import { Expand, Headphones, Rocket, ShieldCheck } from 'lucide-react'

import { PricingExplorer, type PricingSolution } from '@/components/solutions/PricingExplorer'
import { Container } from '@/components/ui/primitives'
import { getSolutions } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'
import type { Media, Solution } from '@/payload-types'

export const generateMetadata = () =>
  buildPageMetadata({
    key: 'bang-gia',
    path: '/bang-gia',
    title: 'Bảng giá dịch vụ',
    description:
      'Tham khảo bảng giá các gói giải pháp chuyển đổi số của Viettel cho doanh nghiệp. Liên hệ KHDN Viettel HCM để nhận báo giá chi tiết theo quy mô.',
  })

export const dynamic = 'force-dynamic'

const num = (v: string) => Number(String(v).replace(/[^\d]/g, '')) || 0

function logoUrl(ref: number | Media | null | undefined): string | undefined {
  return ref && typeof ref === 'object' && 'url' in ref ? (ref.url ?? undefined) : undefined
}

function tierLabel(t: NonNullable<Solution['pricingTiers']>[number]): string {
  if (t.isContactForPrice) return 'Liên hệ'
  if (t.priceLabel) return t.priceLabel
  if (t.price != null) return `${t.price.toLocaleString('vi-VN')}${t.priceSuffix ?? 'đ'}`
  return 'Liên hệ'
}

function toPricingSolution(s: Solution): PricingSolution {
  const tiers = (s.pricingTiers ?? []).map((t) => ({
    name: t.name,
    badge: t.badge ?? undefined,
    highlight: t.highlight ?? false,
    priceLabel: tierLabel(t),
    features: (t.features ?? []).map((f) => ({ text: f.text, included: f.included ?? true })),
  }))
  const prices = (s.pricingTiers ?? [])
    .map((t) => (t.isContactForPrice ? Infinity : (t.price ?? num(t.priceLabel ?? ''))))
    .filter((n) => n > 0)
  return {
    id: String(s.id),
    slug: s.slug ?? '',
    title: s.title,
    shortName: s.shortName ?? undefined,
    tagline: s.tagline ?? undefined,
    shortDesc: s.shortDesc ?? undefined,
    pillar: s.pillar ?? undefined,
    logoUrl: logoUrl(s.logo),
    popular: Boolean(s.isFeatured) || tiers.some((t) => t.highlight),
    minPrice: prices.length ? Math.min(...prices) : Number.MAX_SAFE_INTEGER,
    tiers,
  }
}

const TRUST = [
  { icon: Rocket, title: 'Triển khai nhanh chóng', desc: 'Rút ngắn tới 70% thời gian triển khai.' },
  { icon: ShieldCheck, title: 'Bảo mật đạt chuẩn', desc: 'An toàn thông tin theo tiêu chuẩn ISO/IEC 27001.' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ.' },
  { icon: Expand, title: 'Linh hoạt mở rộng', desc: 'Dễ dàng mở rộng theo quy mô và nhu cầu.' },
]

export default async function PricingPage() {
  const res = await getSolutions({ limit: 100 })
  const sols = res.docs
    .filter((s) => (s.pricingTiers?.length ?? 0) > 0 && s.slug)
    .map(toPricingSolution)

  return (
    <>
      {/* Hero */}
      <div className="relative -mt-[60px] overflow-hidden bg-surface-muted pt-[60px] md:-mt-[72px] md:pt-[72px]">
        <div
          className="pointer-events-none absolute right-0 top-0 h-80 w-[36rem] opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
          aria-hidden
        />
        <Container className="relative py-12 text-center md:py-14">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Bảng giá</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-5xl">
            Bảng báo giá <span className="text-viettel-red">giải pháp số</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft md:text-lg">
            Khám phá các giải pháp công nghệ phù hợp với nhu cầu doanh nghiệp của bạn.
          </p>
        </Container>
      </div>

      <Container className="py-10 md:py-12">
        {sols.length === 0 ? (
          <p className="text-ink-soft">
            Hiện chưa có bảng giá công khai. Vui lòng{' '}
            <Link href="/dat-lich" className="font-semibold text-viettel-red hover:underline">
              liên hệ để nhận báo giá
            </Link>
            .
          </p>
        ) : (
          <PricingExplorer sols={sols} />
        )}
      </Container>

      {/* Dai tien ich */}
      <div className="border-t border-border-soft bg-surface-muted/50">
        <Container className="py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
                  <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  )
}
