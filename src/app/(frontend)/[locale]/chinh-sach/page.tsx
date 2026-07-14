import { Link } from '@/i18n/navigation'

import { PolicyFilters } from '@/components/content/PolicyFilters'
import { PolicyRow } from '@/components/content/PolicyRow'
import { Container, Section } from '@/components/ui/primitives'
import { getPoliciesList, getPolicyIssuingBodies } from '@/lib/queries'
import { buildPageMetadata, getPageHeroImage } from '@/lib/seo'

export const generateMetadata = () =>
  buildPageMetadata({
    key: 'chinh-sach',
    path: '/chinh-sach',
    title: 'Nghị định & chính sách',
    description:
      'Tra cứu nghị định, thông tư, chính sách nhà nước liên quan tới hóa đơn điện tử, chữ ký số, BHXH, vận tải... và giải pháp Viettel tương ứng.',
  })

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function PoliciesListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const documentType = first(sp.documentType)
  const q = first(sp.q)
  const issuingBody = first(sp.issuingBody)
  const year = first(sp.year)
  const page = Number(first(sp.page) ?? '1') || 1

  const [res, issuingBodies, heroBg] = await Promise.all([
    getPoliciesList({ documentType, q, issuingBody, year, page, limit: 12 }),
    getPolicyIssuingBodies(),
    getPageHeroImage('chinh-sach'),
  ])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 8 }, (_, i) => String(currentYear - i))

  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (documentType) params.set('documentType', documentType)
    if (q) params.set('q', q)
    if (issuingBody) params.set('issuingBody', issuingBody)
    if (year) params.set('year', year)
    params.set('page', String(p))
    return `/chinh-sach?${params.toString()}`
  }

  return (
    <>
      <div className="relative overflow-hidden border-b border-border-soft bg-surface-muted">
        {heroBg && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroBg} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface/80 via-surface/30 to-transparent" aria-hidden />
          </>
        )}
        <Container className="relative py-10">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Nghị định & chính sách</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Tra cứu nghị định & chính sách</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Tra cứu văn bản pháp quy tác động tới hoạt động số hóa của doanh nghiệp, kèm giải pháp Viettel đáp ứng.
          </p>
        </Container>
      </div>

      <Section className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <PolicyFilters issuingBodies={issuingBodies} years={years} />

            <div>
              {res.docs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center text-ink-soft">
                  Không tìm thấy văn bản phù hợp.
                </div>
              ) : (
                <div className="space-y-3">
                  {res.docs.map((p) => (
                    <PolicyRow key={p.id} item={p} />
                  ))}
                </div>
              )}

              {res.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  {res.hasPrevPage && (
                    <Link href={pageHref(res.page! - 1)} className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red">Trước</Link>
                  )}
                  <span className="text-sm text-ink-soft">Trang {res.page}/{res.totalPages}</span>
                  {res.hasNextPage && (
                    <Link href={pageHref(res.page! + 1)} className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red">Sau</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
