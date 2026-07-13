import Link from 'next/link'

import { SolutionsExplorer, type ExplorerSolution } from '@/components/solutions/SolutionsExplorer'
import { Container } from '@/components/ui/primitives'
import { getSolutions } from '@/lib/queries'
import { buildPageMetadata, getPageHeroImage } from '@/lib/seo'
import { COMPANY_SIZES, INDUSTRIES, labelOf, NEEDS, PILLARS } from '@/lib/taxonomy'
import type { Media, Solution } from '@/payload-types'

export const generateMetadata = () =>
  buildPageMetadata({
    key: 'giai-phap',
    path: '/giai-phap',
    title: 'Giải pháp doanh nghiệp',
    description:
      'Khám phá toàn bộ giải pháp chuyển đổi số của Viettel cho doanh nghiệp: viễn thông, chữ ký số, hóa đơn điện tử, cloud, quản trị doanh nghiệp.',
  })

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

function logoUrl(ref: number | Media | null | undefined): string | undefined {
  return ref && typeof ref === 'object' && 'url' in ref ? (ref.url ?? undefined) : undefined
}

function toExplorer(s: Solution): ExplorerSolution {
  return {
    id: String(s.id),
    slug: s.slug ?? '',
    title: s.title,
    shortName: s.shortName ?? undefined,
    tagline: s.tagline ?? undefined,
    shortDesc: s.shortDesc ?? undefined,
    pillar: s.pillar ?? undefined,
    logoUrl: logoUrl(s.logo),
    popular: Boolean(s.isFeatured),
  }
}

export default async function SolutionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const pillar = first(sp.pillar)
  // Bo loc goi y den tu Solution Finder (/tim-giai-phap)
  const industry = first(sp.industry)
  const need = first(sp.need)
  const companySize = first(sp.companySize)
  const isSuggested = Boolean(industry || need || companySize)

  const [result, heroBg] = await Promise.all([
    getSolutions({
      pillar,
      productGroup: first(sp.productGroup),
      industry,
      need,
      companySize,
      q: first(sp.q),
      limit: 500,
    }),
    getPageHeroImage('giai-phap'),
  ])
  const sols = result.docs.filter((s) => s.slug).map(toExplorer)
  const pillarLabel = pillar ? labelOf(PILLARS, pillar) : null

  // Nhan mo ta cac lua chon nguoi dung da chon o Finder
  const criteria = [
    industry && labelOf(INDUSTRIES, industry),
    need && labelOf(NEEDS, need),
    companySize && labelOf(COMPANY_SIZES, companySize),
  ].filter(Boolean) as string[]

  return (
    <>
      {/* Hero */}
      <div className="relative -mt-[60px] overflow-hidden bg-surface-muted pt-[60px] md:-mt-[72px] md:pt-[72px]">
        {heroBg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroBg} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        )}
        <div
          className="pointer-events-none absolute right-0 top-0 h-80 w-[36rem] opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
          aria-hidden
        />
        <Container className="relative py-12 text-center md:py-14">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Giải pháp</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-5xl">
            {isSuggested ? (
              <>
                Giải pháp <span className="text-viettel-red">gợi ý cho bạn</span>
              </>
            ) : pillarLabel ? (
              <>
                Giải pháp <span className="text-viettel-red">{pillarLabel}</span>
              </>
            ) : (
              <>
                Hệ sinh thái <span className="text-viettel-red">giải pháp số</span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft md:text-lg">
            {isSuggested
              ? 'Dựa trên lựa chọn của bạn, đây là các giải pháp phù hợp nhất.'
              : 'Chọn nhóm giải pháp để khám phá — nhấn vào từng giải pháp để xem chi tiết, tính năng và bảng giá.'}
          </p>
        </Container>
      </div>

      <Container className="py-10 md:py-12">
        {/* Dai bo loc goi y tu Solution Finder */}
        {isSuggested && (
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-viettel-red/25 bg-viettel-red/5 px-4 py-3">
            <span className="text-sm font-semibold text-ink">
              Gợi ý theo lựa chọn của bạn ({result.totalDocs} giải pháp):
            </span>
            {criteria.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink ring-1 ring-border-soft"
              >
                {c}
              </span>
            ))}
            <Link
              href="/giai-phap"
              className="ml-auto text-sm font-semibold text-viettel-red hover:underline"
            >
              Xem tất cả giải pháp →
            </Link>
          </div>
        )}

        {sols.length === 0 ? (
          isSuggested || pillar ? (
            <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center">
              <p className="text-ink-soft">Không tìm thấy giải pháp phù hợp với lựa chọn hiện tại.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href="/giai-phap" className="font-semibold text-viettel-red hover:underline">
                  Xem tất cả giải pháp
                </Link>
                <Link href="/dat-lich" className="font-semibold text-ink hover:underline">
                  Đặt lịch tư vấn 1-1
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-ink-soft">Hiện chưa có giải pháp nào được đăng.</p>
          )
        ) : (
          <SolutionsExplorer sols={sols} initialPillar={pillar ?? 'all'} />
        )}
      </Container>
    </>
  )
}
