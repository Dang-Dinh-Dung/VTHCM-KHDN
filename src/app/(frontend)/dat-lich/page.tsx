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
  const solutions = solRes.docs.map((s) => ({ id: s.id, title: s.shortName || s.title, slug: s.slug }))
  const defaultSolutionId = solutionSlug ? solutions.find((s) => s.slug === solutionSlug)?.id : undefined
  const defaultType = (['tu-van', 'demo', 'bao-gia'] as const).includes(typeParam as never)
    ? (typeParam as 'tu-van' | 'demo' | 'bao-gia')
    : 'tu-van'

  return (
    <>
      <div className="bg-ink text-white">
        <Container className="py-12 md:py-14">
          <nav className="mb-3 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Đặt lịch tư vấn</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Đăng ký nhận tư vấn / demo miễn phí</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Để lại thông tin, chuyên viên KHDN Viettel HCM sẽ liên hệ tư vấn giải pháp phù hợp và báo giá chi tiết cho doanh nghiệp của bạn.
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border-soft bg-surface p-6 md:p-8">
              <BookingForm
                solutions={solutions.map(({ id, title }) => ({ id, title }))}
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
