# Tra cứu Nghị định & Chính sách + Crawl theo lịch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết kế lại trang `/chinh-sach` theo phong cách cổng tra cứu văn bản (sidebar lọc + bảng), và thêm crawler theo lịch lấy metadata văn bản từ vanban.chinhphu.vn (lọc từ khóa) vào hàng chờ duyệt trong admin.

**Architecture:** Crawler là module thuần (`src/lib/crawler/chinhphu.ts`) tách biệt fetch/parse; một route cron gọi nó, lọc theo từ khóa cấu hình trong SiteSettings, dedupe rồi tạo Policies `draft, source=crawl`. Văn bản chỉ hiện công khai sau khi editor đổi sang `published`. Frontend mở rộng `getPoliciesList` để lọc theo q/loại/cơ quan/năm, render sidebar + bảng.

**Tech Stack:** Next.js 16 (App Router, RSC), Payload CMS 3, TypeScript, Tailwind v4, cheerio (parse HTML), vitest (test logic thuần), Vercel Cron.

## Global Constraints

- Windows: nạp PATH trước mọi lệnh npm: `$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;" + [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`
- Mọi lệnh chạy từ thư mục gốc dự án `d:/Viettel/KHDN Landing page`.
- Chỉ lưu **metadata + tóm tắt + link nguồn**, KHÔNG republish toàn văn; tôn trọng robots.txt.
- Văn bản crawl tạo với `status='draft'`, `source='crawl'` — KHÔNG bao giờ tạo published tự động.
- Route cron phải xác thực `CRON_SECRET`; KHÔNG bao giờ trả 500 vì lỗi parse/item (trả JSON thống kê).
- Dedupe theo `documentNumber` rồi tới `sourceUrl`; không ghi đè bản đã có.
- Cron tối đa 1 lần/ngày (giới hạn Vercel Hobby).
- Nếu sửa `beforeDashboard` trong payload.config → BẮT BUỘC chạy lại `npm run generate:importmap` (xem memory importmap-plugin-gotcha).
- Mã tiếng Việt giữ dấu trong UI/label; comment code dùng tiếng Việt không dấu theo phong cách hiện có.
- Giá trị loại văn bản dùng đúng `POLICY_TYPES` trong `src/lib/taxonomy.ts`: `luat | nghi-dinh | thong-tu | quyet-dinh | cong-van`.

---

## File Structure

- Create `vitest.config.ts` — cấu hình test + alias `@`.
- Create `src/lib/crawler/normalize.ts` — hàm thuần: bỏ dấu, khớp từ khóa, map loại VB, parse ngày.
- Create `src/lib/crawler/normalize.test.ts` — test cho normalize.
- Create `src/lib/crawler/chinhphu.ts` — fetch + parse HTML → `CrawledPolicy[]`.
- Create `src/lib/crawler/chinhphu.test.ts` — test parse với fixture HTML.
- Create `src/lib/crawler/__fixtures__/listing.html` — HTML mẫu lấy từ trang thật.
- Modify `src/collections/Policies.ts` — thêm `source`, `crawledAt`.
- Modify `src/globals/SiteSettings.ts` — thêm tab "Crawl chính sách": `policyCrawlEnabled`, `policyCrawlKeywords`.
- Modify `src/seed/index.ts` — seed keywords mặc định cho site-settings.
- Create `src/app/(frontend)/api/cron/crawl-policies/route.ts` — route cron.
- Create `vercel.json` — lịch cron.
- Modify `.env.example` — thêm `CRON_SECRET`.
- Modify `src/lib/queries.ts:136-148` — mở rộng `getPoliciesList` (q, issuingBody, year) + thêm `getPolicyIssuingBodies()`.
- Create `src/components/content/PolicyFilters.tsx` — sidebar lọc (client, URL-driven).
- Create `src/components/content/PolicyRow.tsx` — 1 dòng văn bản trong bảng.
- Modify `src/app/(frontend)/chinh-sach/page.tsx` — bố cục sidebar + bảng.
- Modify `package.json` — thêm dep `cheerio`, devDep `vitest`, script `test`.

---

### Task 1: Cài test infra + dependencies

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: script `npm test` chạy vitest; alias `@` → `src` trong test; dep `cheerio` dùng ở Task 4.

- [ ] **Step 1: Cài dependencies**

PATH prelude rồi chạy:
```
npm install cheerio
npm install -D vitest
```
Expected: `cheerio` trong `dependencies`, `vitest` trong `devDependencies`.

- [ ] **Step 2: Thêm script test vào package.json**

Trong `"scripts"` thêm dòng:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Tạo vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Verify vitest chạy (chưa có test → no test files)**

Run: `npm test`
Expected: vitest khởi động, báo "No test files found" (chưa lỗi cấu hình). Chấp nhận exit khác 0 do chưa có test.

- [ ] **Step 5: Commit**

```
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: them vitest + cheerio cho crawler chinh sach"
```

---

### Task 2: Hàm thuần normalize — bỏ dấu & khớp từ khóa

