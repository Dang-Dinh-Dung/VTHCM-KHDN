import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, User } from 'lucide-react'

import { RichText } from '@/components/RichText'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { Badge, Container, SectionHeading } from '@/components/ui/primitives'
import { formatDate } from '@/lib/format'
import { getNewsBySlug } from '@/lib/queries'
import { labelOf, NEWS_CATEGORIES } from '@/lib/taxonomy'
import type { Solution } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) return { title: 'Không tìm thấy bài viết' }
  return {
    title: item.seo?.metaTitle || item.title,
    description: item.seo?.metaDescription || item.excerpt || undefined,
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) notFound()

  const related = (item.relatedSolutions ?? []).filter(
    (r): r is Solution => typeof r === 'object' && r !== null,
  )

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <nav className="mb-4 text-sm text-ink-soft">
          <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/tin-tuc" className="hover:text-viettel-red">Tin tức</Link>
        </nav>

        <Badge className="bg-viettel-red/10 text-viettel-red">{labelOf(NEWS_CATEGORIES, item.category)}</Badge>
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
