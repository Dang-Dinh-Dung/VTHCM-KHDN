import type { Metadata } from 'next'

import { SolutionFinder } from '@/components/solutions/SolutionFinder'
import { Container } from '@/components/ui/primitives'

export const metadata: Metadata = {
  title: 'Tìm giải pháp phù hợp',
  description:
    'Trả lời 3 câu hỏi ngắn về ngành nghề, nhu cầu và quy mô — chúng tôi gợi ý các giải pháp chuyển đổi số Viettel phù hợp nhất với doanh nghiệp của bạn.',
}

// Trang dung chung layout (doc site-settings tu DB) -> tranh prerender luc build
// de khong query DB khi schema chua dong bo. Schema se duoc tao luc chay (DB_PUSH).
export const dynamic = 'force-dynamic'

export default function FindSolutionPage() {
  return (
    <div className="bg-surface-muted">
      <div
        className="relative overflow-hidden text-white"
        style={{
          background:
            'linear-gradient(120deg, #8f0c22 0%, #c8132f 45%, #e11537 70%, #a30e28 100%)',
        }}
      >
        {/* Hoa tiet chuyen doi so: luoi + duong du lieu chay + node nhip */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1600 360"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="finder-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1600" height="360" fill="url(#finder-grid)" />
          <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" fill="none">
            <path d="M-20 90 L160 90 L220 150 L420 150 L480 80 L680 80" />
            <path d="M1620 70 L1440 150 L1240 150 L1160 220 L940 220" />
          </g>
          <g stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path className="hero-dataflow" d="M-20 90 L160 90 L220 150 L420 150 L480 80 L680 80" />
            <path className="hero-dataflow" style={{ animationDelay: '2.2s' }} d="M1620 70 L1440 150 L1240 150 L1160 220 L940 220" />
          </g>
          <g fill="#ffffff">
            <circle className="hero-node" cx="220" cy="150" r="4" />
            <circle className="hero-node" cx="480" cy="80" r="4" style={{ animationDelay: '0.8s' }} />
            <circle className="hero-node" cx="1240" cy="150" r="4" style={{ animationDelay: '1.6s' }} />
            <circle className="hero-node" cx="1160" cy="220" r="4" style={{ animationDelay: '2.4s' }} />
          </g>
        </svg>
        {/* Vang sang nhip 2 goc */}
        <div
          className="hero-glow pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff6b85, transparent 65%)' }}
          aria-hidden
        />
        <div
          className="hero-glow pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #6f0717, transparent 70%)' }}
          aria-hidden
        />

        <Container className="relative py-12 text-center md:py-16">
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold md:text-4xl">
            Tìm giải pháp phù hợp với doanh nghiệp của bạn
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Chỉ 3 bước đơn giản, chúng tôi sẽ gợi ý các giải pháp tối ưu nhất cho ngành nghề và nhu cầu của bạn.
          </p>
        </Container>
      </div>
      <Container className="relative z-10 -mt-8 pb-16 md:-mt-10">
        <SolutionFinder />
      </Container>
    </div>
  )
}