**Files:**
- Create: `src/lib/crawler/normalize.ts`
- Test: `src/lib/crawler/normalize.test.ts`

**Interfaces:**
- Produces:
  - `stripDiacritics(s: string): string`
  - `matchesKeywords(text: string, keywords: string[]): boolean` — true nếu text (đã bỏ dấu, thường hóa) chứa ≥1 keyword (đã bỏ dấu, thường hóa). keywords rỗng → false.

- [ ] **Step 1: Viết test thất bại**

```ts
import { describe, it, expect } from 'vitest'
import { stripDiacritics, matchesKeywords } from './normalize'

describe('stripDiacritics', () => {
  it('bo dau tieng Viet va thuong hoa giu nguyen chu', () => {
    expect(stripDiacritics('Hóa Đơn Điện Tử')).toBe('hoa don dien tu')
  })
})

describe('matchesKeywords', () => {
  it('khop khong phan biet dau/hoa thuong', () => {
    expect(matchesKeywords('Nghị định về HÓA ĐƠN điện tử', ['hoa don dien tu'])).toBe(true)
    expect(matchesKeywords('Thông tư về chữ ký số', ['hóa đơn điện tử'])).toBe(false)
  })
  it('keyword co dau van khop', () => {
    expect(matchesKeywords('quy định bảo hiểm xã hội', ['bảo hiểm xã hội'])).toBe(true)
  })
  it('danh sach rong -> false', () => {
    expect(matchesKeywords('bất kỳ', [])).toBe(false)
  })
})
```

- [ ] **Step 2: Chạy test, xác nhận FAIL**

Run: `npm test`
Expected: FAIL — không tìm thấy module `./normalize`.

- [ ] **Step 3: Viết implementation tối thiểu**

```ts
/** Bo dau tieng Viet (NFD) + thuong hoa, giu khoang trang. */
export function stripDiacritics(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/** True neu text chua it nhat 1 keyword (so khop sau khi bo dau/thuong hoa). */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  if (!keywords || keywords.length === 0) return false
  const haystack = stripDiacritics(text)
  return keywords.some((k) => {
    const needle = stripDiacritics(k)
    return needle.length > 0 && haystack.includes(needle)
  })
}
```

- [ ] **Step 4: Chạy test, xác nhận PASS**

Run: `npm test`
Expected: PASS toàn bộ test normalize.

- [ ] **Step 5: Commit**

```
git add src/lib/crawler/normalize.ts src/lib/crawler/normalize.test.ts
git commit -m "feat: ham bo dau + khop tu khoa cho crawler"
```

---

### Task 3: Hàm thuần map loại văn bản & parse ngày

**Files:**
- Modify: `src/lib/crawler/normalize.ts`
- Modify: `src/lib/crawler/normalize.test.ts`

**Interfaces:**
- Consumes: `stripDiacritics` (Task 2).
- Produces:
  - `mapDocumentType(raw: string): string` — trả về 1 value trong POLICY_TYPES; không nhận diện được → `'nghi-dinh'`.
  - `parseVnDate(raw: string): string | undefined` — `dd/mm/yyyy` → ISO string; lỗi → undefined.

- [ ] **Step 1: Thêm test thất bại**

Thêm vào `normalize.test.ts`:
```ts
import { mapDocumentType, parseVnDate } from './normalize'

describe('mapDocumentType', () => {
  it('nhan dien cac loai pho bien', () => {
    expect(mapDocumentType('Nghị định')).toBe('nghi-dinh')
    expect(mapDocumentType('THÔNG TƯ 12')).toBe('thong-tu')
    expect(mapDocumentType('Quyết định')).toBe('quyet-dinh')
    expect(mapDocumentType('Luật')).toBe('luat')
    expect(mapDocumentType('Công văn')).toBe('cong-van')
  })
  it('khong nhan dien -> nghi-dinh', () => {
    expect(mapDocumentType('Văn bản lạ')).toBe('nghi-dinh')
  })
})

describe('parseVnDate', () => {
  it('dd/mm/yyyy -> ISO', () => {
    expect(parseVnDate('15/03/2026')?.slice(0, 10)).toBe('2026-03-15')
  })
  it('chuoi rac -> undefined', () => {
    expect(parseVnDate('không phải ngày')).toBeUndefined()
    expect(parseVnDate('')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Chạy test, xác nhận FAIL**

Run: `npm test`
Expected: FAIL — `mapDocumentType`/`parseVnDate` chưa export.

- [ ] **Step 3: Viết implementation**

Thêm vào `normalize.ts`:
```ts
/** Map text loai van ban -> value trong POLICY_TYPES; mac dinh nghi-dinh. */
export function mapDocumentType(raw: string): string {
  const t = stripDiacritics(raw)
  if (t.includes('thong tu')) return 'thong-tu'
  if (t.includes('quyet dinh')) return 'quyet-dinh'
  if (t.includes('cong van')) return 'cong-van'
  if (t.includes('luat')) return 'luat'
  if (t.includes('nghi dinh')) return 'nghi-dinh'
  return 'nghi-dinh'
}

