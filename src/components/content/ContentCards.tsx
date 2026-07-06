import Link from 'next/link'
import { ArrowRight, CalendarDays, Newspaper, ScrollText } from 'lucide-react'

import { Badge } from '@/components/ui/primitives'
import { formatDate } from '@/lib/format'
import { labelOf, NEWS_CATEGORIES, POLICY_TYPES } from '@/lib/taxonomy'
import type { Media, News, Policy } from '@/payload-types'

type MediaRef = number | Media | null | undefined

/** Lay URL anh (uu tien ban "card") + alt tu truong upload da populate. */
function mediaImage(ref: MediaRef): { url: string; alt: string } | null {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    const url = sizes?.card?.url ?? sizes?.og?.url ?? ref.url
    if (url) return { url, alt: ref.alt ?? '' }
  }
  return null
}

export function NewsCard({ item, compact = false }: { item: News; compact?: boolean }) {
  const img = mediaImage(item.coverImage)
  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface transition-all hover:-translate-y-0.5 hover:border-viettel-red/40 hover:shadow-brand"
    >
      {/* Anh thuc te cua bai viet */}
      <div
        className={`relative w-full overflow-hidden bg-surface-muted ${compact ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.url}
            alt={img.alt || item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-viettel-red/10 to-viettel-red/5 text-viettel-red/40">
            <Newspaper className={compact ? 'h-8 w-8' : 'h-12 w-12'} aria-hidden strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <Badge className="bg-white/90 text-viettel-red shadow-sm backdrop-blur-sm">
            {labelOf(NEWS_CATEGORIES, item.category)}
          </Badge>
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        <span className={`text-xs text-ink-soft ${compact ? 'mb-1' : 'mb-2'}`}>
          {formatDate(item.publishedAt)}
        </span>
        <h3
          className={`line-clamp-2 font-bold leading-snug text-ink group-hover:text-viettel-red ${compact ? 'text-[15px]' : 'text-base'}`}
        >
          {item.title}
        </h3>
        {!compact && item.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{item.excerpt}</p>
        )}
        {!compact && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-viettel-red">
            Đọc tiếp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        )}
      </div>
    </Link>
  )
}

export function PolicyCard({ item, compact = false }: { item: Policy; compact?: boolean }) {
  const img = mediaImage(item.coverImage)
  return (
    <Link
      href={`/chinh-sach/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface transition-all hover:-translate-y-0.5 hover:border-viettel-red/40 hover:shadow-brand"
    >
      {/* Anh minh hoa van ban */}
      <div
        className={`relative w-full overflow-hidden bg-surface-muted ${compact ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.url}
            alt={img.alt || item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink/10 to-ink/5 text-ink/30">
            <ScrollText className={compact ? 'h-8 w-8' : 'h-12 w-12'} aria-hidden strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <Badge className="bg-white/90 text-ink shadow-sm backdrop-blur-sm">
            {labelOf(POLICY_TYPES, item.documentType)}
          </Badge>
          {!compact && item.documentNumber && (
            <Badge className="bg-white/80 text-ink-soft shadow-sm backdrop-blur-sm">
              {item.documentNumber}
            </Badge>
          )}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        <h3
          className={`line-clamp-2 font-bold leading-snug text-ink group-hover:text-viettel-red ${compact ? 'text-[15px]' : 'text-base'}`}
        >
          {item.title}
        </h3>
        {!compact && item.summary && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{item.summary}</p>
        )}
        <div className={`flex items-center justify-between text-xs text-ink-soft ${compact ? 'mt-2.5' : 'mt-4'}`}>
          {item.effectiveDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Hiệu lực:{' '}
              {formatDate(item.effectiveDate)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 font-semibold text-viettel-red">
            Chi tiết <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}
