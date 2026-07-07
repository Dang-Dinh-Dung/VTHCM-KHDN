import { Container, Section } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import type { PillarSolutionItem } from '@/lib/queries'

import { EcosystemDiagram } from './EcosystemDiagram'

export function EcosystemSection({
  counts,
  solutionsByPillar,
}: {
  counts: Record<string, number>
  solutionsByPillar: Record<string, PillarSolutionItem[]>
}) {
  return (
    <Section className="relative overflow-hidden bg-surface py-8 md:py-10">
      {/* Nen constellation (mang luoi node) mo 2 ben - theo thiet ke tham khao */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#ee0033" strokeOpacity="0.08" strokeWidth="1" fill="none">
          <path d="M-20 140 L120 90 L230 170 L150 290 L20 250 Z M120 90 L150 290 M230 170 L370 120 L400 260 L230 170" />
          <path d="M1620 120 L1480 80 L1380 190 L1470 300 L1600 250 Z M1480 80 L1470 300 M1380 190 L1240 150 L1210 290 L1380 190" />
          <path d="M-30 620 L90 560 L200 660 L80 730 Z M200 660 L330 600" />
          <path d="M1630 640 L1510 580 L1400 680 L1520 750 Z M1400 680 L1270 620" />
        </g>
        <g fill="#ee0033" fillOpacity="0.18">
          <circle cx="120" cy="90" r="4" />
          <circle cx="230" cy="170" r="4" />
          <circle cx="150" cy="290" r="3" />
          <circle cx="370" cy="120" r="3" />
          <circle cx="1480" cy="80" r="4" />
          <circle cx="1380" cy="190" r="4" />
          <circle cx="1470" cy="300" r="3" />
          <circle cx="1240" cy="150" r="3" />
          <circle cx="90" cy="560" r="3" />
          <circle cx="200" cy="660" r="4" />
          <circle cx="1510" cy="580" r="3" />
          <circle cx="1400" cy="680" r="4" />
        </g>
      </svg>
      {/* Vet do mem o 2 goc */}
      <div
        className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-32 h-96 w-96 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />

      <Container className="relative">
        {/* Tieu de gradient (do -> hong -> tim) theo phong cach tech */}
        <Reveal className="mb-5 text-center md:mb-7">
          <h2
            className="bg-clip-text pb-1 text-xl font-black uppercase leading-[1.3] tracking-tight text-transparent md:text-3xl"
            style={{ backgroundImage: 'linear-gradient(90deg, #ee0033 0%, #d926a9 50%, #7c3aed 100%)' }}
          >
            Hệ sinh thái sản phẩm Viettel
          </h2>
          <p className="mt-1.5 text-sm text-ink-soft md:text-base">
            Giải pháp toàn diện theo <span className="font-bold text-viettel-red">6 trụ cột</span> — nhấn
            vào từng trụ cột để xem giải pháp bên trong.
          </p>
        </Reveal>
        <EcosystemDiagram counts={counts} solutionsByPillar={solutionsByPillar} />
      </Container>
    </Section>
  )
}