/** Parse ngay dd/mm/yyyy -> ISO string; loi -> undefined. */
export function parseVnDate(raw: string): string | undefined {
  const m = raw.trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!m) return undefined
  const [, dd, mm, yyyy] = m
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}
```

- [ ] **Step 4: Chạy test, xác nhận PASS**

Run: `npm test`
Expected: PASS toàn bộ.

- [ ] **Step 5: Commit**

```
git add src/lib/crawler/normalize.ts src/lib/crawler/normalize.test.ts
git commit -m "feat: map loai van ban + parse ngay cho crawler"
```

---

### Task 4: Parse HTML danh sách → CrawledPolicy[]

**Files:**
- Create: `src/lib/crawler/chinhphu.ts`
- Test: `src/lib/crawler/chinhphu.test.ts`
- Create: `src/lib/crawler/__fixtures__/listing.html`

**Interfaces:**
- Consumes: `mapDocumentType`, `parseVnDate` (Task 3); `cheerio` (Task 1).
- Produces:
  - `type CrawledPolicy = { title: string; documentNumber?: string; documentType: string; issuingBody?: string; effectiveDate?: string; summary?: string; sourceUrl: string }`
  - `parseListingHtml(html: string, baseUrl: string): CrawledPolicy[]` — parse HTML thành danh sách (bỏ qua item thiếu title/link).
  - `fetchPolicyCandidates(opts?: { maxItems?: number }): Promise<CrawledPolicy[]>` — fetch trang thật rồi gọi `parseListingHtml`.

> LƯU Ý SELECTOR: cấu trúc HTML thật chưa biết. Trước khi viết, mở vanban.chinhphu.vn mục văn bản mới, lưu HTML một trang danh sách vào `__fixtures__/listing.html`, xem selector thật của: hàng văn bản, link tiêu đề (trích yếu), số hiệu, loại, cơ quan, ngày. Cập nhật các selector trong `parseListingHtml` cho khớp fixture. Test dưới đây dựa trên cấu trúc giả định dạng bảng `table tbody tr` với các ô — ĐIỀU CHỈNH theo HTML thật, giữ nguyên tên hàm/kiểu trả về.

- [ ] **Step 1: Tạo fixture HTML mẫu**

Tạo `src/lib/crawler/__fixtures__/listing.html` (mẫu tối thiểu mô phỏng cấu trúc bảng — thay bằng HTML thật khi có):
```html
<table class="list-vb">
  <tbody>
    <tr>
      <td class="col-type">Nghị định</td>
      <td class="col-title"><a href="/he-thong-van-ban?id=123">Nghị định về hóa đơn điện tử</a></td>
      <td class="col-number">70/2026/NĐ-CP</td>
      <td class="col-body">Bộ Tài chính</td>
      <td class="col-date">15/03/2026</td>
    </tr>
    <tr>
      <td class="col-type">Thông tư</td>
      <td class="col-title"><a href="/he-thong-van-ban?id=124">Thông tư hướng dẫn chữ ký số</a></td>
      <td class="col-number">02/2026/TT-BTTTT</td>
      <td class="col-body">Bộ TT&amp;TT</td>
      <td class="col-date">20/03/2026</td>
    </tr>
  </tbody>
</table>
```

- [ ] **Step 2: Viết test thất bại**

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'
import { parseListingHtml } from './chinhphu'

const html = readFileSync(path.join(__dirname, '__fixtures__/listing.html'), 'utf-8')

describe('parseListingHtml', () => {
  const items = parseListingHtml(html, 'https://vanban.chinhphu.vn')

  it('lay dung so luong van ban co title + link', () => {
    expect(items.length).toBe(2)
  })
  it('chuan hoa cac truong', () => {
    const first = items[0]
    expect(first.title).toBe('Nghị định về hóa đơn điện tử')
    expect(first.documentType).toBe('nghi-dinh')
    expect(first.documentNumber).toBe('70/2026/NĐ-CP')
    expect(first.issuingBody).toBe('Bộ Tài chính')
    expect(first.effectiveDate?.slice(0, 10)).toBe('2026-03-15')
    expect(first.sourceUrl).toBe('https://vanban.chinhphu.vn/he-thong-van-ban?id=123')
  })
})
```

- [ ] **Step 3: Chạy test, xác nhận FAIL**

Run: `npm test`
Expected: FAIL — `parseListingHtml` chưa tồn tại.

- [ ] **Step 4: Viết implementation**

