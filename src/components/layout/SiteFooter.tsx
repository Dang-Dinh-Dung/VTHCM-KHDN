import Link from 'next/link'
import { Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'

import { Container } from '@/components/ui/primitives'
import { PILLARS } from '@/lib/taxonomy'
import type { SiteSetting } from '@/payload-types'

const SOCIAL_LABEL: Record<string, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  zalo: 'Zalo',
  tiktok: 'TikTok',
}

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  return (
    <footer className="mt-10 border-t-2 border-viettel-red bg-surface text-ink-soft">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-viettel-red text-lg font-black text-white">
                V
              </span>
              <span className="text-sm font-extrabold text-ink">Viettel KHDN Hồ Chí Minh</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              {settings.departmentName ?? 'Phòng Khách hàng Doanh nghiệp - Viettel Hồ Chí Minh'}
            </p>
            {settings.footerNote && <p className="mt-3 text-xs text-ink-soft/80">{settings.footerNote}</p>}
          </div>

          {/* Tru cot */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">Hệ sinh thái</h3>
            <ul className="space-y-2 text-sm">
              {PILLARS.map((p) => (
                <li key={p.value}>
                  <Link href={`/giai-phap?pillar=${p.value}`} className="text-ink-soft hover:text-viettel-red">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lien ket */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">Khám phá</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/giai-phap" className="text-ink-soft hover:text-viettel-red">Tất cả giải pháp</Link></li>
              <li><Link href="/tim-giai-phap" className="text-ink-soft hover:text-viettel-red">Tìm giải pháp phù hợp</Link></li>
              <li><Link href="/bang-gia" className="text-ink-soft hover:text-viettel-red">Bảng giá</Link></li>
              <li><Link href="/tin-tuc" className="text-ink-soft hover:text-viettel-red">Tin tức</Link></li>
              <li><Link href="/chinh-sach" className="text-ink-soft hover:text-viettel-red">Nghị định & chính sách</Link></li>
              <li><Link href="/dat-lich" className="text-ink-soft hover:text-viettel-red">Đặt lịch tư vấn</Link></li>
            </ul>
          </div>

          {/* Lien he */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">Liên hệ</h3>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {settings.hotline && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-viettel-red" aria-hidden />
                  <a href={`tel:${settings.hotline.replace(/[^0-9+]/g, '')}`} className="font-bold text-ink">
                    {settings.hotline}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-viettel-red" aria-hidden />
                  <a href={`mailto:${settings.email}`} className="text-ink hover:text-viettel-red hover:underline">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-viettel-red" aria-hidden />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.workingHours && (
                <li className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-viettel-red" aria-hidden />
                  <span>{settings.workingHours}</span>
                </li>
              )}
            </ul>
            {settings.socials && settings.socials.length > 0 && (
              <div className="mt-4 flex gap-2">
                {settings.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABEL[s.platform ?? ''] ?? 'Mạng xã hội'}
                    title={SOCIAL_LABEL[s.platform ?? ''] ?? 'Mạng xã hội'}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft bg-surface-muted text-ink-soft transition-colors hover:bg-viettel-red hover:text-white"
                  >
                    <Globe className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border-soft pt-6 text-center text-xs text-ink-soft/70">
          {settings.copyright ?? '© Viettel Telecom - KHDN Hồ Chí Minh'}
        </div>
      </Container>
    </footer>
  )
}
