import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Link } from '@/i18n/navigation'
import { CalendarDays, User } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { RichText } from '@/components/RichText'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { Badge, Container, SectionHeading } from '@/components/ui/primitives'
import { formatDate } from '@/lib/format'
import { getNewsBySlug } from '@/lib/queries'
import { breadcrumbJsonLd, jsonLdScript, siteUrl } from '@/lib/seo'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'
import { NEWS_CATEGORIES } from '@/lib/taxonomy'
import type { Media, Solution } from '@/payload-types'

export const dynamic = 'force-dynamic'

function coverUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    return sizes?.og?.url ?? sizes?.card?.url ?? ref.url ?? undefined
  }
  return undefined
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) return { title: 'Không tìm thấy bài viết' }
  const title = item.seo?.metaTitle || item.title
  const description = item.seo?.metaDescription || item.excerpt || undefined
  const image = coverUrl(item.coverImage)
  return {
    title,
    description,
    alternates: { canonical: `/tin-tuc/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/tin-tuc/${slug}`,
      ...(item.publishedAt ? { publishedTime: item.publishedAt } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) notFound()

  const t = await getTranslations('taxonomy')
  const related = (item.relatedSolutions ?? []).filter(
    (r): r is Solution => typeof r === 'object' && r !== null,
  )

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    ...(item.excerpt ? { description: item.excerpt } : {}),
    ...(coverUrl(item.coverImage) ? { image: [coverUrl(item.coverImage)] } : {}),
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    ...(item.author ? { author: { '@type': 'Person', name: item.author } } : {}),
    publisher: { '@type': 'Organization', name: 'Viettel - KHDN Hồ Chí Minh', url: siteUrl() },
    mainEntityOfPage: siteUrl(`/tin-tuc/${slug}`),
  }
  const crumbsJsonLd = breadcrumbJsonLd([
    ['Trang chủ', '/'],
    ['Tin tức', '/tin-tuc'],
    [item.title, `/tin-tuc/${slug}`],
  ])

  return (
    <Container className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbsJsonLd) }} />
      <article className="mx-auto max-w-3xl">
        <nav className="mb-4 text-sm text-ink-soft">
          <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/tin-tuc" className="hover:text-viettel-red">Tin tức</Link>
        </nav>

        <Badge className="bg-viettel-red/10 text-viettel-red">{taxonomyLabel(t, 'newsCategories', item.category, NEWS_CATEGORIES)}</Badge>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-4xl">{item.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden /> {formatDate(item.publishedAt)}
          </span>
          {item.author && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden /> {item.author}
            </span>
          )}
        </div>

        {item.excerpt && <p className="mt-6 text-lg font-medium text-ink-soft">{item.excerpt}</p>}

        <div className="mt-6">
          <RichText data={item.body as never} />
        </div>
      </article>

      {related.length > 0 && (
        <div className="mx-auto mt-14 max-w-5xl border-t border-border-soft pt-10">
          <SectionHeading align="left" eyebrow="Liên quan" title="Giải pháp được nhắc đến" />
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
