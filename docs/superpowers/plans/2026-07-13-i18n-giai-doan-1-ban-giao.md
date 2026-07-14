# i18n — Bàn giao sau Giai đoạn 1

Ngày: 2026-07-13
Nhánh: `feature/i18n-giai-doan-1`

## Đã xong (GĐ1)

- Cài `next-intl`, thêm `src/middleware.ts`, chuyển toàn bộ route công khai vào
  `src/app/(frontend)/[locale]/`.
- Routing 3 ngôn ngữ: **tiếng Việt KHÔNG tiền tố** (`/bang-gia`, `/giai-phap`, ...)
  để giữ nguyên các URL đã được Google index; tiếng Anh ở `/en/...`; tiếng Trung
  ở `/zh/...`.
- Nút chuyển ngôn ngữ **VI | EN | 中文** trên header, hoạt động cả desktop và mobile
  (`src/components/layout/LanguageSwitcher.tsx`).
- Đã dịch qua `messages/{vi,en,zh}.json`: menu điều hướng, header, footer.
- Đã dịch toàn bộ nhãn taxonomy (trụ cột giải pháp, ngành nghề, nhu cầu, quy mô
  doanh nghiệp, danh mục tin tức, loại văn bản chính sách) thông qua hàm
  `taxonomyLabel()` trong `src/lib/taxonomy-i18n.ts`.
- **Tự động phát hiện ngôn ngữ trình duyệt (locale detection) đã bị TẮT** trong
  middleware — xác nhận bằng thực nghiệm bên dưới: dù `Accept-Language` là gì,
  `/bang-gia` luôn trả `200` và không redirect, `<html lang="vi">` luôn giữ nguyên
  ở trang chủ không tiền tố. Điều này đảm bảo các URL tiếng Việt đã được Google
  index (32 trang đã submit sitemap) không bị đổi hạng hay mất index.

### Kết quả kiểm tra thực tế (GĐ1 — Task 6)

- `npm test`: **3 test file / 18 test — PASS**.
- `npm run build`: build production **thành công** (Next.js 16.2.9, Turbopack),
  32 trang tĩnh + động được generate, không lỗi.
- Rà soát 26 URL quan trọng trên bản build production (`npm run start`):
  **tất cả 200** — bao gồm `/admin`, `/api/solutions`, `/sitemap.xml`,
  `/robots.txt` (Payload không bị middleware chặn).
- SEO guard: gửi `Accept-Language: en-US`, `zh-CN`, `vi-VN` tới `/bang-gia` —
  cả 3 đều trả **200**, `redirect_url` rỗng (không redirect theo ngôn ngữ trình
  duyệt). Trang chủ không tiền tố luôn trả `<html lang="vi">`.
- Kiểm tra rò rỉ key dịch thô (`taxonomy.`) trên `/`, `/en`, `/zh`,
  `/en/giai-phap`, `/zh/dat-lich`: **0 lần xuất hiện** ở tất cả các trang.

## Còn lại — chữ giao diện chưa dịch (đầu vào GĐ3)

Danh sách lấy từ lệnh:
```
grep -rln "[ăâđêôơưàáảãạầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộùúủũụừứửữựỳýỷỹỵ]" \
  src/components "src/app/(frontend)" --include=*.tsx | sort
```
(Đã loại `src/components/admin/*` — khu vực admin Payload giữ nguyên tiếng Việt
theo thiết kế: `AdminLeadDashboard.tsx`, `CrawlNowButton.tsx`, `LeadNotifications.tsx`.)

### Trang (`src/app/(frontend)/[locale]/...`)

