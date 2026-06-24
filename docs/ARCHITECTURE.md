# Kiến trúc hệ thống — Landing Page Phòng KHDN Viettel Hồ Chí Minh

> Tài liệu kiến trúc cho website giới thiệu giải pháp chuyển đổi số + đặt lịch tư vấn của
> Phòng Khách hàng Doanh nghiệp (KHDN) Viettel TP.HCM. Phản ánh đúng hệ thống đang triển khai.

## 1. Mục tiêu & ràng buộc

| Mục tiêu | Diễn giải |
|----------|-----------|
| Giới thiệu hệ sinh thái giải pháp | 6 trụ cột, tra cứu/lọc giải pháp, gói giá, chi tiết |
| Thu lead | Khách đặt lịch tư vấn/demo → Viettel tiếp cận lại |
| Nội dung động | Nhân viên tự cập nhật tin tức, chính sách, giải pháp qua CMS |
| Thông báo nhanh | Lead mới → email + Telegram cho sale |
| Chủ quyền dữ liệu | **Tự host trên Viettel IDC** (server + DB + Object Storage) |

**Ràng buộc cứng:** thương hiệu đỏ Viettel `#EE0033`; tiếng Việt; mobile-first; a11y; chống spam.

## 2. Kiến trúc tổng thể (một codebase, một deploy)

Gộp **frontend + CMS + API** vào **một ứng dụng Next.js duy nhất** (Payload nhúng) → một
container, một database, dễ vận hành trên hạ tầng nội bộ.

```
                          ┌────────────────────── Viettel IDC ──────────────────────┐
   Khách / DN             │                                                          │
   (trình duyệt) ──HTTPS──┼──▶ Nginx (reverse proxy + SSL)                           │
                          │        │                                                 │
   Nhân viên KHDN         │        ▼                                                 │
   (/admin) ──────────────┼──▶ Next.js app (Docker, cổng 3000)                       │
                          │     ├─ (frontend)  : trang public (SSR/RSC)              │
                          │     ├─ (payload)   : Admin CMS UI                        │
                          │     └─ /api        : /api/lead, /api/[...payload]        │
                          │        │            │                │                   │
                          │        ▼            ▼                ▼                   │
                          │   PostgreSQL    Object Storage   Dịch vụ ngoài           │
                          │   (volume        (S3-compat,     (SMTP, Telegram,        │
                          │    pgdata)        media files)    Cloudflare Turnstile)  │
                          └──────────────────────────────────────────────────────────┘
```

## 3. Tech stack

| Lớp | Công nghệ | Ghi chú |
|-----|-----------|---------|
| Framework | **Next.js 16** (App Router, RSC) + TypeScript | SSR/SSG cho SEO |
| UI | **Tailwind CSS v4** + lucide-react | Design tokens brand Viettel, không emoji-icon |
| CMS / Admin | **Payload CMS 3** (nhúng) | Auth + phân quyền + admin panel sẵn |
| DB | **SQLite** (dev) / **PostgreSQL** (prod) | Chọn qua `DB_ADAPTER` |
| Lưu media | Local `./media` (dev) / **Object Storage Viettel IDC S3** (prod) | Plugin `s3Storage`, bật khi có `S3_BUCKET` |
| Form | react-hook-form + Zod | Validate client **và** server cùng schema |
| Chống spam | **Cloudflare Turnstile** + honeypot | Verify phía server |
| Thông báo | Nodemailer (SMTP) + Telegram Bot API | afterChange hook |
| Đóng gói | Docker (standalone) + docker-compose | App + Postgres |

## 4. Phân lớp mã nguồn

```
src/
├─ app/(frontend)/      # Trang public: /, /giai-phap, /tim-giai-phap, /bang-gia,
│                       #   /dat-lich, /tin-tuc, /chinh-sach, /lien-he + api/lead
├─ app/(payload)/       # Admin CMS UI + REST/GraphQL của Payload
├─ collections/         # Solutions, News, Policies, Leads, Media, Users
├─ globals/             # SiteSettings (hotline, hero, stats, testimonials...)
├─ fields/              # field dùng chung: slug, status, seo
├─ components/          # ui (primitives), layout, home, solutions, content, booking
├─ lib/                 # payload client, queries, taxonomy, access, notify, turnstile, format
├─ seed/               # nạp dữ liệu mẫu
└─ payload.config.ts    # đăng ký collections/globals + adapter DB/email/S3
```

