import { Container, Section, SectionHeading } from '@/components/ui/primitives'
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
    <Section className="relative overflow-hidden bg-surface">
      {/* Nen trang tri do nhe */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Hệ sinh thái sản phẩm"
          title="Giải pháp toàn diện theo 6 trụ cột"
          description="Nhấn vào từng trụ cột để xem toàn bộ giải pháp bên trong."
        />
        <EcosystemDiagram counts={counts} solutionsByPillar={solutionsByPillar} />
      </Container>
    </Section>
  )
}
