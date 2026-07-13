import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { ButtonLink, Container, Section } from '@/components/ui/primitives'
import { getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  buildPageMetadata({
    key: 'lien-he',
    path: '/lien-he',
    title: 'Liên hệ',
    description:
      'Liên hệ Phòng Khách hàng Doanh nghiệp Viettel Hồ Chí Minh: hotline, email, địa chỉ và đăng ký tư vấn giải pháp chuyển đổi số.',
  })

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getSiteSettings()

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
            <pattern id="contact-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1600" height="360" fill="url(#contact-grid)" />
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
            <span className="text-white">Liên hệ</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Liên hệ với chúng tôi</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            {settings.departmentName ?? 'Phòng Khách hàng Doanh nghiệp - Viettel Hồ Chí Minh'} luôn sẵn sàng đồng hành cùng doanh nghiệp của bạn.
          </p>
        </Container>
      </div>

      <Section className="py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-ink">Thông tin liên hệ</h2>
              <ul className="mt-6 space-y-5">
                {settings.hotline && (
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viettel-red/10 text-viettel-red">
                      <Phone className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">Hotline</div>
                      <a href={`tel:${settings.hotline.replace(/[^0-9+]/g, '')}`} className="text-lg font-bold text-viettel-red">
                        {settings.hotline}
                      </a>
                    </div>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viettel-red/10 text-viettel-red">
                      <Mail className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">Email</div>
                      <a href={`mailto:${settings.email}`} className="text-ink-soft hover:text-viettel-red">
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viettel-red/10 text-viettel-red">
                      <MapPin className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">Địa chỉ</div>
                      <span className="text-ink-soft">{settings.address}</span>
                    </div>
                  </li>
                )}
                {settings.workingHours && (
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viettel-red/10 text-viettel-red">
                      <Clock className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">Giờ làm việc</div>
                      <span className="text-ink-soft">{settings.workingHours}</span>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-8">
                <ButtonLink href="/dat-lich" variant="primary" size="lg">
                  Đăng ký tư vấn ngay
                </ButtonLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-muted">
              {(() => {
                // Chi link embed (/maps/embed) moi nhung duoc; neu khong, tu dung link embed tu dia chi.
                const raw = settings.mapEmbedUrl?.trim()
                const mapSrc = raw?.includes('/maps/embed')
                  ? raw
                  : settings.address?.trim()
                    ? `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&z=16&hl=vi&output=embed`
                    : null
                return mapSrc ? (
                  <iframe
                    src={mapSrc}
                    title="Bản đồ"
                    className="h-full min-h-80 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full min-h-80 items-center justify-center p-8 text-center text-ink-soft">
                    <div>
                      <MapPin className="mx-auto h-10 w-10 text-ink-soft/40" aria-hidden />
                      <p className="mt-3">{settings.address ?? 'TP. Hồ Chí Minh'}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