| File | Loại chữ còn hardcode |
|---|---|
| `bang-gia/page.tsx` | metadata (title/description SEO), nhãn giá ("Liên hệ", đơn vị "đ") |
| `chinh-sach/[slug]/page.tsx` | metadata not-found, JSON-LD publisher name, breadcrumb ("Trang chủ", "Nghị định & chính sách") |
| `chinh-sach/page.tsx` | metadata, heading trang, breadcrumb |
| `dat-lich/page.tsx` | metadata, heading trang, breadcrumb |
| `giai-phap/[slug]/page.tsx` | metadata not-found, JSON-LD provider name, breadcrumb |
| `giai-phap/page.tsx` | metadata, heading trang, breadcrumb |
| `layout.tsx` | metadata mặc định toàn site (title template, description, keywords) — chưa theo locale |
| `lien-he/page.tsx` | metadata, heading trang, breadcrumb |
| `page.tsx` (trang chủ) | heading + mô tả block "Solution Finder" (CTA "Tìm giải pháp phù hợp", "Đặt lịch tư vấn 1-1") |
| `tim-giai-phap/page.tsx` | metadata, heading + mô tả hero của wizard tìm giải pháp |
| `tin-tuc/[slug]/page.tsx` | metadata not-found, JSON-LD publisher, breadcrumb |
| `tin-tuc/page.tsx` | metadata, heading trang, breadcrumb |

### Component

| File | Loại chữ còn hardcode |
|---|---|
| `booking/BookingForm.tsx` | thông báo lỗi validate form (Zod messages: "Vui lòng nhập họ tên", "Số điện thoại không hợp lệ"...) |
| `content/ContentCards.tsx` | CTA "Đọc tiếp", "Chi tiết", nhãn "Hiệu lực:" |
| `content/PolicyFilters.tsx` | label filter ("Tìm kiếm", "Loại văn bản"), placeholder input |
| `content/PolicyRow.tsx` | nhãn "Hiệu lực:" |
| `home/AboutViettel.tsx` | nội dung tĩnh "Sứ mệnh / Tầm nhìn" (copy giới thiệu Viettel) |
| `home/CustomerLogos.tsx` | alt text ảnh, heading "Khách hàng tin dùng Viettel" |
| `home/EcosystemDiagram.tsx` | CTA "Chi tiết", nhãn số lượng "N giải pháp" / "Mới" |
| `home/EcosystemSection.tsx` | heading + mô tả "Hệ sinh thái sản phẩm Viettel" |
| `home/FeaturedSolutions.tsx` | logic match keyword tiếng Việt trong code (không phải UI text hiển thị, nhưng cần rà nếu đổi ngôn ngữ dữ liệu) |
| `home/Hero.tsx` | 3 nhãn trust-badge ("Dịch vụ chính hãng Viettel", "An toàn & bảo mật dữ liệu", "Hỗ trợ kỹ thuật 24/7") |
| `home/TechGlobe.tsx` | nhãn các icon quay quanh globe ("Điện toán đám mây", "An toàn thông tin"...) |
| `home/WhyChooseUs.tsx` | tiêu đề + mô tả 4 lý do chọn Viettel |
| `layout/FloatingZalo.tsx` | `aria-label` nút chat Zalo |
| `layout/LanguageSwitcher.tsx` | `aria-label` "Chọn ngôn ngữ" |
| `layout/SiteFooter.tsx` | fallback text khi `settings.departmentName`/`copyright` rỗng (nội dung mặc định lấy từ SiteSettings — cần field dịch ở GĐ2) |
| `layout/SiteHeader.tsx` | alt text logo, nhãn phụ "Hồ Chí Minh" dưới tên site |
| `solutions/PricingExplorer.tsx` | `aria-label` nút cuộn, nhãn "N giải pháp" |
| `solutions/PricingTable.tsx` | nhãn "Liên hệ", CTA mặc định "Đăng ký tư vấn" |
| `solutions/SolutionCard.tsx` | CTA "Xem chi tiết" |
| `solutions/SolutionFilters.tsx` | option "Tất cả", placeholder tìm kiếm, nút "Tìm" |
| `solutions/SolutionFinder.tsx` | toàn bộ câu hỏi wizard ("Doanh nghiệp của bạn thuộc ngành nào?", "Bạn đang cần giải quyết nhu cầu gì?"...) |
| `solutions/SolutionsExplorer.tsx` | tab "Tất cả", "Tất cả giải pháp", nhãn số lượng |
| `solutions/SolutionsKanban.tsx` | CTA "Xem chi tiết", `aria-label` khu vực danh sách |

**Tổng: 34 file** (không tính 3 file admin) còn chứa chữ tiếng Việt hardcode
trong UI công khai. Phần lớn thuộc 2 nhóm:
1. **UI tĩnh** (nhãn nút, heading, placeholder, aria-label, thông báo lỗi form)
   — có thể đưa vào `messages/{vi,en,zh}.json` giống cách đã làm với
   header/footer/taxonomy ở GĐ1, không cần đổi schema.