```ts
import * as cheerio from 'cheerio'

import { mapDocumentType, parseVnDate } from './normalize'

export type CrawledPolicy = {
  title: string
  documentNumber?: string
  documentType: string
  issuingBody?: string
  effectiveDate?: string
  summary?: string
  sourceUrl: string
}

const LISTING_URL =
  process.env.POLICY_SOURCE_URL || 'https://vanban.chinhphu.vn/he-thong-van-ban'

/**
 * Parse HTML trang danh sach -> CrawledPolicy[].
 * SELECTOR duoi day theo cau truc bang gia dinh; chinh theo HTML that.
 */
export function parseListingHtml(html: string, baseUrl: string): CrawledPolicy[] {
  const $ = cheerio.load(html)
  const out: CrawledPolicy[] = []

  $('table.list-vb tbody tr').each((_, el) => {
    const row = $(el)
    const link = row.find('td.col-title a').first()
    const title = link.text().trim()
    const href = link.attr('href')?.trim()
    if (!title || !href) return // bo qua hang thieu du lieu

    const sourceUrl = new URL(href, baseUrl).toString()
    const typeText = row.find('td.col-type').text().trim()
    const number = row.find('td.col-number').text().trim()
    const body = row.find('td.col-body').text().trim()
    const dateText = row.find('td.col-date').text().trim()

    out.push({
      title,
      documentNumber: number || undefined,
      documentType: mapDocumentType(typeText || title),
      issuingBody: body || undefined,
      effectiveDate: parseVnDate(dateText),
      sourceUrl,
    })
  })

  return out
}

/** Fetch trang that roi parse. Nem loi neu fetch that bai. */
export async function fetchPolicyCandidates(
  opts: { maxItems?: number } = {},
): Promise<CrawledPolicy[]> {
  const res = await fetch(LISTING_URL, {
    headers: { 'User-Agent': 'KHDN-Viettel-HCM-bot/1.0 (+landing page tra cuu chinh sach)' },
  })
  if (!res.ok) throw new Error(`Fetch nguon that bai: ${res.status}`)
  const html = await res.text()
  const items = parseListingHtml(html, LISTING_URL)
  return typeof opts.maxItems === 'number' ? items.slice(0, opts.maxItems) : items
}
```

- [ ] **Step 5: Chạy test, xác nhận PASS**

Run: `npm test`
Expected: PASS. (Nếu fail do selector khác HTML thật → chỉnh selector trong `parseListingHtml` + fixture cho khớp, giữ nguyên kỳ vọng test.)

- [ ] **Step 6: Commit**

```
git add src/lib/crawler/chinhphu.ts src/lib/crawler/chinhphu.test.ts "src/lib/crawler/__fixtures__/listing.html"
git commit -m "feat: parse danh sach van ban chinhphu.vn -> CrawledPolicy"
```

---

### Task 5: Thêm field `source` + `crawledAt` vào Policies

**Files:**
- Modify: `src/collections/Policies.ts`

**Interfaces:**
- Produces: Policies có `source` (`manual|crawl`) và `crawledAt` (date) — dùng ở Task 7 (cron tạo doc) và Task 9 (đếm chờ duyệt).

- [ ] **Step 1: Thêm field vào mảng `fields` (sau `publishedAt`, trước `statusField`)**

```ts
    {
      name: 'source',
      type: 'select',
      label: 'Nguồn',
      options: [
        { value: 'manual', label: 'Nhập tay' },
        { value: 'crawl', label: 'Tự động (chinhphu.vn)' },
      ],
      defaultValue: 'manual',
      index: true,
      admin: { position: 'sidebar', description: 'Văn bản tự động cần duyệt trước khi xuất bản.' },
    },
    {
      name: 'crawledAt',
      type: 'date',
      label: 'Thời điểm crawl',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => data?.source === 'crawl' },
    },
```

- [ ] **Step 2: Cập nhật `defaultColumns` để thấy nguồn trong list admin**

Sửa dòng `defaultColumns` thành:
```ts
    defaultColumns: ['title', 'documentType', 'documentNumber', 'effectiveDate', 'source', 'status'],
```

- [ ] **Step 3: Generate types**

Run: `npm run generate:types`
Expected: `src/payload-types.ts` cập nhật, có `source`/`crawledAt` trong type `Policy`.

- [ ] **Step 4: Build verify**

Run: `npm run build`
Expected: Build Completed, không lỗi type.

- [ ] **Step 5: Commit**

```
git add src/collections/Policies.ts src/payload-types.ts
git commit -m "feat: them source + crawledAt cho Policies (hang cho duyet)"
```

---

### Task 6: Cấu hình crawl trong SiteSettings + seed keywords

**Files:**
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/seed/index.ts`

**Interfaces:**
- Produces: `site-settings.policyCrawlEnabled: boolean`, `site-settings.policyCrawlKeywords: { keyword: string }[]` — đọc ở Task 7.

- [ ] **Step 1: Thêm tab mới vào mảng `tabs` (sau tab Footer)**

```ts
        {
          label: 'Crawl chính sách',
          fields: [
            {
              name: 'policyCrawlEnabled',
              type: 'checkbox',
              label: 'Bật tự động crawl văn bản từ chinhphu.vn',
              defaultValue: false,
              admin: { description: 'Khi bật, hệ thống chạy theo lịch hằng ngày, lấy văn bản khớp từ khóa vào hàng chờ duyệt (trạng thái nháp).' },
            },
            {
              name: 'policyCrawlKeywords',
              type: 'array',
              label: 'Từ khóa lọc',
              labels: { singular: 'Từ khóa', plural: 'Từ khóa' },
              admin: { description: 'Chỉ lấy văn bản có tiêu đề/tóm tắt chứa ít nhất một từ khóa.' },
              fields: [{ name: 'keyword', type: 'text', label: 'Từ khóa', required: true }],
            },
          ],
        },
