import type { Metadata } from 'next'
import Link from 'next/link'

import { SolutionFilters } from '@/components/solutions/SolutionFilters'
import { SolutionsKanban } from '@/components/solutions/SolutionsKanban'
import { Container, Section } from '@/components/ui/primitives'
import { getSolutions } from '@/lib/queries'
import { labelOf, PILLARS } from '@/lib/taxonomy'

export const metadata: Metadata = {
  title: 'Giải pháp doanh nghiệp',
  description:
    'Khám phá toàn bộ giải pháp chuyển đổi số của Viettel cho doanh nghiệp: viễn thông, chữ ký số, hóa đơn điện tử, cloud, quản trị doanh nghiệp.',
  alternates: { canonical: '/giai-phap' },
}

type SearchParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function SolutionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const pillar = first(sp.pillar)
  const filters = {
    pillar,
    productGroup: first(sp.productGroup),
    industry: first(sp.industry),
    need: first(sp.need),
    companySize: first(sp.companySize),
    q: first(sp.q),
    // Kanban gom theo tru cot -> lay toan bo ket qua, khong phan trang
    limit: 500,
  }

  const result = await getSolutions(filters)
  const pillarLabel = pillar ? labelOf(PILLARS, pillar) : null

  return (
    <>
      <div className="border-b border-border-soft bg-surface-muted">
        <Container className="py-10">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Giải pháp</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">
            {pillarLabel ? `Giải pháp ${pillarLabel}` : 'Tất cả giải pháp'}
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Lọc theo trụ cột, ngành nghề, nhu cầu và quy mô để tìm giải pháp phù hợp với doanh nghiệp của bạn.
          </p>
        </Container>
      </div>

      <Section className="py-10">
        <Container>
          <SolutionFilters />

          <p className="mb-5 mt-6 text-sm text-ink-soft">
            Tìm thấy <strong className="text-ink">{result.totalDocs}</strong> giải pháp · xếp theo trụ cột
          </p>

          {result.docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center">
              <p className="text-ink-soft">Không tìm thấy giải pháp phù hợp với bộ lọc hiện tại.</p>
              <Link href="/giai-phap" className="mt-3 inline-block font-semibold text-viettel-red">
                Xóa bộ lọc
              </Link>
            </div>
          ) : (
            <SolutionsKanban solutions={result.docs} />
          )}
        </Container>
      </Section>
    </>
  )
}
