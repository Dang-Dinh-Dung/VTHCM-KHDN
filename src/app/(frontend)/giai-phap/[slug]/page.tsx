import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Plus } from 'lucide-react'

import { RichText } from '@/components/RichText'
import { PricingTable } from '@/components/solutions/PricingTable'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { Badge, ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives'
import { getSolutionBySlug } from '@/lib/queries'
import { labelOf, PILLARS, PRODUCT_GROUPS } from '@/lib/taxonomy'
import type { Media, Solution } from '@/payload-types'

const pillarOf = (value?: string | null) => PILLARS.find((p) => p.value === value)

/** URL anh banner (heroImage) upload trong admin, uu tien ban lon. */
function heroImageUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    return sizes?.og?.url ?? sizes?.card?.url ?? ref.url ?? undefined
  }
  return undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const solution = await getSolutionBySlug(slug)
  if (!solution) return { title: 'Không tìm thấy giải pháp' }
  const seo = solution.seo
  return {
    title: seo?.metaTitle || solution.title,
    description: seo?.metaDescription || solution.shortDesc,
    openGraph: { title: seo?.metaTitle || solution.title, description: seo?.metaDescription || solution.shortDesc },
  }
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const solution = await getSolutionBySlug(slug)
  if (!solution) notFound()

  const pillar = pillarOf(solution.pillar)
  const related = (solution.relatedSolutions ?? []).filter(
    (r): r is Solution => typeof r === 'object' && r !== null,
  )
  const hasPricing = (solution.pricingTiers?.length ?? 0) > 0
  const faqs = solution.faqs ?? []
  const heroUrl = heroImageUrl(solution.heroImage)

  return (
    <>
      {/* Hero - nen anh upload trong admin (heroImage), fallback nen do */}
      <div
        className="relative -mt-[60px] overflow-hidden border-b border-border-soft text-white md:-mt-[72px]"
        style={{ backgroundColor: '#58061a' }}
      >
        {heroUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
          </>
        )}
        <Container className="relative pb-12 pt-24 md:pt-28">
          <div style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)' }}>
          <nav className="mb-4 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/giai-phap" className="hover:text-white">Giải pháp</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{solution.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {pillar && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: pillar.color }}
              >
                {pillar.label}
              </span>
            )}
            {solution.productGroup && (
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/90">
                {labelOf(PRODUCT_GROUPS, solution.productGroup)}
              </span>
            )}
          </div>

          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-4xl">{solution.title}</h1>
          {solution.tagline && <p className="mt-2 text-lg text-viettel-red-light">{solution.tagline}</p>}
          <p className="mt-4 max-w-2xl text-white/80">{solution.shortDesc}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={`/dat-lich?solution=${solution.slug}`} variant="primary" size="lg">
              Đặt lịch tư vấn / demo
            </ButtonLink>
            {hasPricing && (
              <ButtonLink
                href="#bang-gia"
                size="lg"
                className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Xem bảng giá
              </ButtonLink>
            )}
          </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Mo ta chi tiet */}
            {solution.body && (
              <div className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-ink">Giới thiệu</h2>
                <RichText data={solution.body} />
              </div>
            )}

            {/* Tinh nang */}
            {solution.features && solution.features.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-ink">Tính năng & lợi ích nổi bật</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {solution.features.map((f, i) => (
                    <div key={i} className="rounded-xl border border-border-soft bg-surface p-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <div>
                          <h3 className="font-semibold text-ink">{f.title}</h3>
                          {f.description && <p className="mt-1 text-sm text-ink-soft">{f.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-ink">Câu hỏi thường gặp</h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-border-soft bg-surface p-4 [&_summary]:cursor-pointer"
                    >
                      <summary className="flex items-center justify-between gap-3 font-semibold text-ink">
                        {faq.question}
                        <Plus
                          className="h-5 w-5 shrink-0 text-viettel-red transition-transform group-open:rotate-45"
                          aria-hidden
                        />
                      </summary>
                      <p className="mt-2 text-sm text-ink-soft">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border-soft bg-surface-muted p-6">
              <h3 className="text-lg font-bold text-ink">Quan tâm đến {solution.shortName ?? solution.title}?</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Đội ngũ KHDN Viettel HCM sẵn sàng tư vấn và demo miễn phí cho doanh nghiệp của bạn.
              </p>
              <ButtonLink
                href={`/dat-lich?solution=${solution.slug}`}
                variant="primary"
                size="md"
                className="mt-4 w-full"
              >
                Đặt lịch tư vấn
              </ButtonLink>
              <ButtonLink href="/lien-he" variant="outline" size="md" className="mt-2 w-full">
                Liên hệ ngay
              </ButtonLink>
            </div>
          </aside>
        </div>

        {/* Bang gia */}
        {hasPricing && (
          <div id="bang-gia" className="mt-6 scroll-mt-20">
            <SectionHeading
              align="left"
              eyebrow="Bảng giá"
              title="Các gói dịch vụ"
              description={solution.pricingNote ?? undefined}
            />
            <PricingTable tiers={solution.pricingTiers} solutionSlug={solution.slug ?? ''} note={solution.pricingNote} />
          </div>
        )}
      </Container>

      {/* Giai phap lien quan */}
      {related.length > 0 && (
        <Section className="bg-surface-muted">
          <Container>
            <SectionHeading align="left" eyebrow="Gợi ý" title="Giải pháp liên quan" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <SolutionCard key={r.id} solution={r} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
