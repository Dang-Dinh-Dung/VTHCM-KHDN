import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import React from 'react'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { FloatingZalo } from '@/components/layout/FloatingZalo'
import { getSiteSettings } from '@/lib/queries'
import './globals.css'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam',
})

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(serverUrl),
  title: {
    default: 'KHDN Viettel Hồ Chí Minh | Giải pháp chuyển đổi số doanh nghiệp',
    template: '%s | KHDN Viettel HCM',
  },
  description:
    'Khám phá hệ sinh thái giải pháp chuyển đổi số toàn diện cho doanh nghiệp từ Viettel HCM: viễn thông, chữ ký số, hóa đơn điện tử, cloud, quản trị doanh nghiệp. Tra cứu gói giá & đặt lịch tư vấn/demo.',
  keywords: [
    'Viettel doanh nghiệp',
    'chuyển đổi số',
    'chữ ký số',
    'hóa đơn điện tử',
    'Viettel Cloud',
    'KHDN Viettel Hồ Chí Minh',
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'KHDN Viettel Hồ Chí Minh',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSiteSettings()

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.departmentName ?? 'KHDN Viettel Hồ Chí Minh',
    url: serverUrl,
    ...(settings.hotline
      ? { contactPoint: { '@type': 'ContactPoint', telephone: settings.hotline, contactType: 'sales', areaServed: 'VN' } }
      : {}),
    ...(settings.address ? { address: settings.address } : {}),
  }

  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-viettel-red focus:px-4 focus:py-2 focus:text-white"
        >
          Bỏ qua tới nội dung chính
        </a>
        <SiteHeader
          hotline={settings.hotline}
          email={settings.email}
          departmentName={settings.departmentName}
          logoUrl={
            settings.logo && typeof settings.logo === 'object' && 'url' in settings.logo
              ? (settings.logo.url ?? undefined)
              : undefined
          }
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
        <FloatingZalo zaloOaUrl={settings.zaloOaUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {umamiUrl && umamiId && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script defer src={umamiUrl} data-website-id={umamiId} />
        )}
      </body>
    </html>
  )
}
