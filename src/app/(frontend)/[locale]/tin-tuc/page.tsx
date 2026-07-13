import Link from 'next/link'

import { NewsCard } from '@/components/content/ContentCards'
import { Container, Section } from '@/components/ui/primitives'
import { getNewsList } from '@/lib/queries'
import { buildPageMetadata, getPageHeroImage } from '@/lib/seo'
import { cn } from '@/lib/cn'
import { NEWS_CATEGORIES } from '@/lib/taxonomy'

export const generateMetadata = () =>
  buildPageMetadata({
    key: 'tin-tuc',
    path: '/tin-tuc',
    title: 'Tin tức',
    description:
      'Tin tức Viettel, khuyến mãi, sự kiện và cập nhật chuyển đổi số cho doanh nghiệp tại TP. Hồ Chí Minh.',
  })

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function NewsListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const category = first(sp.category)
  const page = Number(first(sp.page) ?? '1') || 1
  const [res, heroBg] = await Promise.all([
    getNewsList({ category, page, limit: 9 }),
    getPageHeroImage('tin-tuc'),
  ])

  const chipHref = (cat?: string) => (cat ? `/tin-tuc?category=${cat}` : '/tin-tuc')

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
            <span className="text-ink">Tin tức</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Tin tức & sự kiện</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Cập nhật tin tức Viettel, chương trình khuyến mãi và xu hướng chuyển đổi số doanh nghiệp.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={chipHref()}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                !category ? 'bg-viettel-red text-white' : 'bg-surface text-ink-soft hover:bg-surface ring-1 ring-border-soft',
              )}
            >
              Tất cả
            </Link>
            {NEWS_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={chipHref(c.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  category === c.value ? 'bg-viettel-red text-white' : 'bg-surface text-ink-soft ring-1 ring-border-soft hover:text-viettel-red',
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <Section className="py-10">
        <Container>
          {res.docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center text-ink-soft">
              Chưa có tin tức trong mục này.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {res.docs.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          )}

          {res.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              {res.hasPrevPage && (
                <Link
                  href={`/tin-tuc?${new URLSearchParams({ ...(category ? { category } : {}), page: String(res.page! - 1) })}`}
                  className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red"
                >
                  Trước
                </Link>
              )}
              <span className="text-sm text-ink-soft">Trang {res.page}/{res.totalPages}</span>
              {res.hasNextPage && (
                <Link
                  href={`/tin-tuc?${new URLSearchParams({ ...(category ? { category } : {}), page: String(res.page! + 1) })}`}
                  className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red"
                >
                  Sau
                </Link>
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
