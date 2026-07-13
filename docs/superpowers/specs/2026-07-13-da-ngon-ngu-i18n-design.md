# Thiết kế: Đa ngôn ngữ (i18n) — VI / EN / ZH

Ngày: 2026-07-13
Trạng thái: Đã duyệt, chờ lập kế hoạch triển khai

## 1. Mục tiêu

Cho phép khách truy cập chuyển đổi giữa **tiếng Việt (mặc định)**, **tiếng Anh** và **tiếng Trung** trên toàn bộ trang công khai của landing page KHDN Viettel HCM — bao gồm cả **chữ giao diện** lẫn **nội dung do CMS quản lý** (giải pháp, tin tức, nghị định, cấu hình website).

## 2. Quyết định đã chốt

| Vấn đề | Quyết định |
|---|---|
| Ngôn ngữ | `vi` (mặc định), `en`, `zh` |
| Phạm vi dịch | Cả giao diện **và** nội dung CMS |
| Cấu trúc URL | VI **không tiền tố**; `/en/...`; `/zh/...` |
| Thiếu bản dịch | **Tự lùi về tiếng Việt** (fallback), không ẩn bài |
| Cách tạo bản dịch | **Nhập tay trong admin** (v1). AI dịch tự động: để sau |
| Cơ chế nội dung | **Trường dịch bổ sung (additive)** — KHÔNG dùng `localization` của Payload |
| Cơ chế giao diện | `next-intl` |

### 2.1 Vì sao KHÔNG dùng Payload localization

Bật `localization` của Payload khiến adapter Postgres **chuyển các cột chữ ra bảng `*_locales` riêng**: `solutions.title` bị DROP và tạo lại thành `solutions_locales.title`. Lệnh `db push` **không tự copy dữ liệu**, nên nội dung tiếng Việt hiện có trên **Neon (Vercel)** và **IDC** sẽ mất nếu không viết migration SQL riêng.

Dự án đã có dữ liệu thật trên 2 database production và từng gặp sự cố treo ở prompt DATA LOSS khi push schema có thay đổi phá huỷ (xem `payload-destructive-field-hang`). Do đó chọn hướng **additive**: chỉ THÊM cột mới, không đụng cột cũ → push schema an toàn, giống hệt quy trình đã làm thành công nhiều lần.

**Đánh đổi chấp nhận:** admin không có nút chuyển locale sẵn của Payload (thay bằng tab "English"/"中文"), và cần thêm một helper `localize()` ở tầng truy vấn.

## 3. Mô hình dữ liệu

### 3.1 Chữ ở cấp trên → group `en` / `zh`, hiện dưới dạng tab trong admin

Áp dụng cho: `Solutions`, `News`, `Policies`, global `SiteSettings`.

```ts
{
  type: 'tabs',
  tabs: [
    { label: 'Tiếng Việt', fields: [ /* các field hiện có — GIỮ NGUYÊN TÊN */ ] },
    { label: 'English', fields: [
      { name: 'en', type: 'group', fields: [ /* title, tagline, shortDesc, body, seo... */ ] },
    ]},
    { label: '中文', fields: [
      { name: 'zh', type: 'group', fields: [ /* tương tự */ ] },
    ]},
  ],
}
```

Payload sinh cột mới `en_title`, `zh_title`, … → **thay đổi additive thuần tuý**.

**Lưu ý với `SiteSettings`:** global này **đã có sẵn cấu trúc tabs** (Liên hệ, Trang chủ, Giới thiệu Viettel, SEO & Ảnh nền trang, Footer, Crawl chính sách). Không bọc lại toàn bộ mà **thêm 2 tab mới** — "English" và "中文" — chứa group `en` / `zh` với các field chữ cần dịch (hero, giới thiệu, footer, pageSeo). Các tab hiện có giữ nguyên.

### 3.2 Chữ nằm trong mảng → field dịch inline trong từng dòng

Áp dụng cho `pricingTiers`, `features`, `faq`.

```ts
pricingTiers: [{
  name, nameEn, nameZh,
  badge, badgeEn, badgeZh,
  priceLabel, priceLabelEn, priceLabelZh,
  price, priceSuffix, isContactForPrice, highlight,   // KHÔNG dịch
  features: [{ text, textEn, textZh, included }],
}]
```

**Lý do không dùng group `en.pricingTiers` song song:**
- Giá và cấu trúc gói chỉ tồn tại **một nơi** → đổi giá không phải sửa 3 lần, không lệch dữ liệu.
- Bản dịch **luôn khớp đúng dòng**, không phụ thuộc thứ tự index giữa 2 mảng.

