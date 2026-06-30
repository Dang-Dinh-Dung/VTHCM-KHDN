import type { Media, SiteSetting } from '@/payload-types'

import { Container } from '@/components/ui/primitives'

function logoUrl(ref: number | Media | null | undefined): string | undefined {
  if (!ref || typeof ref === 'number') return undefined
  return ref.sizes?.thumbnail?.url ?? ref.url ?? undefined
}

/**
 * Dai logo khach hang tin dung - slide chay tu dong (marquee).
 * Cuon lien mach bang cach nhan doi danh sach; dung khi hover; ton trong reduced-motion (globals.css).
 * Chi hien khi co >=1 logo (admin them trong Cau hinh website).
 */
export function CustomerLogos({ logos }: { logos?: SiteSetting['customerLogos'] }) {
  const items = (logos ?? []).filter((l) => logoUrl(l.logo))
  if (items.length === 0) return null

  const loop = [...items, ...items] // nhan doi de cuon vong lap lien mach

  return (
    <section className="border-y border-border-soft bg-surface py-10">
      <Container>
        <p className="mb-7 text-center text-sm font-semibold uppercase tracking-wider text-ink-soft">
          Khách hàng tin dùng Viettel
        </p>
      </Container>

      <div className="group relative overflow-hidden">
        {/* Mo nhe 2 mep cho dep */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent" aria-hidden />

        <ul className="marquee-track flex w-max items-center gap-12 group-hover:[animation-play-state:paused]">
          {loop.map((l, i) => {
            const url = logoUrl(l.logo)!
            const img = (
              <img
                src={url}
                alt={l.name ?? 'Khách hàng'}
                className="h-10 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-12"
                loading="lazy"
              />
            )
            return (
              <li key={i} className="shrink-0" aria-hidden={i >= items.length}>
                {l.url ? (
                  <a href={l.url} target="_blank" rel="noopener noreferrer" title={l.name ?? undefined}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