**Nguyên tắc:** taxonomy tập trung 1 chỗ (`lib/taxonomy.ts`); truy vấn công khai luôn lọc
`status='published'` (vì Local API mặc định `overrideAccess=true`); access control khai báo ở
collection + field-level (`lib/access.ts`).

## 5. Mô hình dữ liệu (Payload Collections)

| Collection | Vai trò | Quan hệ chính |
|-----------|---------|---------------|
| **Solutions** | Giải pháp: pillar, productGroup, pricingTiers[], features, logo | → Media (logo), → Solutions (related) |
| **News** | Tin tức: category, coverImage, body, publishedAt | → Media (coverImage) |
| **Policies** | Nghị định/chính sách: documentNumber, effectiveDate, coverImage, attachment | → Media, → Solutions |
| **Leads** | Yêu cầu đặt lịch: name, phone, type, status, assignedTo | → Solutions (interested) |
| **Media** | Ảnh/file upload (auto 3 size: thumbnail/card/og) | (đích của các quan hệ upload) |
| **Users** | Nhân viên: role admin/editor/sales | (auth) |
| **SiteSettings** (global) | hotline, email, hero, stats, testimonials | — |

**Phân quyền:** `anyone` đọc nội dung published; chỉ signed-in đọc Leads; field nhạy cảm của
Lead (status/assignedTo/notes) chỉ admin/sales sửa được.

## 6. Các luồng chính

**A. Đặt lịch tư vấn (luồng quan trọng nhất)**
```
BookingForm (client)
  → validate Zod + Turnstile widget
  → POST /api/lead { ...fields, turnstileToken, honeypot }
      → Zod re-validate + honeypot check + verifyTurnstile() (Cloudflare siteverify)
      → payload.create('leads')
          → afterChange hook → notifyNewLead(): Telegram + email sale + email xác nhận khách
  → hiện màn hình "Đã gửi thành công"; lead xuất hiện trong /admin dashboard
```

**B. Hiển thị nội dung**
```
RSC page → lib/queries (Payload Local API, lọc published)
  → render SolutionCard / NewsCard / PolicyCard
  → ảnh phục vụ từ Media (local hoặc Object Storage S3)
```

**C. Quản trị nội dung** — nhân viên đăng nhập `/admin`, CRUD giải pháp/tin/chính sách, upload
ảnh (→ Object Storage), quản lý & phân công lead.

## 7. Hạ tầng & môi trường (Viettel IDC)

| Thành phần | Dev | Production (Viettel IDC) |
|-----------|-----|--------------------------|
| Hosting | `npm run dev` | Docker trên Cloud Server + Nginx + SSL |
| Database | SQLite `payload.db` | PostgreSQL (volume `pgdata` hoặc dịch vụ DB IDC) |
| Media | thư mục `./media` | Object Storage IDC (S3-compatible, `forcePathStyle`) |
| Email/Notify | log console (degrade) | SMTP nội bộ + Telegram |
| Anti-spam | tắt nếu thiếu key | Cloudflare Turnstile |

Cấu hình hoàn toàn qua biến môi trường (`.env`); mọi tích hợp **degrade an toàn** khi thiếu key
→ dev không cần hạ tầng ngoài.

## 8. Phi chức năng

- **SEO:** metadata động, sitemap.xml, robots.txt, JSON-LD Organization, OG image.
- **A11y:** skip-link, focus ring, `prefers-reduced-motion`, tương phản đạt WCAG AA.
- **Hiệu năng:** RSC, ảnh resize sẵn 3 size + lazy-load, animation chỉ transform/opacity (không CLS).
- **Bảo mật:** Turnstile + honeypot, Zod cả 2 phía, field-level access, secret/keys qua env.

## 9. Hướng mở rộng (sau go-live)

1. Tự động tổng hợp tin từ RSS/nguồn ngoài (viettel.vn) vào hàng chờ duyệt.
2. Tích hợp đẩy lead sang CRM Viettel qua API.
3. CDN trước Object Storage; analytics tự host (Umami); đa ngôn ngữ (EN); live chat/Callbot.