### 3.3 Không dịch

`slug` (URL dùng chung cho cả 3 ngôn ngữ), giá/số, ảnh, các trường quan hệ, ngày tháng, số hiệu văn bản.

### 3.4 Taxonomy

`PILLARS`, `INDUSTRIES`, `NEEDS`, `COMPANY_SIZES`, `NEWS_CATEGORIES`, `POLICY_TYPES` nằm trong code (`src/lib/taxonomy.ts`), **không phải DB**. Giữ nguyên `value`; phần `label` chuyển sang từ điển i18n. `labelOf()` được thay bằng tra cứu qua `t()`.

## 4. Routing & điều hướng

- `next-intl` với `localePrefix: 'as-needed'`, `locales: ['vi','en','zh']`, `defaultLocale: 'vi'`.
- Chuyển cây `src/app/(frontend)/*` → `src/app/(frontend)/[locale]/*`.
- `src/middleware.ts` dùng `createMiddleware` của next-intl.
  **Matcher phải loại trừ** `/admin`, `/api`, `/_next`, và file tĩnh — nếu không sẽ phá Payload admin/API.
- Dùng `Link`/`useRouter` từ `next-intl/navigation` để mọi điều hướng nội bộ **giữ nguyên ngôn ngữ hiện tại**.

## 5. Chữ giao diện

- Ba file từ điển: `messages/vi.json`, `messages/en.json`, `messages/zh.json`.
- Nội dung: menu, nút, tiêu đề khối, nhãn taxonomy, các bước Solution Finder, form đặt lịch, trạng thái rỗng, dải tiện ích, footer…
- Thay chữ hardcode ở ~20+ component bằng `t('key')`.

## 6. Lấy nội dung theo ngôn ngữ

Helper ở tầng truy vấn (`src/lib/queries.ts`):

```ts
localize(doc, locale)
// locale='en' -> doc.en?.title || doc.title
// locale='vi' -> doc.title
```

Nguyên tắc: **thiếu bản dịch thì tự lùi về tiếng Việt**, áp dụng cho từng field độc lập (một bài có thể dịch xong title nhưng chưa dịch body — vẫn hiển thị được).

## 7. Nút chuyển ngôn ngữ

Đặt trong `SiteHeader` (hiện ở cả desktop và menu mobile): `VI | EN | 中文`.
Bấm vào giữ nguyên trang đang xem, chỉ đổi tiền tố locale trong URL.

## 8. SEO đa ngôn ngữ

- `generateMetadata` của mỗi trang thêm `alternates.languages` → sinh thẻ **hreflang** cho vi/en/zh, kèm canonical đúng theo locale.
- `sitemap.ts` xuất URL của **cả 3 ngôn ngữ**.
- `<html lang={locale}>` theo locale hiện tại.
- Meta title/description lấy từ bản dịch trong CMS; thiếu thì lùi về VI.

## 9. Lộ trình triển khai

| GĐ | Nội dung | Rủi ro DB |
|---|---|---|
| **1. Hạ tầng** | next-intl, middleware, `[locale]`, nút chuyển ngôn ngữ, từ điển cho menu/footer/nút chung | Không |
| **2. Nội dung CMS** | Thêm field dịch (tab EN/中文) vào Solutions/News/Policies/SiteSettings + helper `localize()` + hiển thị theo locale | **Additive** |
| **3. SEO** | hreflang, sitemap 3 ngôn ngữ, metadata theo locale | Không |
| **4. Nhập liệu** | Nhân viên nhập bản dịch EN/ZH trong admin | Không |

## 10. Deploy

Giai đoạn 2 thêm field CMS → phải **push schema** lên **Neon** và **IDC** theo đúng quy trình additive đã dùng (script `src/scripts/push-schema.ts`). Vì chỉ thêm cột, **không xuất hiện prompt DATA LOSS**.

Các giai đoạn 1, 3, 4 không đụng schema.

## 11. Rủi ro & điểm cần chú ý

- **Middleware matcher**: sai matcher sẽ chặn `/admin` hoặc `/api` của Payload → phải kiểm tra kỹ ngay sau khi thêm middleware.
- **Khối lượng chữ giao diện**: ~20+ component đang hardcode tiếng Việt; đây là phần tốn công nhất, nên làm theo từng nhóm màn hình.
- **Chất lượng bản dịch**: v1 nhập tay, phụ thuộc nhân sự. Fallback về VI đảm bảo trang không bao giờ trống.
- **`payload-types.ts`** phải được regenerate sau khi thêm field, và **`importMap.js` không được commit bản bị mất handler S3** (xem `importmap-plugin-gotcha`).
