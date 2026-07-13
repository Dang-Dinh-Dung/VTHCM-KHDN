import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, CalendarCheck, ExternalLink, FileText, Hash } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { RichText } from '@/components/RichText'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { Badge, ButtonLink, Container, SectionHeading } from '@/components/ui/primitives'
import { formatDate } from '@/lib/format'
import { getPolicyBySlug } from '@/lib/queries'
import { breadcrumbJsonLd, jsonLdScript, siteUrl } from '@/lib/seo'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'
import { POLICY_TYPES } from '@/lib/taxonomy'
import type { Media, Solution } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getPolicyBySlug(slug)
  if (!item) return { title: 'Không tìm thấy văn bản' }
  const title = item.seo?.metaTitle || item.title
  const description = item.seo?.metaDescription || item.summary || undefined
  return {
    title,
    description,
    alternates: { canonical: `/chinh-sach/${slug}` },
    openGraph: { title, description, type: 'article', url: `/chinh-sach/${slug}` },
  }
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getPolicyBySlug(slug)
  if (!item) notFound()

  const t = await getTranslations('taxonomy')
  const related = (item.relatedSolutions ?? []).filter(
    (r): r is Solution => typeof r === 'object' && r !== null,
  )
  const attachment = item.attachment && typeof item.attachment === 'object' ? (item.attachment as Media) : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    ...(item.summary ? { description: item.summary } : {}),
    ...(item.effectiveDate ? { datePublished: item.effectiveDate } : {}),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    ...(item.issuingBody ? { author: { '@type': 'Organization', name: item.issuingBody } } : {}),
    publisher: { '@type': 'Organization', name: 'Viettel - KHDN Hồ Chí Minh', url: siteUrl() },
    mainEntityOfPage: siteUrl(`/chinh-sach/${slug}`),
  }
  const crumbsJsonLd = breadcrumbJsonLd([
    ['Trang chủ', '/'],
    ['Nghị định & chính sách', '/chinh-sach'],
    [item.title, `/chinh-sach/${slug}`],
  ])

  return (
    <Container className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbsJsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <nav className="mb-4 text-sm text-ink-soft">
          <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/chinh-sach" className="hover:text-viettel-red">Nghị định & chính sách</Link>
        </nav>

        <Badge className="bg-pillar-datacenter/10 text-pillar-datacenter">
          {taxonomyLabel(t, 'policyTypes', item.documentType, POLICY_TYPES)}
        </Badge>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{item.title}</h1>

        {/* Meta van ban */}
        <dl className="mt-5 grid gap-3 rounded-2xl border border-border-soft bg-surface-muted p-5 sm:grid-cols-2">
          {item.documentNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-ink-soft" aria-hidden />
              <dt className="text-ink-soft">Số hiệu:</dt>
              <dd className="font-semibold text-ink">{item.documentNumber}</dd>
            </div>
          )}
          {item.issuingBody && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-ink-soft" aria-hidden />
              <dt className="text-ink-soft">Cơ quan:</dt>
              <dd className="font-semibold text-ink">{item.issuingBody}</dd>
            </div>
          )}
          {item.effectiveDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarCheck className="h-4 w-4 text-ink-soft" aria-hidden />
              <dt className="text-ink-soft">Hiệu lực:</dt>
              <dd className="font-semibold text-ink">{formatDate(item.effectiveDate)}</dd>
            </div>
          )}
        </dl>

        {item.summary && (
          <div className="mt-6 rounded-xl border-l-4 border-viettel-red bg-viettel-red/5 p-4">
            <p className="text-ink-soft">{item.summary}</p>
          </div>
        )}

        <div className="mt-6">
          <RichText data={item.body as never} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {attachment?.url && (
            <ButtonLink href={attachment.url} variant="outline" size="md" target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" aria-hidden /> Tải văn bản (PDF)
            </ButtonLink>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Nguồn chính thức <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-14 max-w-5xl border-t border-border-soft pt-10">
          <SectionHeading
            align="left"
            eyebrow="Giải pháp đáp ứng"
            title="Viettel giúp doanh nghiệp tuân thủ"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <SolutionCard key={r.id} solution={r} />
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}
