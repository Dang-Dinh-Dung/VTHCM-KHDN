import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { PricingTable } from '@/components/solutions/PricingTable'
import { ButtonLink, Container, Section } from '@/components/ui/primitives'
import { getSolutions } from '@/lib/queries'
import { labelOf, PILLARS } from '@/lib/taxonomy'

export const metadata: Metadata = {
  title: 'Bảng giá dịch vụ',
  description:
    'Tham khảo bảng giá các gói giải pháp chuyển đổi số của Viettel cho doanh nghiệp. Liên hệ KHDN Viettel HCM để nhận báo giá chi tiết theo quy mô.',
}

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const res = await getSolutions({ limit: 100 })
  const withPricing = res.docs.filter((s) => (s.pricingTiers?.length ?? 0) > 0)

  return (
    <>
      <div className="border-b border-border-soft bg-surface-muted">
        <Container className="py-10">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Bảng giá</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Bảng giá dịch vụ</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Giá tham khảo theo từng gói. Liên hệ KHDN Viettel HCM để nhận báo giá tối ưu theo quy mô và nhu cầu cụ thể.
          </p>
        </Container>
      </div>

      <Section className="py-12">
        <Container>
          {withPricing.length === 0 ? (
            <p className="text-ink-soft">Hiện chưa có bảng giá công khai. Vui lòng liên hệ để nhận báo giá.</p>
          ) : (
            <div className="space-y-14">
              {withPricing.map((s) => (
                <div key={s.id} id={s.slug ?? undefined} className="scroll-mt-24">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-viettel-red">
                        {labelOf(PILLARS, s.pillar)}
                      </p>
                      <h2 className="text-2xl font-bold text-ink">{s.title}</h2>
                      {s.tagline && <p className="mt-1 text-ink-soft">{s.tagline}</p>}
                    </div>
                    <Link
                      href={`/giai-phap/${s.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-viettel-red hover:underline"
                    >
                      Chi tiết giải pháp <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                  <PricingTable tiers={s.pricingTiers} solutionSlug={s.slug ?? ''} note={s.pricingNote} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 rounded-3xl bg-ink px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-2xl font-extrabold md:text-3xl">Cần báo giá riêng cho doanh nghiệp?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Đội ngũ KHDN Viettel HCM sẽ tư vấn gói dịch vụ và mức giá tối ưu nhất theo nhu cầu thực tế của bạn.
            </p>
            <div className="mt-7">
              <ButtonLink href="/dat-lich" variant="primary" size="lg">
                Nhận báo giá miễn phí <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
