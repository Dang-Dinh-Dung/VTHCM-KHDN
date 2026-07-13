# i18n Giai đoạn 1 (Hạ tầng) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Người dùng bấm được nút `VI | EN | 中文` trên header để chuyển ngôn ngữ toàn site; URL đổi thành `/`, `/en/...`, `/zh/...`; chữ giao diện chung (menu, footer, nút, nhãn taxonomy) hiển thị đúng ngôn ngữ.

**Architecture:** Dùng `next-intl` với `localePrefix: 'as-needed'` (VI không tiền tố). Toàn bộ cây route công khai chuyển vào segment `src/app/(frontend)/[locale]/`. Middleware của next-intl **loại trừ** `/admin`, `/api`, `/_next` và mọi đường dẫn có dấu chấm để không phá Payload admin/API và `sitemap.xml`/`robots.txt`. Chữ giao diện đọc từ `messages/{vi,en,zh}.json`.

**Tech Stack:** Next.js 16.2.9 (App Router), Payload CMS 3.85.1, next-intl v4, TypeScript, Tailwind v4.

## Global Constraints

- **KHÔNG đụng database ở giai đoạn này.** Không thêm/sửa field Payload, không chạy `push-schema.ts`. Nội dung CMS vẫn hiển thị tiếng Việt ở mọi locale (giai đoạn 2 mới xử lý).
- **KHÔNG sửa `src/lib/taxonomy.ts`** để bỏ `label`. File này là options cho Payload admin — bỏ label sẽ vỡ admin. Nhãn tiếng Việt trong đó là **nguồn fallback VI**; bản dịch EN/ZH nằm trong từ điển, tra theo `value`.
- **KHÔNG commit `src/app/(payload)/admin/importMap.js`** nếu nó bị xoá dòng `S3ClientUploadHandler` (lỗi cũ làm trắng admin trên Vercel/IDC). Nếu file này bị đổi, chạy `git checkout -- "src/app/(payload)/admin/importMap.js"` trước khi commit.
- Locales: `['vi', 'en', 'zh']`, mặc định `vi`. Nhãn hiển thị trên nút: `VI`, `EN`, `中文`.
- Windows: mọi lệnh npm/npx chạy trong Git Bash phải nạp PATH trước: `export PATH="/c/Program Files/nodejs:$PATH"`.
- Repo **không có test framework**. Verify bằng: `npx tsc --noEmit`, `npm run lint`, và `curl` vào dev server đang chạy.

---

### Task 1: Cài next-intl + cấu hình routing/request + từ điển rỗng

Chưa đổi hành vi site. Kết thúc task này app vẫn chạy y như cũ, chỉ là đã có sẵn hạ tầng cấu hình.

**Files:**
- Modify: `package.json` (thêm dependency)
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `messages/vi.json`
- Create: `messages/en.json`
- Create: `messages/zh.json`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `routing` (object có `locales: readonly ['vi','en','zh']`, `defaultLocale: 'vi'`), và từ `src/i18n/navigation.ts`: `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. Các task sau import từ 2 file này.

- [ ] **Step 1: Cài next-intl**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm install next-intl
```

- [ ] **Step 2: Tạo `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en', 'zh'],
  defaultLocale: 'vi',
  // VI khong co tien to (/gia-phap), EN/ZH co (/en/..., /zh/...)
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]

/** Nhan hien thi tren nut chuyen ngon ngu */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  vi: 'VI',
  en: 'EN',
  zh: '中文',
}
```

- [ ] **Step 3: Tạo `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// Dung cac API nay THAY CHO next/link va next/navigation o moi trang cong khai,
// de dieu huong noi bo tu dong giu nguyen ngon ngu hien tai.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

- [ ] **Step 4: Tạo `src/i18n/request.ts`**

```ts
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 5: Tạo 3 file từ điển (mới chỉ 1 key để kiểm tra hạ tầng)**

`messages/vi.json`:
```json
{
  "common": {
    "languageSwitcherLabel": "Ngôn ngữ"
  }
}
```

`messages/en.json`:
```json
{
  "common": {
    "languageSwitcherLabel": "Language"
  }
}
```

`messages/zh.json`:
```json
{
  "common": {
    "languageSwitcherLabel": "语言"
  }
}
```

- [ ] **Step 6: Bọc `next.config.ts` bằng plugin next-intl**

Thay toàn bộ nội dung `next.config.ts`:

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Standalone cho Docker (Viettel IDC); tren Vercel bo di de build sach.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
```

- [ ] **Step 7: Verify — typecheck sạch và site cũ vẫn chạy**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx tsc --noEmit
```
Expected: không in ra lỗi nào.

```bash
npm run dev
# doi den khi thay "Ready", roi o terminal khac:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/bang-gia
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin
```
Expected: cả 3 đều in `200`. (Chưa có middleware nên routing chưa đổi — đúng như mong đợi.)

- [ ] **Step 8: Commit**

```bash
git checkout -- "src/app/(payload)/admin/importMap.js" 2>/dev/null
git add package.json package-lock.json next.config.ts src/i18n messages
git commit -m "feat(i18n): cai next-intl + cau hinh routing/request + tu dien rong"
```

---

### Task 2: Chuyển cây route sang `[locale]` + middleware