```

- [ ] **Step 2: Seed keywords mặc định**

Trong `src/seed/index.ts`, tại object data của `updateGlobal({ slug: 'site-settings', ... })`, thêm field:
```ts
        policyCrawlEnabled: false,
        policyCrawlKeywords: [
          { keyword: 'hóa đơn điện tử' },
          { keyword: 'chữ ký số' },
          { keyword: 'bảo hiểm xã hội' },
          { keyword: 'thuế' },
          { keyword: 'hợp đồng điện tử' },
          { keyword: 'vận tải' },
          { keyword: 'chuyển đổi số' },
          { keyword: 'an toàn thông tin' },
        ],
```
(Nếu seed site-settings dùng `data: {...}`, đặt các dòng trên trong object đó. Tìm chỗ `slug: 'site-settings'` để chèn.)

- [ ] **Step 3: Generate types**

Run: `npm run generate:types`
Expected: type `SiteSetting` có `policyCrawlEnabled`, `policyCrawlKeywords`.

- [ ] **Step 4: Build verify**

Run: `npm run build`
Expected: Build Completed.

- [ ] **Step 5: Commit**

```
git add src/globals/SiteSettings.ts src/seed/index.ts src/payload-types.ts
git commit -m "feat: cau hinh crawl (bat/tat + tu khoa) trong SiteSettings"
```

---

### Task 7: Route cron tạo văn bản chờ duyệt

**Files:**
- Create: `src/app/(frontend)/api/cron/crawl-policies/route.ts`
- Create: `vercel.json`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `fetchPolicyCandidates`, `CrawledPolicy` (Task 4); `matchesKeywords` (Task 2); Policies `source/crawledAt` (Task 5); `policyCrawlEnabled/policyCrawlKeywords` (Task 6); `getPayloadClient` từ `@/lib/payload`.
- Produces: endpoint `GET /api/cron/crawl-policies` trả `{ ok, skipped?, fetched, matched, created, skippedExisting, errors }`.

- [ ] **Step 1: Viết route**

```ts
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { fetchPolicyCandidates } from '@/lib/crawler/chinhphu'
import { matchesKeywords } from '@/lib/crawler/normalize'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get('secret') === secret
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const errors: string[] = []
  let fetched = 0
  let matched = 0
  let created = 0
  let skippedExisting = 0

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

    if (!settings?.policyCrawlEnabled) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'disabled' })
    }
    const keywords = (settings.policyCrawlKeywords ?? [])
      .map((k: { keyword?: string }) => (k?.keyword ?? '').trim())
      .filter(Boolean)

    const candidates = await fetchPolicyCandidates({ maxItems: 50 })
    fetched = candidates.length

    for (const c of candidates) {
      try {
        if (!matchesKeywords(`${c.title} ${c.summary ?? ''}`, keywords)) continue
        matched += 1

        // Dedupe theo documentNumber roi toi sourceUrl
        const or = []
        if (c.documentNumber) or.push({ documentNumber: { equals: c.documentNumber } })
        or.push({ sourceUrl: { equals: c.sourceUrl } })
        const existing = await payload.find({
          collection: 'policies',
          where: { or },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        if (existing.totalDocs > 0) {
          skippedExisting += 1
          continue
        }

        await payload.create({
          collection: 'policies',
          overrideAccess: true,
          data: {
            title: c.title,
            summary: c.summary || c.title,
            documentType: c.documentType as never,
            documentNumber: c.documentNumber,
            issuingBody: c.issuingBody,
            effectiveDate: c.effectiveDate,
            sourceUrl: c.sourceUrl,
            source: 'crawl',
            crawledAt: new Date().toISOString(),
            status: 'draft',
          },
        })
        created += 1
      } catch (itemErr) {
        errors.push(`item "${c.title}": ${String(itemErr)}`)
      }
    }

    return NextResponse.json({ ok: true, fetched, matched, created, skippedExisting, errors })
  } catch (err) {
    console.error('[cron/crawl-policies] failed:', err)
    // Khong nem 500 vi loi fetch/parse: tra ket qua de cron khong bao loi lien tuc
    return NextResponse.json({ ok: false, error: String(err), fetched, matched, created, skippedExisting, errors })
  }
}
```

- [ ] **Step 2: Tạo vercel.json**

```json
{
  "crons": [
    { "path": "/api/cron/crawl-policies", "schedule": "0 1 * * *" }
  ]
}
```
(Vercel Cron tự gửi request; thêm `CRON_SECRET` vào env để route xác thực. Trên Vercel, cron tự đính kèm header `Authorization: Bearer <CRON_SECRET>` nếu env `CRON_SECRET` được set.)

- [ ] **Step 3: Thêm CRON_SECRET vào .env.example**

Thêm cuối phần biến:
```
# --- Crawl chinh sach theo lich (Vercel Cron) ---
# Bi mat de xac thuc route /api/cron/crawl-policies. Tao: openssl rand -hex 32
CRON_SECRET=
# (Tuy chon) URL trang danh sach nguon, mac dinh vanban.chinhphu.vn
POLICY_SOURCE_URL=
```

- [ ] **Step 4: Build verify**

Run: `npm run build`
Expected: Build Completed; route `/api/cron/crawl-policies` xuất hiện trong danh sách routes.

- [ ] **Step 5: Test thủ công local (xác thực)**

Chạy `npm run dev`, rồi:
- `curl http://localhost:3000/api/cron/crawl-policies` → `401 unauthorized`.
- Đặt `CRON_SECRET=test` trong `.env`, restart, `curl "http://localhost:3000/api/cron/crawl-policies?secret=test"` → JSON `{ ok: true, skipped: true, reason: 'disabled' }` (vì chưa bật crawl).
Expected: đúng như trên.

