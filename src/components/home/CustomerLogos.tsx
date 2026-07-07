import type { Media, SiteSetting } from '@/payload-types'

import { Container } from '@/components/ui/primitives'

// Dung anh GOC (khong dung thumbnail vi thumbnail bi cat giua 400x300 -> xen logo)
function logoUrl(ref: number | Media | null | undefined): string | undefined {
  if (!ref || typeof ref === 'number') return undefined
  return ref.url ?? undefined
}

/**
 * Dai logo khach hang tin dung - slide chay tu dong (marquee).
 * Cau truc 2 nhom logo giong het nhau; track dich -50% (dung mot nhom) -> cuon LIEN MACH, khong ho.
 * Dung khi hover; ton trong reduced-motion (globals.css). Chi hien khi co >=1 logo.
 */
export function CustomerLogos({ logos }: { logos?: SiteSetting['customerLogos'] }) {
  const items = (logos ?? []).filter((l) => logoUrl(l.logo))
  if (items.length === 0) return null

  const Group = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14" aria-hidden={hidden}>
      {items.map((l, i) => {
        const url = logoUrl(l.logo)!
        const img = (
          <img
            src={url}
            alt={l.name ?? 'Khách hàng'}
            className="h-12 w-auto max-w-[160px] object-contain opacity-90 transition duration-300 hover:opacity-100 md:h-16"
            loading="lazy"
          />
        )
        return (
          <li key={i} className="flex shrink-0 items-center">
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
  )

  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <h2 className="mb-9 text-center text-xl font-extrabold uppercase tracking-wide text-ink md:text-2xl">
          Khách hàng tin dùng <span className="text-viettel-red">Viettel</span>
        </h2>
      </Container>

      <div className="group relative overflow-hidden">
        {/* Mo nhe 2 mep (hep de khong che logo) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-surface to-transparent md:w-20" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface to-transparent md:w-20" aria-hidden />

        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  )
}