**Đây là task rủi ro nhất.** Nếu matcher middleware sai, `/admin` hoặc `/api` của Payload sẽ hỏng. Bước verify bắt buộc phải kiểm tra cả hai.

**Files:**
- Move: `src/app/(frontend)/page.tsx` → `src/app/(frontend)/[locale]/page.tsx`
- Move: `src/app/(frontend)/bang-gia/page.tsx` → `src/app/(frontend)/[locale]/bang-gia/page.tsx`
- Move: `src/app/(frontend)/giai-phap/page.tsx` → `src/app/(frontend)/[locale]/giai-phap/page.tsx`
- Move: `src/app/(frontend)/giai-phap/[slug]/page.tsx` → `src/app/(frontend)/[locale]/giai-phap/[slug]/page.tsx`
- Move: `src/app/(frontend)/tim-giai-phap/page.tsx` → `src/app/(frontend)/[locale]/tim-giai-phap/page.tsx`
- Move: `src/app/(frontend)/tin-tuc/page.tsx` → `src/app/(frontend)/[locale]/tin-tuc/page.tsx`
- Move: `src/app/(frontend)/tin-tuc/[slug]/page.tsx` → `src/app/(frontend)/[locale]/tin-tuc/[slug]/page.tsx`
- Move: `src/app/(frontend)/chinh-sach/page.tsx` → `src/app/(frontend)/[locale]/chinh-sach/page.tsx`
- Move: `src/app/(frontend)/chinh-sach/[slug]/page.tsx` → `src/app/(frontend)/[locale]/chinh-sach/[slug]/page.tsx`
- Move: `src/app/(frontend)/dat-lich/page.tsx` → `src/app/(frontend)/[locale]/dat-lich/page.tsx`
- Move: `src/app/(frontend)/lien-he/page.tsx` → `src/app/(frontend)/[locale]/lien-he/page.tsx`
- Move + Modify: `src/app/(frontend)/layout.tsx` → `src/app/(frontend)/[locale]/layout.tsx`
- Move: `src/app/(frontend)/globals.css` → giữ nguyên vị trí nếu import bằng đường dẫn tương đối; nếu layout đổi chỗ thì sửa import thành `../globals.css`
- Create: `src/middleware.ts`

**Interfaces:**
- Consumes: `routing` từ `src/i18n/routing.ts` (Task 1).
- Produces: mọi page nhận thêm param `locale` qua `params: Promise<{ locale: string }>` (các task/giai đoạn sau dùng để lấy nội dung theo ngôn ngữ).

- [ ] **Step 1: Di chuyển toàn bộ cây route công khai vào `[locale]`**

```bash
cd "d:/Viettel/KHDN Landing page"
mkdir -p "src/app/(frontend)/[locale]"
git mv "src/app/(frontend)/page.tsx"           "src/app/(frontend)/[locale]/page.tsx"
git mv "src/app/(frontend)/layout.tsx"         "src/app/(frontend)/[locale]/layout.tsx"
git mv "src/app/(frontend)/bang-gia"           "src/app/(frontend)/[locale]/bang-gia"
git mv "src/app/(frontend)/giai-phap"          "src/app/(frontend)/[locale]/giai-phap"
git mv "src/app/(frontend)/tim-giai-phap"      "src/app/(frontend)/[locale]/tim-giai-phap"
git mv "src/app/(frontend)/tin-tuc"            "src/app/(frontend)/[locale]/tin-tuc"
git mv "src/app/(frontend)/chinh-sach"         "src/app/(frontend)/[locale]/chinh-sach"
git mv "src/app/(frontend)/dat-lich"           "src/app/(frontend)/[locale]/dat-lich"
git mv "src/app/(frontend)/lien-he"            "src/app/(frontend)/[locale]/lien-he"
```

Sau đó liệt kê để xác nhận `globals.css` nằm ở đâu:
```bash
ls "src/app/(frontend)"
```
Nếu `globals.css` vẫn ở `src/app/(frontend)/globals.css`, sửa dòng import trong `[locale]/layout.tsx` từ `import './globals.css'` thành `import '../globals.css'`.

- [ ] **Step 2: Sửa `src/app/(frontend)/[locale]/layout.tsx` thành root layout theo locale**

Đây là root layout của nhóm `(frontend)` → **bắt buộc chứa `<html>` và `<body>`**. Nội dung mới (giữ nguyên phần metadata, JSON-LD, Umami đang có; chỉ thêm phần locale):

```tsx
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { FloatingZalo } from '@/components/layout/FloatingZalo'
import { routing } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/queries'
import '../globals.css'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam',
})

export const dynamic = 'force-dynamic'

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
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

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
    <html lang={locale} className={beVietnam.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
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
```

- [ ] **Step 3: Tạo `src/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Bo qua: /api va /admin cua Payload, noi bo Next (_next, _vercel),
  // va moi duong dan co dau cham (sitemap.xml, robots.txt, favicon, anh...).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: Verify — routing 3 ngôn ngữ VÀ Payload còn nguyên vẹn**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx tsc --noEmit
```
Expected: không lỗi.

