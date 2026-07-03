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
      {/* Nen trang tri do nhe */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />
      <Container className="relative">
        {/* Heading gon de vua man hinh khi mo tru cot */}
        <Reveal className="mb-6 text-center">
          <p className="mb-1.5 text-sm font-bold uppercase tracking-wider text-viettel-red">Hệ sinh thái sản phẩm</p>
          <h2 className="text-2xl font-extrabold leading-tight text-ink md:text-3xl">Giải pháp toàn diện theo 6 trụ cột</h2>
          <p className="mt-2 text-sm text-ink-soft md:text-base">Nhấn vào từng trụ cột để xem toàn bộ giải pháp bên trong.</p>
        </Reveal>
        <EcosystemDiagram counts={counts} solutionsByPillar={solutionsByPillar} />
      </Container>
    </Section>
  )
}