- [ ] **Step 6: Commit**

```
git add "src/app/(frontend)/api/cron/crawl-policies/route.ts" vercel.json .env.example
git commit -m "feat: route cron crawl-policies + lich vercel hang ngay"
```

---

### Task 8: Mở rộng truy vấn `getPoliciesList` + danh sách cơ quan

**Files:**
- Modify: `src/lib/queries.ts:136-148`

**Interfaces:**
- Consumes: Policies fields hiện có.
- Produces:
  - `getPoliciesList(opts: { documentType?: string; q?: string; issuingBody?: string; year?: string; page?: number; limit?: number }): Promise<PaginatedDocs<Policy>>`
  - `getPolicyIssuingBodies(): Promise<string[]>` — danh sách cơ quan ban hành distinct (đã published).

- [ ] **Step 1: Thay thế hàm `getPoliciesList`**

```ts
export async function getPoliciesList(
  opts: { documentType?: string; q?: string; issuingBody?: string; year?: string; page?: number; limit?: number } = {},
) {
  const payload = await getPayloadClient()
  const and: Where[] = [{ status: { equals: 'published' } }]
  if (opts.documentType) and.push({ documentType: { equals: opts.documentType } })
  if (opts.issuingBody) and.push({ issuingBody: { equals: opts.issuingBody } })
  if (opts.q && opts.q.trim()) {
    const q = opts.q.trim()
    and.push({
      or: [
        { title: { like: q } },
        { documentNumber: { like: q } },
        { summary: { like: q } },
      ],
    })
  }
  if (opts.year && /^\d{4}$/.test(opts.year)) {
    and.push({ effectiveDate: { greater_than_equal: `${opts.year}-01-01T00:00:00.000Z` } })
    and.push({ effectiveDate: { less_than_equal: `${opts.year}-12-31T23:59:59.999Z` } })
  }
  return payload.find({
    collection: 'policies',
    where: { and },
    sort: '-effectiveDate',
    page: opts.page ?? 1,
    limit: opts.limit ?? 12,
    depth: 1,
  })
}

/** Danh sach co quan ban hanh (distinct, da xuat ban) cho bo loc. */
export async function getPolicyIssuingBodies(): Promise<string[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'policies',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
  })
  const set = new Set<string>()
  for (const d of res.docs as Array<{ issuingBody?: string | null }>) {
    if (d.issuingBody) set.add(d.issuingBody)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'))
}
```

- [ ] **Step 2: Build verify**

Run: `npm run build`
Expected: Build Completed (kiểm tra `Where` đã import sẵn trong queries.ts — nếu chưa, thêm `import type { Where } from 'payload'`).

- [ ] **Step 3: Commit**

```
git add src/lib/queries.ts
git commit -m "feat: getPoliciesList loc q/co quan/nam + danh sach co quan"
```

---

### Task 9: Sidebar lọc + bố cục bảng trang /chinh-sach

**Files:**
- Create: `src/components/content/PolicyFilters.tsx`
- Create: `src/components/content/PolicyRow.tsx`
- Modify: `src/app/(frontend)/chinh-sach/page.tsx`

**Interfaces:**
- Consumes: `getPoliciesList`, `getPolicyIssuingBodies` (Task 8); `POLICY_TYPES`, `labelOf` từ taxonomy; `Container`/`Section`.
- Produces: trang tra cứu bố cục sidebar + bảng, lọc qua URL.

- [ ] **Step 1: Tạo PolicyFilters (client, điều hướng URL)**

```tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

import { POLICY_TYPES } from '@/lib/taxonomy'
import { cn } from '@/lib/cn'

export function PolicyFilters({
  issuingBodies,
  years,
}: {
  issuingBodies: string[]
  years: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()))
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.push(`${pathname}?${next.toString()}`)
  }

  const documentType = sp.get('documentType') ?? ''
  const issuingBody = sp.get('issuingBody') ?? ''
  const year = sp.get('year') ?? ''

  return (
    <aside className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setParam('q', q.trim() || undefined)
        }}
      >
        <label className="mb-1 block text-sm font-semibold text-ink">Tìm kiếm</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Số hiệu, từ khóa..."
          className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm outline-none focus:border-viettel-red"
        />
      </form>

      <div>
        <div className="mb-2 text-sm font-semibold text-ink">Loại văn bản</div>
        <div className="space-y-1">
          <button onClick={() => setParam('documentType')} className={cn('block text-sm', !documentType ? 'font-semibold text-viettel-red' : 'text-ink-soft hover:text-viettel-red')}>Tất cả</button>
          {POLICY_TYPES.map((t) => (
            <button key={t.value} onClick={() => setParam('documentType', t.value)} className={cn('block text-sm', documentType === t.value ? 'font-semibold text-viettel-red' : 'text-ink-soft hover:text-viettel-red')}>{t.label}</button>
          ))}
        </div>
      </div>

      {issuingBodies.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Cơ quan ban hành</div>
          <select value={issuingBody} onChange={(e) => setParam('issuingBody', e.target.value || undefined)} className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {issuingBodies.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      {years.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Năm hiệu lực</div>
          <select value={year} onChange={(e) => setParam('year', e.target.value || undefined)} className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </aside>
  )
}
```

- [ ] **Step 2: Tạo PolicyRow**

```tsx
import Link from 'next/link'

import { POLICY_TYPES, labelOf } from '@/lib/taxonomy'
import type { Policy } from '@/payload-types'

export function PolicyRow({ item }: { item: Policy }) {
  const date = item.effectiveDate ? new Date(item.effectiveDate).toLocaleDateString('vi-VN') : null
  return (
    <Link
      href={`/chinh-sach/${item.slug}`}
      className="block rounded-xl border border-border-soft bg-surface p-4 transition-colors hover:border-viettel-red"
    >
      <div className="flex flex-wrap items-center gap-2">
        {item.documentNumber && (
          <span className="rounded bg-viettel-red/10 px-2 py-0.5 text-xs font-semibold text-viettel-red">{item.documentNumber}</span>
        )}
        <span className="text-xs font-medium text-ink-soft">{labelOf(POLICY_TYPES, item.documentType)}</span>
      </div>
      <h3 className="mt-2 font-semibold text-ink">{item.title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        {item.issuingBody && <span>{item.issuingBody}</span>}
        {date && <span>Hiệu lực: {date}</span>}
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Viết lại page.tsx (bố cục sidebar + bảng)**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import { PolicyFilters } from '@/components/content/PolicyFilters'
import { PolicyRow } from '@/components/content/PolicyRow'
import { Container, Section } from '@/components/ui/primitives'
import { getPoliciesList, getPolicyIssuingBodies } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Nghị định & chính sách',
  description:
    'Tra cứu nghị định, thông tư, chính sách nhà nước liên quan tới hóa đơn điện tử, chữ ký số, BHXH, vận tải... và giải pháp Viettel tương ứng.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function PoliciesListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const documentType = first(sp.documentType)
  const q = first(sp.q)
  const issuingBody = first(sp.issuingBody)
  const year = first(sp.year)
  const page = Number(first(sp.page) ?? '1') || 1

  const [res, issuingBodies] = await Promise.all([
    getPoliciesList({ documentType, q, issuingBody, year, page, limit: 12 }),
    getPolicyIssuingBodies(),
  ])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 8 }, (_, i) => String(currentYear - i))

  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (documentType) params.set('documentType', documentType)
    if (q) params.set('q', q)
    if (issuingBody) params.set('issuingBody', issuingBody)
    if (year) params.set('year', year)
    params.set('page', String(p))
    return `/chinh-sach?${params.toString()}`
  }

  return (
    <>
      <div className="border-b border-border-soft bg-surface-muted">
        <Container className="py-10">
          <nav className="mb-3 text-sm text-ink-soft">
            <Link href="/" className="hover:text-viettel-red">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Nghị định & chính sách</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Tra cứu nghị định & chính sách</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Tra cứu văn bản pháp quy tác động tới hoạt động số hóa của doanh nghiệp, kèm giải pháp Viettel đáp ứng.
          </p>
        </Container>
      </div>

      <Section className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <PolicyFilters issuingBodies={issuingBodies} years={years} />

            <div>
              {res.docs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-soft p-12 text-center text-ink-soft">
                  Không tìm thấy văn bản phù hợp.
                </div>
              ) : (
                <div className="space-y-3">
                  {res.docs.map((p) => (
                    <PolicyRow key={p.id} item={p} />
                  ))}
                </div>
              )}

              {res.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  {res.hasPrevPage && (
                    <Link href={pageHref(res.page! - 1)} className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red">Trước</Link>
                  )}
                  <span className="text-sm text-ink-soft">Trang {res.page}/{res.totalPages}</span>
                  {res.hasNextPage && (
                    <Link href={pageHref(res.page! + 1)} className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold hover:border-viettel-red">Sau</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
```

