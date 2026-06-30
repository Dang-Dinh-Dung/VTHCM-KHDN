import Link from 'next/link'

import { NewsCard, PolicyCard } from '@/components/content/ContentCards'
import { EcosystemSection } from '@/components/home/EcosystemSection'
import { CustomerLogos } from '@/components/home/CustomerLogos'
import { FeaturedSolutions } from '@/components/home/FeaturedSolutions'
import { Hero } from '@/components/home/Hero'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives'
import {
  getFeaturedSolutions,
  getLatestNews,
  getLatestPolicies,
  getPillarCounts,
  getSiteSettings,
} from '@/lib/queries'

// Render dong de phan anh thay doi tu CMS va tranh phu thuoc DB luc build (CI).
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [settings, featured, counts, news, policies] = await Promise.all([
    getSiteSettings(),
    getFeaturedSolutions(4),
    getPillarCounts(),
    getLatestNews(3),
    getLatestPolicies(4),
  ])

  return (
    <>
      <Hero settings={settings} />

      <EcosystemSection counts={counts} />

      <WhyChooseUs />

      {/* Giai phap noi bat - slide keo qua lai, nen do, the trang */}
      {featured.length > 0 && <FeaturedSolutions solutions={featured} />}

      {/* Logo khach hang tin dung - slide chay tu dong (chi hien khi co logo) */}
      <CustomerLogos logos={settings.customerLogos} />

      {/* Cong cu tim giai phap (CTA) - nen do + hoa tiet chuyen doi so */}
      <Section className="bg-surface-muted">
        <Container>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white md:px-12 md:py-16"
            style={{
              background:
                'linear-gradient(120deg, #8f0c22 0%, #c8132f 45%, #e11537 70%, #a30e28 100%)',
            }}
          >
            {/* Hoa tiet: luoi + node nhip + duong du lieu chay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1200 360"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="cta-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                  <path d="M44 0H0V44" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1200" height="360" fill="url(#cta-grid)" />
              <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" fill="none">
                <path d="M-20 80 L120 80 L170 130 L360 130" />
                <path d="M840 60 L980 140 L1120 140 L1220 70" />
              </g>
              <g stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <path className="hero-dataflow" d="M-20 80 L120 80 L170 130 L360 130" />
                <path className="hero-dataflow" style={{ animationDelay: '2s' }} d="M840 60 L980 140 L1120 140 L1220 70" />
              </g>
              <g fill="#ffffff">
                <circle className="hero-node" cx="170" cy="130" r="4" />
                <circle className="hero-node" cx="980" cy="140" r="4" style={{ animationDelay: '1s' }} />
                <circle className="hero-node" cx="1120" cy="140" r="4" style={{ animationDelay: '2.2s' }} />
              </g>
            </svg>
            {/* Vang sang nhip */}
            <div
              className="hero-glow pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, #ff6b85, transparent 65%)' }}
              aria-hidden
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-2xl font-extrabold md:text-3xl">
                Chưa biết giải pháp nào phù hợp với doanh nghiệp của bạn?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Trả lời vài câu hỏi ngắn về ngành nghề và nhu cầu, chúng tôi sẽ gợi ý các giải pháp tối ưu nhất.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <ButtonLink
                  href="/tim-giai-phap"
                  variant="primary"
                  size="lg"
                  className="bg-white text-viettel-red shadow-lg hover:bg-white/90"
                >
                  Tìm giải pháp phù hợp
                </ButtonLink>
                <ButtonLink
                  href="/dat-lich"
                  size="lg"
                  className="border border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  Đặt lịch tư vấn 1-1
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Tin tuc */}
      {news.length > 0 && (
        <Section>
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading align="left" eyebrow="Tin tức" title="Cập nhật mới nhất" />
              <Link href="/tin-tuc" className="shrink-0 text-sm font-semibold text-viettel-red">
                Tất cả tin tức →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {news.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Nghi dinh & chinh sach */}
      {policies.length > 0 && (
        <Section className="bg-surface-muted">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Nghị định & chính sách"
                title="Quy định liên quan tới doanh nghiệp"
                description="Cập nhật các văn bản pháp quy tác động trực tiếp tới hoạt động số hóa của doanh nghiệp."
              />
              <Link href="/chinh-sach" className="shrink-0 text-sm font-semibold text-viettel-red">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {policies.map((p) => (
                <PolicyCard key={p.id} item={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
