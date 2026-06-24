import type { Metadata } from 'next'
import Link from 'next/link'

import { PolicyCard } from '@/components/content/ContentCards'
import { Container, Section } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { getPoliciesList } from '@/lib/queries'
import { POLICY_TYPES } from '@/lib/taxonomy'

export const metadata: Metadata = {
  title: 'Nghị định & chính sách',
  description:
    'Tổng hợp nghị định, thông tư, chính sách nhà nước liên quan tới hóa đơn điện tử, chữ ký số, BHXH, vận tải... và giải pháp Viettel tương ứng.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function PoliciesListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const documentType = first(sp.documentType)
  const page = Number(first(sp.page) ?? '1') || 1
  const res = await getPoliciesList({ documentType, page, limit: 9 })

  const chipHref = (t?: string) => (t ? `/chinh-sach?documentType=${t}` : '/chinh-sach')

  return (
    <>
      <div className="border-b border-border-soft bg-surface-muted">
        <Container className="py-10">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Nghị định & chính sách</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Nghị định & chính sách</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Cập nhật các văn bản pháp quy tác động tới hoạt động số hóa của doanh nghiệp, kèm giải pháp Viettel đáp ứng.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={chipHref()}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                !documentType ? 'bg-viettel-red text-white' : 'bg-surface text-ink-soft ring-1 ring-border-soft hover:text-viettel-red',
              )}
            >
              Tất cả
            </Link>
            {POLICY_TYPES.map((t) => (
              <Link
                key={t.value}
                href={chipHref(t.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  documentType === t.value ? 'bg-viettel-red text-white' : 'bg-surface text-ink-soft ring-1 ring-border-soft hover:text-viettel-red',
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <Section className="py-10">
        <Container>
          {res.docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center text-ink-soft">
              Chưa có văn bản trong mục này.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {res.docs.map((p) => (
                <PolicyCard key={p.id} item={p} />
              ))}
            </div>
          )}

          {res.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              {res.hasPrevPage && (
                <Link
                  href={`/chinh-sach?${new URLSearchParams({ ...(documentType ? { documentType } : {}), page: String(res.page! - 1) })}`}
                  className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red"
                >
                  Trước
                </Link>
              )}
              <span className="text-sm text-ink-soft">Trang {res.page}/{res.totalPages}</span>
              {res.hasNextPage && (
                <Link
                  href={`/chinh-sach?${new URLSearchParams({ ...(documentType ? { documentType } : {}), page: String(res.page! + 1) })}`}
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
