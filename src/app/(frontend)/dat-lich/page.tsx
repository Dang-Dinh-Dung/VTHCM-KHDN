import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { BookingForm } from '@/components/booking/BookingForm'
import { Container } from '@/components/ui/primitives'
import { getSiteSettings, getSolutions } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Đặt lịch tư vấn / demo',
  description:
    'Đăng ký nhận tư vấn hoặc demo giải pháp chuyển đổi số từ Phòng KHDN Viettel Hồ Chí Minh. Đội ngũ chuyên gia sẽ liên hệ trong thời gian sớm nhất.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const solutionSlug = first(sp.solution)
  const typeParam = first(sp.type)

  const [settings, solRes] = await Promise.all([getSiteSettings(), getSolutions({ limit: 100 })])
  const solutions = solRes.docs.map((s) => ({
    id: s.id,
    title: s.shortName || s.title,
    slug: s.slug,
    desc: s.shortDesc || undefined,
  }))
  const defaultSolutionId = solutionSlug ? solutions.find((s) => s.slug === solutionSlug)?.id : undefined
  const defaultType = (['tu-van', 'demo', 'bao-gia'] as const).includes(typeParam as never)
    ? (typeParam as 'tu-van' | 'demo' | 'bao-gia')
    : 'tu-van'

  return (
    <>
      <div
        className="relative -mt-[60px] overflow-hidden text-white md:-mt-[72px]"
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
            <pattern id="booking-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1600" height="360" fill="url(#booking-grid)" />
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

        <Container className="relative pb-12 pt-24 md:pb-14 md:pt-28">
          <nav className="mb-3 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Đặt lịch tư vấn</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Đăng ký nhận tư vấn / demo miễn phí</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Để lại thông tin, chuyên viên KHDN Viettel HCM sẽ liên hệ tư vấn giải pháp phù hợp và báo giá chi tiết cho doanh nghiệp của bạn.
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border-soft bg-surface p-6 md:p-8">
              <BookingForm
                solutions={solutions.map(({ id, title, desc }) => ({ id, title, desc }))}
                defaultSolutionId={defaultSolutionId}
                defaultType={defaultType}
              />
            </div>
          </div>

          {/* Sidebar lien he */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-surface-muted p-6">
              <h2 className="text-lg font-bold text-ink">Liên hệ trực tiếp</h2>
              <p className="mt-1 text-sm text-ink-soft">Hoặc gọi ngay để được hỗ trợ nhanh nhất.</p>
              <ul className="mt-5 space-y-4 text-sm">
                {settings.hotline && (
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-viettel-red" aria-hidden />
                    <div>
                      <div className="font-semibold text-ink">Hotline</div>
                      <a href={`tel:${settings.hotline.replace(/[^0-9+]/g, '')}`} className="text-viettel-red">
                        {settings.hotline}
                      </a>
                    </div>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-viettel-red" aria-hidden />
                    <div>
                      <div className="font-semibold text-ink">Email</div>
                      <a href={`mailto:${settings.email}`} className="text-ink-soft hover:text-viettel-red">
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-viettel-red" aria-hidden />
                    <div>
                      <div className="font-semibold text-ink">Địa chỉ</div>
                      <span className="text-ink-soft">{settings.address}</span>
                    </div>
                  </li>
                )}
                {settings.workingHours && (
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-viettel-red" aria-hidden />
                    <div>
                      <div className="font-semibold text-ink">Giờ làm việc</div>
                      <span className="text-ink-soft">{settings.workingHours}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