2. **Nội dung động lấy từ CMS** (SiteSettings fallback, JSON-LD publisher/provider
   name, metadata title/description theo trang) — cần field dịch theo GĐ2 bên dưới.

## Chưa làm (giai đoạn sau)

- **GĐ2 — Field dịch trong CMS:** thêm field EN/ZH cho các collection
  `Solutions`, `News`, `Policies`, `SiteSettings` + viết helper `localize()`
  dùng chung để lấy đúng field theo locale hiện tại, fallback về tiếng Việt khi
  thiếu bản dịch. **Lưu ý: đây là thay đổi schema — cần push additive lên Neon
  (production) và lên IDC theo quy trình đã ghi trong
  `postgres-schema-sync-vercel.md`** (không được xoá cột cũ, chỉ thêm cột mới).
- **GĐ3 — SEO đa ngôn ngữ:** hreflang đầy đủ cho từng trang con (hiện mới có ở
  layout gốc), sitemap.xml liệt kê cả 3 ngôn ngữ, metadata (title/description/
  OG) sinh riêng theo locale thay vì cố định tiếng Việt như hiện tại, và dịch
  nốt danh sách UI tĩnh ở bảng trên qua `messages/*.json`.

  ### ⚠️ Chặn index EN/ZH — BẮT BUỘC sửa ở GĐ3 trước khi mở EN/ZH ra công chúng

  Hiện tại (GĐ1) mọi trang `/en/*` và `/zh/*` đều **tự canonical trỏ về bản tiếng
  Việt**, và `openGraph.locale` bị hard-code `vi_VN`. Đây là **cố ý** ở GĐ1: nó
  bảo vệ ~32 URL tiếng Việt đã được Google index, tránh việc bản dịch máy/chưa
  hoàn chỉnh cạnh tranh hoặc làm loãng thứ hạng. Hệ quả kèm theo: **EN/ZH sẽ
  không bao giờ được index** chừng nào chưa sửa. Khi GĐ3 chính thức mở EN/ZH,
  phải làm đủ 4 việc sau:

  1. **Canonical theo từng locale** — `alternates.canonical` phải trỏ về chính
     URL của locale đang render (`/en/giai-phap` canonical về `/en/giai-phap`),
     không trỏ về bản tiếng Việt nữa.
  2. **`alternates.languages` (hreflang)** — mỗi trang khai báo đủ 3 bản
     `vi` / `en` / `zh` (+ `x-default` trỏ về bản tiếng Việt), khai báo hai
     chiều (reciprocal) giữa các bản dịch.
  3. **`openGraph.locale` theo locale** — `vi_VN` / `en_US` / `zh_CN` thay vì
     hard-code `vi_VN`, kèm `openGraph.alternateLocale` cho 2 ngôn ngữ còn lại.
  4. **sitemap.xml 3 ngôn ngữ** — liệt kê cả URL `/en/*` và `/zh/*` (không chỉ
     bản tiếng Việt), mỗi `<url>` kèm `xhtml:link rel="alternate" hreflang=...`.
  5. **JSON-LD theo locale** — schema.org hiện sinh cố định tiếng Việt; phải cho
     `inLanguage`, `name`, `description` đổi theo locale đang render.

  Chỉ mở (bỏ canonical trỏ VI) **sau khi** nội dung EN/ZH đã được người thật rà
  soát ở GĐ4 — mở sớm khi bản dịch còn thô sẽ gây rủi ro SEO cho bản tiếng Việt.
- **GĐ4 — Vận hành:** nhân viên KHDN nhập bản dịch EN/ZH cho từng Solution/
  News/Policy trực tiếp trong Payload admin (dùng field đã thêm ở GĐ2).

## Deploy note

Giai đoạn 1 **không đụng database** — không có migration, không cần push schema
lên Neon hay IDC. Vercel sẽ tự động build & deploy khi merge/push nhánh lên
`main`. Với IDC, chạy như quy trình thường lệ:

```bash
git pull && docker compose build app && docker compose up -d app
```
