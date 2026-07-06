import { ArrowRight, BadgeCheck, Clock, ShieldCheck } from 'lucide-react'

import { ButtonLink, Container } from '@/components/ui/primitives'
import { TechGlobe } from '@/components/home/TechGlobe'
import type { Media, SiteSetting } from '@/payload-types'

const TRUST = [
  { icon: BadgeCheck, label: 'Dịch vụ chính hãng Viettel' },
  { icon: ShieldCheck, label: 'An toàn & bảo mật dữ liệu' },
  { icon: Clock, label: 'Hỗ trợ kỹ thuật 24/7' },
]

/** URL anh nen hero upload trong admin (luu tren server/Object Storage), uu tien ban lon. */
function heroBgUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    return sizes?.og?.url ?? ref.url ?? undefined
  }
  return undefined
}

export function Hero({ settings }: { settings: SiteSetting }) {
  const stats = settings.stats ?? []
  const bgUrl = heroBgUrl(settings.heroImage)
  return (
    <section
      className="relative -mt-[60px] overflow-hidden text-white md:-mt-[72px] lg:h-svh"
      style={{
        background:
          'radial-gradient(120% 95% at 64% 38%, #58061a 0%, #38040f 38%, #1c020a 70%, #0d0105 100%)',
      }}
    >
      {/* Anh nen hero: upload trong admin (SiteSettings > Ảnh nền hero), luu tren server */}
      {bgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgUrl}
          alt=""
          aria-hidden
          className="hero-kenburns pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-40 will-change-transform"
        />
      )}
      {/* Vang sang do nhip nhang o vung qua cau ben phai */}
      <div
        className="hero-glow pointer-events-none absolute right-[6%] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(238,0,51,0.5), transparent 65%)' }}
        aria-hidden
      />
      {/* Lop phu toi do: dam ben trai de chu de doc, nhat dan sang phai lo qua cau */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(16,1,7,0.9) 0%, rgba(24,2,9,0.68) 38%, rgba(24,2,9,0.22) 70%, rgba(24,2,9,0) 100%)',
        }}
        aria-hidden
      />
      {/* Tia sang quet cheo qua hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="hero-sweep absolute -inset-y-10 left-0 w-1/3"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          }}
        />
      </div>

      {/* Qua cau cong nghe 3D xoay (goc phai) */}
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 hidden -translate-y-1/2 lg:block"
        aria-hidden
      >
        <TechGlobe />
      </div>

      {/* Luoi mang + goi du lieu chay + node nhip nhang (digital transformation) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Duong mang tinh (mo) */}
        <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" fill="none">
          <path d="M980 120 L1140 200 L1320 200 L1400 130 L1600 130" />
          <path d="M1140 200 L1210 320 L1430 320" />
          <path d="M1320 200 L1480 290" />
          <path d="M1210 320 L1280 450 L1500 450" />
        </g>
        {/* Goi du lieu chay tren cac tuyen (glow segment) */}
        <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path className="hero-dataflow" d="M980 120 L1140 200 L1320 200 L1400 130 L1600 130" />
          <path
            className="hero-dataflow"
            style={{ animationDelay: '1.6s' }}
            d="M1140 200 L1210 320 L1430 320"
          />
          <path
            className="hero-dataflow"
            style={{ animationDelay: '2.8s' }}
            d="M1210 320 L1280 450 L1500 450"
          />
        </g>
        {/* Node giao diem nhip nhang */}
        <g fill="#ffffff">
          <circle className="hero-node" cx="1140" cy="200" r="4" />
          <circle className="hero-node" cx="1320" cy="200" r="4" style={{ animationDelay: '0.6s' }} />
          <circle className="hero-node" cx="1400" cy="130" r="4" style={{ animationDelay: '1.2s' }} />
          <circle className="hero-node" cx="1210" cy="320" r="4" style={{ animationDelay: '1.8s' }} />
          <circle className="hero-node" cx="1430" cy="320" r="4" style={{ animationDelay: '2.4s' }} />
          <circle className="hero-node" cx="1280" cy="450" r="4" style={{ animationDelay: '3s' }} />
        </g>
      </svg>
      {/* Hat du lieu bay len (data particles) - phia hoa tiet ben phai */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden" aria-hidden>
        {[
          { l: '18%', b: '12%', d: '0s', s: 'h-1.5 w-1.5', o: 'opacity-70' },
          { l: '32%', b: '6%', d: '1.4s', s: 'h-1 w-1', o: 'opacity-60' },
          { l: '46%', b: '18%', d: '2.6s', s: 'h-2 w-2', o: 'opacity-80' },
          { l: '60%', b: '8%', d: '0.8s', s: 'h-1 w-1', o: 'opacity-50' },
          { l: '72%', b: '22%', d: '3.4s', s: 'h-1.5 w-1.5', o: 'opacity-70' },
          { l: '84%', b: '10%', d: '2s', s: 'h-1 w-1', o: 'opacity-60' },
          { l: '52%', b: '4%', d: '4.2s', s: 'h-1.5 w-1.5', o: 'opacity-60' },
        ].map((p, i) => (
          <span
            key={i}
            className={`hero-particle absolute rounded-full bg-white ${p.s} ${p.o}`}
            style={{ left: p.l, bottom: p.b, animationDelay: p.d }}
          />
        ))}
      </div>
      {/* Vet sang do luon o day (light streaks) */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full md:h-56"
        viewBox="0 0 1600 240"
        preserveAspectRatio="none"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-streak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ee0033" stopOpacity="0" />
            <stop offset="0.35" stopColor="#ff3355" stopOpacity="0.85" />
            <stop offset="0.65" stopColor="#ee0033" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ee0033" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round">
          <path d="M-40 150 C 380 60, 900 230, 1660 110" stroke="url(#hero-streak)" strokeWidth="2.5" opacity="0.9" />
          <path d="M-40 190 C 480 110, 1020 270, 1660 160" stroke="url(#hero-streak)" strokeWidth="5" opacity="0.45" />
          <path d="M-40 215 C 560 160, 1100 300, 1660 205" stroke="url(#hero-streak)" strokeWidth="9" opacity="0.2" />
          {/* Goi sang chay doc vet */}
          <path className="hero-dataflow" d="M-40 150 C 380 60, 900 230, 1660 110" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2.5" />
        </g>
      </svg>
      {/* Tang do tuong phan o day section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, rgba(13,1,5,0.75), transparent)' }}
        aria-hidden
      />
      <Container className="relative flex min-h-[88svh] flex-col justify-center pb-24 pt-24 md:pb-32 md:pt-32 lg:h-full lg:min-h-0">
        <div className="max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
            Phòng KHDN Viettel Hồ Chí Minh
          </span>
          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            {settings.heroHeadline ?? 'Giải pháp chuyển đổi số toàn diện cho doanh nghiệp'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {settings.heroSubheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href="/tim-giai-phap"
              variant="primary"
              size="lg"
              className="bg-white text-viettel-red shadow-lg hover:bg-white/90"
            >
              {settings.heroPrimaryCtaLabel ?? 'Tìm giải pháp phù hợp'}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/dat-lich"
              size="lg"
              className="border border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              {settings.heroSecondaryCtaLabel ?? 'Đặt lịch tư vấn'}
            </ButtonLink>
          </div>

          {/* Trust signals */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-sm text-white/85">
                <Icon className="h-5 w-5 text-white" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {stats.length > 0 && (
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-extrabold tabular-nums text-white md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