Chạy dev server rồi kiểm tra:
```bash
npm run dev
# terminal khac, doi "Ready":
echo "--- Trang cong khai 3 ngon ngu ---"
for u in / /bang-gia /giai-phap /en /en/bang-gia /zh /zh/bang-gia; do
  printf "%-18s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$u)"
done
echo "--- PAYLOAD (KHONG DUOC HONG) ---"
for u in /admin /api/solutions /sitemap.xml /robots.txt; do
  printf "%-18s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$u)"
done
```
Expected: **tất cả in `200`**.
Nếu `/admin` hoặc `/api/solutions` không phải `200` → matcher sai, sửa lại `config.matcher` trước khi đi tiếp. **Không được commit khi chưa đạt.**

Kiểm tra thêm `<html lang>` đổi theo locale:
```bash
curl -s http://localhost:3000/     | grep -o '<html lang="[a-z]*"' | head -1
curl -s http://localhost:3000/en   | grep -o '<html lang="[a-z]*"' | head -1
curl -s http://localhost:3000/zh   | grep -o '<html lang="[a-z]*"' | head -1
```
Expected: lần lượt `<html lang="vi"`, `<html lang="en"`, `<html lang="zh"`.

- [ ] **Step 5: Commit**

```bash
git checkout -- "src/app/(payload)/admin/importMap.js" 2>/dev/null
git add -A "src/app/(frontend)" src/middleware.ts
git commit -m "feat(i18n): chuyen cay route cong khai sang [locale] + middleware next-intl"
```

---

### Task 3: Nút chuyển ngôn ngữ VI | EN | 中文

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `src/components/layout/SiteHeader.tsx` (gắn vào cả thanh desktop và menu mobile)

**Interfaces:**
- Consumes: `routing`, `LOCALE_LABELS` từ `src/i18n/routing.ts`; `Link`, `usePathname` từ `src/i18n/navigation.ts`.
- Produces: component `<LanguageSwitcher />` (không nhận prop).

- [ ] **Step 1: Tạo `src/components/layout/LanguageSwitcher.tsx`**

Dùng `usePathname` của next-intl (trả về đường dẫn **đã bỏ tiền tố locale**) + `Link` của next-intl (tự thêm tiền tố đúng) → bấm đổi ngôn ngữ **giữ nguyên trang đang xem**.