- [ ] **Step 4: Build verify**

Run: `npm run build`
Expected: Build Completed. Kiểm tra import `cn` tồn tại (`src/lib/cn.ts`) và `labelOf` export từ taxonomy (có — dòng 144).

- [ ] **Step 5: Kiểm tra thủ công**

`npm run dev` → mở `/chinh-sach`:
- Sidebar hiện ô tìm kiếm + loại + cơ quan + năm.
- Lọc theo loại/cơ quan/năm/tìm kiếm phản ánh trên URL và kết quả.
- Văn bản draft (crawl) KHÔNG hiện; chỉ published hiện.
Expected: đúng như trên.

- [ ] **Step 6: Commit**

```
git add src/components/content/PolicyFilters.tsx src/components/content/PolicyRow.tsx "src/app/(frontend)/chinh-sach/page.tsx"
git commit -m "feat: trang tra cuu chinh sach bo cuc sidebar loc + bang"
```

---

### Task 10: (Tùy chọn) Thẻ "văn bản chờ duyệt" trên Dashboard admin

> Bỏ qua task này nếu không cần mục E. Nếu làm: BẮT BUỘC chạy `generate:importmap` sau khi sửa beforeDashboard.

**Files:**
- Modify: `src/components/admin/AdminLeadDashboard.tsx` (thêm 1 truy vấn + 1 thẻ) — KHÔNG thêm component mới để tránh phải sửa importMap.

**Interfaces:**
- Consumes: Policies `source/status` (Task 5).

- [ ] **Step 1: Trong AdminLeadDashboard, thêm truy vấn đếm chờ duyệt (sau usersRes)**

```ts
  const pendingPolicies = await payload
    .count({
      collection: 'policies',
      where: { and: [{ source: { equals: 'crawl' } }, { status: { equals: 'draft' } }] },
    })
    .catch(() => ({ totalDocs: 0 }))
```

- [ ] **Step 2: Thêm thẻ vào hàng thẻ số liệu (sau thẻ "Tổng đã đặt lịch")**

```tsx
        <a
          href={`/admin/collections/policies?where[and][0][source][equals]=crawl&where[and][1][status][equals]=draft`}
          style={{ ...cardBase, borderLeft: '4px solid #f7931e' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Văn bản chờ duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f7931e' }}>{pendingPolicies.totalDocs}</div>
        </a>
```

- [ ] **Step 3: Build verify**

Run: `npm run build`
Expected: Build Completed. (Không sửa beforeDashboard nên không cần generate:importmap.)

- [ ] **Step 4: Commit**

```
git add src/components/admin/AdminLeadDashboard.tsx
git commit -m "feat: the van ban cho duyet tren dashboard admin"
```

---

### Task 11: Verify tổng thể + đẩy lên

**Files:** (không sửa code)

- [ ] **Step 1: Chạy toàn bộ test**

Run: `npm test`
Expected: tất cả test (normalize, chinhphu) PASS.

- [ ] **Step 2: Build cuối**

Run: `npm run build`
Expected: Build Completed.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: không lỗi (cảnh báo nhỏ chấp nhận được).

- [ ] **Step 4: Push (sau khi xác nhận với người dùng)**

```
git push origin main
```
Lưu ý: cần thêm `CRON_SECRET` (và `POLICY_SOURCE_URL` nếu khác mặc định) vào Vercel Environment Variables trước khi cron chạy thật. Bật `policyCrawlEnabled` trong admin khi sẵn sàng.

---

## Self-Review

**Spec coverage:**
- §2 data model → Task 5 ✓
- §3 keyword config → Task 6 ✓
- §4.1 crawler module → Task 2,3,4 ✓
- §4.2 cron route → Task 7 ✓
- §4.3 vercel.json → Task 7 ✓
- §4.4 CRON_SECRET → Task 7 ✓
- §5 UI redesign + getPoliciesList → Task 8,9 ✓
- §6 dashboard card (tùy chọn) → Task 10 ✓
- §8 verification → rải trong các task + Task 11 ✓

**Placeholder scan:** không có TBD/TODO; selector HTML thật được nêu rõ là cần dò trên trang thật (Task 4) — đây là ràng buộc thực tế, code mẫu đầy đủ chạy được với fixture.

**Type consistency:** `CrawledPolicy` (Task 4) dùng nhất quán ở Task 7; `getPoliciesList` opts mở rộng (Task 8) khớp lời gọi ở Task 9; `source`/`crawledAt` (Task 5) khớp create ở Task 7 và count ở Task 10; `matchesKeywords`/`mapDocumentType`/`parseVnDate` (Task 2,3) khớp import ở Task 4,7.