```tsx
'use client'

import { useLocale } from 'next-intl'

import { cn } from '@/lib/cn'
import { Link, usePathname } from '@/i18n/navigation'
import { LOCALE_LABELS, routing, type AppLocale } from '@/i18n/routing'

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const active = useLocale()

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-full bg-surface-muted p-0.5', className)}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
              isActive
                ? 'bg-viettel-red text-white'
                : 'text-ink-soft hover:bg-surface hover:text-viettel-red',
            )}
          >
            {LOCALE_LABELS[locale as AppLocale]}
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Gắn vào `SiteHeader` — thanh desktop**

Trong `src/components/layout/SiteHeader.tsx`, thêm import:
```tsx
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
```

Rồi trong khối desktop, chèn `<LanguageSwitcher />` **ngay trước** link hotline. Thay đoạn:
```tsx
          <div className="hidden items-center gap-2 lg:flex">
            {hotline && (
```
thành:
```tsx
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {hotline && (
```

- [ ] **Step 3: Gắn vào `SiteHeader` — menu mobile**

Trong khối menu mobile, thêm `<LanguageSwitcher />` ở cuối `<nav>`. Thay đoạn:
```tsx
              {hotline && (
                <a href={telHref} className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-viettel-red">
                  <Phone className="h-4 w-4" aria-hidden /> Hotline: {hotline}
                </a>
              )}
            </nav>
```
thành:
```tsx
              {hotline && (
                <a href={telHref} className="mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-viettel-red">
                  <Phone className="h-4 w-4" aria-hidden /> Hotline: {hotline}
                </a>
              )}
              <LanguageSwitcher className="mt-2 self-center" />
            </nav>
```

- [ ] **Step 4: Đổi `next/link` → `Link` của next-intl trong `SiteHeader`**

Để mọi link trên header **giữ nguyên ngôn ngữ** khi điều hướng. Trong `SiteHeader.tsx` thay dòng import:
```tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
```
thành:
```tsx
import { Link, usePathname } from '@/i18n/navigation'
```
(Phần còn lại của file giữ nguyên — API `usePathname()` và `<Link href=...>` dùng y hệt.)

- [ ] **Step 5: Verify — bấm chuyển ngôn ngữ giữ nguyên trang**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx tsc --noEmit
npm run lint
```
Expected: không lỗi.

Chạy dev server và kiểm tra nút xuất hiện + link trỏ đúng:
```bash
# Tren trang Bang gia tieng Viet, nut EN phai tro toi /en/bang-gia
curl -s http://localhost:3000/bang-gia | grep -o 'href="/en/bang-gia"' | head -1
curl -s http://localhost:3000/bang-gia | grep -o 'href="/zh/bang-gia"' | head -1
# Tren trang tieng Anh, nut VI phai tro ve /bang-gia (khong tien to)
curl -s http://localhost:3000/en/bang-gia | grep -o 'href="/bang-gia"' | head -1
```
Expected: in ra lần lượt `href="/en/bang-gia"`, `href="/zh/bang-gia"`, `href="/bang-gia"`.

- [ ] **Step 6: Commit**

```bash
git checkout -- "src/app/(payload)/admin/importMap.js" 2>/dev/null
git add src/components/layout/LanguageSwitcher.tsx src/components/layout/SiteHeader.tsx
git commit -m "feat(i18n): nut chuyen ngon ngu VI|EN|中文 tren header (desktop + mobile)"
```

---

### Task 4: Dịch chữ menu + header + footer bằng từ điển

**Files:**
- Modify: `messages/vi.json`, `messages/en.json`, `messages/zh.json`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`

**Interfaces:**
- Consumes: `NextIntlClientProvider` đã bọc ở layout (Task 2).
- Produces: namespace từ điển `nav.*`, `header.*`, `footer.*` — task 5 và các giai đoạn sau thêm namespace mới, **không sửa các key này**.

- [ ] **Step 1: Bổ sung key vào 3 file từ điển**

`messages/vi.json` (thay toàn bộ):
```json
{
  "common": {
    "languageSwitcherLabel": "Ngôn ngữ",
    "skipToContent": "Bỏ qua tới nội dung chính"
  },
  "nav": {
    "solutions": "Giải pháp",
    "finder": "Tìm giải pháp",
    "pricing": "Bảng giá",
    "news": "Tin tức",
    "policies": "Nghị định & chính sách",
    "contact": "Liên hệ",
    "ariaMain": "Điều hướng chính",
    "ariaMobile": "Điều hướng di động",
    "openMenu": "Mở menu",
    "closeMenu": "Đóng menu"
  },
  "header": {
    "cta": "Đăng ký tư vấn",
    "hotline": "Hotline"
  },
  "footer": {
    "quickLinks": "Liên kết nhanh",
    "contactInfo": "Thông tin liên hệ",
    "followUs": "Theo dõi chúng tôi"
  }
}
```

`messages/en.json` (thay toàn bộ):
```json
{
  "common": {
    "languageSwitcherLabel": "Language",
    "skipToContent": "Skip to main content"
  },
  "nav": {
    "solutions": "Solutions",
    "finder": "Find a solution",
    "pricing": "Pricing",
    "news": "News",
    "policies": "Regulations & policies",
    "contact": "Contact",
    "ariaMain": "Main navigation",
    "ariaMobile": "Mobile navigation",
    "openMenu": "Open menu",
    "closeMenu": "Close menu"
  },
  "header": {
    "cta": "Request a consultation",
    "hotline": "Hotline"
  },
  "footer": {
    "quickLinks": "Quick links",
    "contactInfo": "Contact information",
    "followUs": "Follow us"
  }
}
```

`messages/zh.json` (thay toàn bộ):
```json
{
  "common": {
    "languageSwitcherLabel": "语言",
    "skipToContent": "跳转到主要内容"
  },
  "nav": {
    "solutions": "解决方案",
    "finder": "寻找方案",
    "pricing": "价格表",
    "news": "新闻",
    "policies": "法规与政策",
    "contact": "联系我们",
    "ariaMain": "主导航",
    "ariaMobile": "移动端导航",
    "openMenu": "打开菜单",
    "closeMenu": "关闭菜单"
  },
  "header": {
    "cta": "预约咨询",
    "hotline": "热线"
  },
  "footer": {
    "quickLinks": "快速链接",
    "contactInfo": "联系方式",
    "followUs": "关注我们"
  }
}
```

- [ ] **Step 2: Dùng `useTranslations` trong `SiteHeader`**

Trong `src/components/layout/SiteHeader.tsx`:

Thêm import:
```tsx
import { useTranslations } from 'next-intl'
```

Đổi hằng `NAV` từ chứa `label` sang chứa **key**:
```tsx
const NAV = [
  { href: '/giai-phap', key: 'solutions' },
  { href: '/tim-giai-phap', key: 'finder' },
  { href: '/bang-gia', key: 'pricing' },
  { href: '/tin-tuc', key: 'news' },
  { href: '/chinh-sach', key: 'policies' },
  { href: '/lien-he', key: 'contact' },
] as const
```

Trong thân component, thêm ngay sau `const [open, setOpen] = useState(false)`:
```tsx
  const t = useTranslations('nav')
  const tHeader = useTranslations('header')
```

Rồi thay các chỗ hiển thị chữ:
- `{item.label}` → `{t(item.key)}` (cả 2 chỗ: nav desktop và menu mobile)
- `aria-label="Điều hướng chính"` → `aria-label={t('ariaMain')}`
- `aria-label="Điều hướng di động"` → `aria-label={t('ariaMobile')}`
- `aria-label={open ? 'Đóng menu' : 'Mở menu'}` → `aria-label={open ? t('closeMenu') : t('openMenu')}`
- Hai chỗ chữ `Đăng ký tư vấn` → `{tHeader('cta')}`
- `Hotline: {hotline}` → `{tHeader('hotline')}: {hotline}`

- [ ] **Step 3: Dùng `useTranslations` / `getTranslations` trong `SiteFooter`**

Mở `src/components/layout/SiteFooter.tsx`, thay mọi tiêu đề cột và chữ tĩnh bằng key tương ứng trong namespace `footer` (`quickLinks`, `contactInfo`, `followUs`) và các mục menu bằng namespace `nav`.

- Nếu file là **client component** (`'use client'`): dùng `const t = useTranslations('footer')` từ `next-intl`.
- Nếu là **server component**: dùng `const t = await getTranslations('footer')` từ `next-intl/server`.

Đồng thời đổi mọi `import Link from 'next/link'` trong file thành `import { Link } from '@/i18n/navigation'` để link footer giữ nguyên ngôn ngữ.

> Không dịch các giá trị đến từ CMS (`departmentName`, `address`, `copyright`, `footerNote`) — chúng thuộc giai đoạn 2.

- [ ] **Step 4: Sửa chữ "Bỏ qua tới nội dung chính" trong layout**

Trong `src/app/(frontend)/[locale]/layout.tsx`, thêm import:
```tsx
import { getTranslations } from 'next-intl/server'
```
Trong thân `LocaleLayout`, sau dòng `const settings = await getSiteSettings()`:
```tsx
  const t = await getTranslations('common')
```
Rồi thay chữ trong thẻ `<a href="#main-content">` thành `{t('skipToContent')}`.

- [ ] **Step 5: Verify — chữ đổi theo ngôn ngữ**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx tsc --noEmit
npm run lint
```
Expected: không lỗi.

```bash
# Menu tieng Viet
curl -s http://localhost:3000/          | grep -c 'Bảng giá'
# Menu tieng Anh -> phai co "Pricing", KHONG con "Bảng giá"
curl -s http://localhost:3000/en        | grep -c 'Pricing'
curl -s http://localhost:3000/en        | grep -c 'Bảng giá'
# Menu tieng Trung
curl -s http://localhost:3000/zh        | grep -c '价格表'
```
Expected: lần lượt `>=1`, `>=1`, **`0`**, `>=1`.
(Số 0 ở dòng thứ 3 chứng minh menu tiếng Anh không còn sót chữ Việt.)

- [ ] **Step 6: Commit**

```bash
git checkout -- "src/app/(payload)/admin/importMap.js" 2>/dev/null
git add messages src/components/layout/SiteHeader.tsx src/components/layout/SiteFooter.tsx "src/app/(frontend)/[locale]/layout.tsx"
git commit -m "feat(i18n): dich menu, header, footer sang EN/ZH bang tu dien"
```

---

### Task 5: Dịch nhãn taxonomy (trụ cột, ngành, nhu cầu, quy mô, loại tin/văn bản)

`src/lib/taxonomy.ts` **giữ nguyên** (admin Payload cần `label` tiếng Việt). Ta thêm một lớp tra cứu: có bản dịch thì dùng, **không có thì lùi về label tiếng Việt**.

**Files:**
- Modify: `messages/vi.json`, `messages/en.json`, `messages/zh.json` (thêm namespace `taxonomy`)
- Create: `src/lib/taxonomy-i18n.ts`
- Modify: các component hiển thị nhãn taxonomy ở frontend (xem Step 3)

**Interfaces:**
- Consumes: `Option`, các mảng taxonomy từ `src/lib/taxonomy.ts`; hàm `useTranslations`/`getTranslations` của next-intl.
- Produces:
  - `taxonomyLabel(t: TaxT, group: TaxonomyGroup, value: string | null | undefined, fallbackList: Option[]): string`
  - `type TaxonomyGroup = 'pillars' | 'industries' | 'needs' | 'companySizes' | 'newsCategories' | 'policyTypes'`
  - `type TaxT = (key: string) => string`

- [ ] **Step 1: Thêm namespace `taxonomy` vào 3 file từ điển**

Thêm khối sau vào **`messages/vi.json`** (giữ nguyên các khối đã có):
```json
  "taxonomy": {
    "pillars": {
      "vien-thong": "Viễn thông",
      "chuyen-doi-so": "Chuyển đổi số",
      "data-center-an-ninh-mang": "Data Center & An ninh mạng",
      "quan-tri-doanh-nghiep": "Quản trị doanh nghiệp",
      "logistics-van-tai-nang-luong": "Logistics - Vận tải - Năng lượng",
      "san-pham-hop-tac": "Sản phẩm hợp tác"
    },
    "industries": {
      "ban-le-thuong-mai": "Bán lẻ & thương mại",
      "f-and-b": "Nhà hàng - F&B",
      "san-xuat": "Sản xuất",
      "van-tai-logistics": "Vận tải & logistics",
      "giao-duc": "Giáo dục & đào tạo",
      "y-te": "Y tế & dược",
      "tai-chinh-ngan-hang": "Tài chính & ngân hàng",
      "xay-dung-bat-dong-san": "Xây dựng & bất động sản",
      "dich-vu": "Dịch vụ chuyên nghiệp",
      "nong-nghiep": "Nông nghiệp",
      "da-nganh": "Đa ngành / Khác"
    },
    "needs": {
      "vien-thong-ket-noi": "Viễn thông & kết nối",
      "van-phong-so": "Văn phòng số & cộng tác",
      "hoa-don-ke-toan-chu-ky-so": "Hóa đơn - kế toán - chữ ký số",
      "ban-hang-marketing": "Bán hàng & marketing",
      "nhan-su-bao-hiem": "Nhân sự & bảo hiểm xã hội",
      "cloud-ha-tang": "Cloud & hạ tầng",
      "an-ninh-mang": "An ninh mạng",
      "logistics-van-tai": "Logistics & vận tải"
    },
    "companySizes": {
      "sieu-nho": "Siêu nhỏ (dưới 10 nhân sự)",
      "nho": "Nhỏ (10 - 50 nhân sự)",
      "vua": "Vừa (50 - 200 nhân sự)",
      "lon": "Lớn (trên 200 nhân sự)"
    },
    "newsCategories": {
      "tin-viettel": "Tin Viettel",
      "chuyen-doi-so": "Chuyển đổi số",
      "khuyen-mai": "Khuyến mãi",
      "su-kien": "Sự kiện"
    },
    "policyTypes": {
      "luat": "Luật",
      "nghi-dinh": "Nghị định",
      "thong-tu": "Thông tư",
      "quyet-dinh": "Quyết định",
      "cong-van": "Công văn"
    }
  }
```

Thêm khối tương ứng vào **`messages/en.json`**:
```json
  "taxonomy": {
    "pillars": {
      "vien-thong": "Telecommunications",
      "chuyen-doi-so": "Digital transformation",
      "data-center-an-ninh-mang": "Data Center & Cybersecurity",
      "quan-tri-doanh-nghiep": "Business management",
      "logistics-van-tai-nang-luong": "Logistics - Transport - Energy",
      "san-pham-hop-tac": "Partner products"
    },
    "industries": {
      "ban-le-thuong-mai": "Retail & commerce",
      "f-and-b": "Restaurants - F&B",
      "san-xuat": "Manufacturing",
      "van-tai-logistics": "Transport & logistics",
      "giao-duc": "Education & training",
      "y-te": "Healthcare & pharma",
      "tai-chinh-ngan-hang": "Finance & banking",
      "xay-dung-bat-dong-san": "Construction & real estate",
      "dich-vu": "Professional services",
      "nong-nghiep": "Agriculture",
      "da-nganh": "Multi-industry / Other"
    },
    "needs": {
      "vien-thong-ket-noi": "Telecom & connectivity",
      "van-phong-so": "Digital office & collaboration",
      "hoa-don-ke-toan-chu-ky-so": "E-invoice - accounting - digital signature",
      "ban-hang-marketing": "Sales & marketing",
      "nhan-su-bao-hiem": "HR & social insurance",
      "cloud-ha-tang": "Cloud & infrastructure",
      "an-ninh-mang": "Cybersecurity",
      "logistics-van-tai": "Logistics & transport"
    },
    "companySizes": {
      "sieu-nho": "Micro (under 10 staff)",
      "nho": "Small (10 - 50 staff)",
      "vua": "Medium (50 - 200 staff)",
      "lon": "Large (over 200 staff)"
    },
    "newsCategories": {
      "tin-viettel": "Viettel news",
      "chuyen-doi-so": "Digital transformation",
      "khuyen-mai": "Promotions",
      "su-kien": "Events"
    },
    "policyTypes": {
      "luat": "Law",
      "nghi-dinh": "Decree",
      "thong-tu": "Circular",
      "quyet-dinh": "Decision",
      "cong-van": "Official dispatch"
    }
  }
```

Thêm khối tương ứng vào **`messages/zh.json`**:
```json
  "taxonomy": {
    "pillars": {
      "vien-thong": "电信",
      "chuyen-doi-so": "数字化转型",
      "data-center-an-ninh-mang": "数据中心与网络安全",
      "quan-tri-doanh-nghiep": "企业管理",
      "logistics-van-tai-nang-luong": "物流 - 运输 - 能源",
      "san-pham-hop-tac": "合作产品"
    },
    "industries": {
      "ban-le-thuong-mai": "零售与贸易",
      "f-and-b": "餐饮 - F&B",
      "san-xuat": "制造业",
      "van-tai-logistics": "运输与物流",
      "giao-duc": "教育与培训",
      "y-te": "医疗与制药",
      "tai-chinh-ngan-hang": "金融与银行",
      "xay-dung-bat-dong-san": "建筑与房地产",
      "dich-vu": "专业服务",
      "nong-nghiep": "农业",
      "da-nganh": "多行业 / 其他"
    },
    "needs": {
      "vien-thong-ket-noi": "电信与连接",
      "van-phong-so": "数字办公与协作",
      "hoa-don-ke-toan-chu-ky-so": "电子发票 - 会计 - 数字签名",
      "ban-hang-marketing": "销售与营销",
      "nhan-su-bao-hiem": "人力资源与社保",
      "cloud-ha-tang": "云与基础设施",
      "an-ninh-mang": "网络安全",
      "logistics-van-tai": "物流与运输"
    },
    "companySizes": {
      "sieu-nho": "微型（10 人以下）",
      "nho": "小型（10 - 50 人）",
      "vua": "中型（50 - 200 人）",
      "lon": "大型（200 人以上）"
    },
    "newsCategories": {
      "tin-viettel": "Viettel 新闻",
      "chuyen-doi-so": "数字化转型",
      "khuyen-mai": "促销活动",
      "su-kien": "活动"
    },
    "policyTypes": {
      "luat": "法律",
      "nghi-dinh": "法令",
      "thong-tu": "通知",
      "quyet-dinh": "决定",
      "cong-van": "公函"
    }
  }
```

- [ ] **Step 2: Tạo `src/lib/taxonomy-i18n.ts`**

```ts
/**
 * Tra nhan taxonomy theo ngon ngu hien tai.
 * taxonomy.ts GIU NGUYEN label tieng Viet (Payload admin can) -> dung lam fallback.
 */
import type { Option } from '@/lib/taxonomy'

export type TaxonomyGroup =
  | 'pillars'
  | 'industries'
  | 'needs'
  | 'companySizes'
  | 'newsCategories'
  | 'policyTypes'

/** Ham dich cua next-intl: useTranslations('taxonomy') hoac getTranslations('taxonomy') */
export type TaxT = (key: string) => string

export function taxonomyLabel(
  t: TaxT,
  group: TaxonomyGroup,
  value: string | null | undefined,
  fallbackList: Option[],
): string {
  if (!value) return ''
  const viLabel = fallbackList.find((o) => o.value === value)?.label ?? value
  try {
    const translated = t(`${group}.${value}`)
    // next-intl tra ve chinh key khi thieu ban dich -> coi nhu chua dich, lui ve VI
    return translated === `${group}.${value}` ? viLabel : translated
  } catch {
    return viLabel
  }
}
```

- [ ] **Step 3: Áp dụng ở các component hiển thị nhãn taxonomy**

**Danh sách file phải sửa** (đã rà sẵn — chỉ các file render nhãn taxonomy ở **frontend**):

| File | Taxonomy dùng | Loại component |
|---|---|---|
| `src/app/(frontend)/[locale]/giai-phap/page.tsx` | `PILLARS`, `INDUSTRIES`, `NEEDS`, `COMPANY_SIZES` | server |
| `src/app/(frontend)/[locale]/giai-phap/[slug]/page.tsx` | `PILLARS` | server |
| `src/app/(frontend)/[locale]/tin-tuc/page.tsx` | `NEWS_CATEGORIES` | server |
| `src/app/(frontend)/[locale]/tin-tuc/[slug]/page.tsx` | `NEWS_CATEGORIES` | server |
| `src/app/(frontend)/[locale]/chinh-sach/[slug]/page.tsx` | `POLICY_TYPES` | server |
| `src/components/solutions/PricingExplorer.tsx` | `PILLARS` | client |
| `src/components/solutions/SolutionsExplorer.tsx` | `PILLARS` | client |
| `src/components/solutions/SolutionFinder.tsx` | `INDUSTRIES`, `NEEDS`, `COMPANY_SIZES` | client |
| `src/components/solutions/SolutionFilters.tsx` | `PILLARS`, `INDUSTRIES`, `NEEDS`, `COMPANY_SIZES` | client |
| `src/components/solutions/SolutionCard.tsx` | `PILLARS` | server/client (theo file) |
| `src/components/solutions/SolutionsKanban.tsx` | `PILLARS` | theo file |
| `src/components/content/ContentCards.tsx` | `NEWS_CATEGORIES`, `POLICY_TYPES` | server |
| `src/components/content/PolicyRow.tsx` | `POLICY_TYPES` | theo file |
| `src/components/content/PolicyFilters.tsx` | `POLICY_TYPES` | client |
| `src/components/home/EcosystemDiagram.tsx` | `PILLARS` | client |

> ⛔ **KHÔNG sửa `src/components/admin/AdminLeadDashboard.tsx`** — đây là giao diện **admin**, phải giữ tiếng Việt.
> ⛔ **KHÔNG sửa `src/lib/taxonomy.ts`** và **`src/collections/*`** — admin Payload vẫn dùng label tiếng Việt.

Với **mỗi** file trên, thay `labelOf(LIST, value)` bằng `taxonomyLabel(t, '<group>', value, LIST)`, trong đó:

| `LIST` | `<group>` |
|---|---|
| `PILLARS` | `'pillars'` |
| `INDUSTRIES` | `'industries'` |
| `NEEDS` | `'needs'` |
| `COMPANY_SIZES` | `'companySizes'` |
| `NEWS_CATEGORIES` | `'newsCategories'` |
| `POLICY_TYPES` | `'policyTypes'` |

Lấy `t` như sau:
- Server component: `const t = await getTranslations('taxonomy')` (từ `next-intl/server`)
- Client component: `const t = useTranslations('taxonomy')` (từ `next-intl`)

Với **client component nhận danh sách từ server** (ví dụ `PricingExplorer`, `SolutionsExplorer`, `EcosystemDiagram` — nơi nhãn trụ cột lấy từ `PILLARS` ngay trong component), gọi `useTranslations('taxonomy')` trực tiếp trong component đó và thay chỗ đang render `p.label` thành `taxonomyLabel(t, 'pillars', p.value, PILLARS)`.

`SolutionFinder` hiển thị `opt.label` của `INDUSTRIES`/`NEEDS`/`COMPANY_SIZES` — thay tương tự, dùng `taxonomyLabel(t, step.group, opt.value, step.options)` (thêm trường `group` vào mỗi phần tử `STEPS`).

> **Không** sửa `src/lib/taxonomy.ts` và **không** sửa các file trong `src/collections/` — admin vẫn dùng label tiếng Việt.

- [ ] **Step 4: Verify — nhãn taxonomy đổi theo ngôn ngữ, admin không hỏng**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx tsc --noEmit
npm run lint
```
Expected: không lỗi.

```bash
# Trang giai phap tieng Viet: co "Chuyển đổi số"
curl -s http://localhost:3000/giai-phap    | grep -c 'Chuyển đổi số'
# Tieng Anh: co "Digital transformation"
curl -s http://localhost:3000/en/giai-phap | grep -c 'Digital transformation'
# Tieng Trung: co "数字化转型"
curl -s http://localhost:3000/zh/giai-phap | grep -c '数字化转型'
# Admin VAN PHAI SONG
curl -s -o /dev/null -w "admin=%{http_code}\n" http://localhost:3000/admin
```
Expected: 3 dòng đầu `>=1`; dòng cuối `admin=200`.

- [ ] **Step 5: Commit**

```bash
git checkout -- "src/app/(payload)/admin/importMap.js" 2>/dev/null
git add messages src/lib/taxonomy-i18n.ts src/components "src/app/(frontend)"
git commit -m "feat(i18n): dich nhan taxonomy (tru cot, nganh, nhu cau, quy mo, loai tin/van ban)"
```

---

### Task 6: Kiểm tra tổng thể + bàn giao sang giai đoạn 2

**Files:**
- Create: `docs/superpowers/plans/2026-07-13-i18n-giai-doan-1-ban-giao.md`

- [ ] **Step 1: Chạy build production (bắt lỗi mà dev không thấy)**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```
Expected: build thành công, không lỗi.
Nếu lỗi liên quan Google Fonts (`Failed to fetch 'Be Vietnam Pro'`) → là lỗi mạng tạm thời, chạy lại lệnh.

- [ ] **Step 2: Rà soát toàn bộ đường dẫn quan trọng trên bản build**

```bash
npm run start &
sleep 5
for u in / /bang-gia /giai-phap /tim-giai-phap /tin-tuc /chinh-sach /dat-lich /lien-he \
         /en /en/bang-gia /en/giai-phap /zh /zh/bang-gia /zh/giai-phap \
         /admin /api/solutions /sitemap.xml /robots.txt; do
  printf "%-22s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$u)"
done
```
Expected: **tất cả `200`**. Bất kỳ dòng nào khác `200` phải sửa trước khi kết thúc giai đoạn.

- [ ] **Step 3: Liệt kê chữ tiếng Việt còn hardcode (đầu vào cho giai đoạn sau)**

```bash
grep -rln "[ăâđêôơưàáảãạầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộùúủũụừứửữựỳýỷỹỵ]" \
  src/components "src/app/(frontend)" --include=*.tsx | sort
```
Ghi danh sách file kết quả vào `docs/superpowers/plans/2026-07-13-i18n-giai-doan-1-ban-giao.md` kèm mục:

```markdown
# i18n — Bàn giao sau Giai đoạn 1

## Đã xong (GĐ1)
- next-intl + middleware + routing `[locale]` (VI không tiền tố, /en, /zh)
- Nút chuyển ngôn ngữ VI | EN | 中文 (desktop + mobile)
- Đã dịch: menu, header, footer, nhãn taxonomy

## Còn lại — chữ giao diện chưa dịch (đầu vào GĐ3)
<dán danh sách file từ lệnh grep ở trên>

## Chưa làm (theo spec)
- GĐ2: field dịch EN/ZH cho Solutions/News/Policies/SiteSettings + helper `localize()` (CẦN push schema additive lên Neon + IDC)
- GĐ3: hreflang, sitemap 3 ngôn ngữ, metadata theo locale
- GĐ4: nhân viên nhập bản dịch trong admin
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-07-13-i18n-giai-doan-1-ban-giao.md
git commit -m "docs(i18n): ban giao giai doan 1 + danh sach chu con lai"
```

- [ ] **Step 5: Push**

```bash
git push origin main
```

> **Deploy:** giai đoạn này **không đụng database** → **không cần push schema**. Vercel tự build. IDC cần `git pull && docker compose build app && docker compose up -d app` như thường lệ.

---

## Ghi chú rủi ro

1. **Middleware matcher là điểm chết người.** Nếu `/admin` hoặc `/api/*` trả về khác `200`, Payload đã bị chặn. Bước verify của Task 2 và Task 5 đều kiểm tra việc này — không bỏ qua.
2. **URL tiếng Việt đã được Google index** (32 trang đã submit sitemap). Vì VI **không có tiền tố**, các URL cũ **giữ nguyên** → không mất thứ hạng. Không được đổi sang `/vi/...`.
3. **`generateStaticParams` + `force-dynamic`**: các trang đang đặt `export const dynamic = 'force-dynamic'`, nên `generateStaticParams` chỉ dùng để khai báo danh sách locale hợp lệ; không kỳ vọng prerender.
4. Nếu truy cập một đường dẫn không tồn tại gây lỗi "missing root layout", tạo `src/app/(frontend)/[locale]/not-found.tsx` trả về một trang 404 đơn giản.
