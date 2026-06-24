# Landing Page — Phòng KHDN Viettel Hồ Chí Minh

Website giới thiệu hệ sinh thái giải pháp chuyển đổi số cho doanh nghiệp: tra cứu giải pháp,
gói giá, đặt lịch tư vấn/demo, tin tức Viettel và nghị định/chính sách liên quan.
Có trang quản trị (CMS) để cập nhật nội dung và quản lý lead.

## Công nghệ

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Payload CMS 3** (nhúng trong Next.js) — admin tại `/admin`
- **SQLite** cho dev, **PostgreSQL** cho production (Viettel Cloud)
- Email: Nodemailer (SMTP) · Thông báo lead: Telegram/Zalo (cấu hình ở `.env`)

## Yêu cầu

- Node.js >= 24.15 (đã test với 24.17)
- npm

> Trên Windows nếu vừa cài Node bằng winget, mở **terminal mới** để PATH cập nhật (`node -v`).

## Chạy lần đầu

```bash
npm install
cp .env.example .env     # rồi điền PAYLOAD_SECRET (openssl rand -hex 32)
npm run seed             # tạo admin + dữ liệu mẫu (15 giải pháp, tin, chính sách)
npm run dev              # http://localhost:3000  — admin: http://localhost:3000/admin
```

**Tài khoản admin mặc định sau khi seed:** `admin@khdn-viettel-hcm.vn` / `Admin@12345`
(đổi qua biến `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, hoặc đổi mật khẩu trong `/admin`).

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server (tự tạo schema SQLite) |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build (production — cần migrate DB trước) |
| `npm run seed` | Nạp admin + dữ liệu mẫu |
| `npm run generate:types` | Sinh lại `src/payload-types.ts` sau khi đổi collection |
| `npm run generate:importmap` | Sinh lại import map của admin |

## Cấu trúc

```
src/
├─ app/(frontend)/      # Trang public (trang chủ, /giai-phap, ...)
├─ app/(payload)/       # Admin CMS + API Payload
├─ collections/         # Solutions, News, Policies, Leads, Media, Users
├─ globals/             # SiteSettings
├─ components/          # UI, layout, home, solutions, content
├─ lib/                 # payload client, queries, taxonomy, access, utils
├─ fields/              # field dùng chung (slug, status, seo)
└─ seed/                # script seed dữ liệu mẫu
```

## Triển khai production (Docker + PostgreSQL — Viettel Cloud)

Dự án dùng **standalone output** + Docker. File: `Dockerfile`, `docker-compose.yml`, `.dockerignore`.

```bash
# 1. Tạo file .env ở thư mục dự án với tối thiểu:
#    PAYLOAD_SECRET=...            (openssl rand -hex 32)
#    NEXT_PUBLIC_SERVER_URL=https://ten-mien-cua-ban
#    POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
#    DB_PUSH=true                  (CHỈ lần deploy ĐẦU TIÊN để tạo schema)

# 2. Build & chạy
docker compose up -d --build

# 3. Sau khi schema đã tạo xong (lần đầu), đặt lại DB_PUSH=false rồi:
docker compose up -d
```

- App chạy ở cổng 3000 (đặt Nginx reverse proxy + SSL phía trước cho domain).
- Dữ liệu Postgres lưu ở volume `pgdata`; file upload ở volume `media` (khi chưa bật Object Storage).
- Tạo tài khoản admin đầu tiên: truy cập `/admin` (Payload yêu cầu tạo user đầu), hoặc chạy `npm run seed` một lần trong môi trường có `DATABASE_URI` trỏ tới Postgres.

### Lưu trữ ảnh trên Object Storage Viettel IDC (khuyến nghị production)
Mặc định media lưu ở ổ đĩa container (volume `media`). Để đẩy lên **Object Storage Viettel IDC (S3-compatible)** — bền hơn, scale & backup dễ hơn — thêm các biến vào `.env`:
```
S3_BUCKET=ten-bucket
S3_ENDPOINT=https://<endpoint-object-storage-viettel-idc>
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_FORCE_PATH_STYLE=true   # Viettel IDC/Ceph thường cần path-style
```
Khi có `S3_BUCKET`, Payload tự dùng plugin S3 (`src/payload.config.ts`) cho collection `media`; bỏ trống → quay lại lưu local. Lấy bucket/endpoint/access key trên portal Viettel IDC; mở quyền đọc công khai (hoặc qua CDN) để ảnh hiển thị ra web.

### Hạ tầng Viettel IDC
- **Hosting:** Viettel IDC Cloud Server (VPS) chạy Docker, hoặc Kubernetes nếu có. Mở port qua Nginx + SSL.
- **Database:** Postgres tự host trong `docker-compose` (volume `pgdata`) hoặc dùng dịch vụ DB của Viettel IDC (trỏ `DATABASE_URI` tới host đó, bỏ service `db` trong compose).
- **Media:** Object Storage Viettel IDC (mục trên).

### Chuyển dùng migration thật (khuyến nghị sau lần đầu)
```
DB_ADAPTER=postgres DATABASE_URI=... npm run payload migrate:create
DB_ADAPTER=postgres DATABASE_URI=... npm run payload migrate
```
Sau đó giữ `DB_PUSH=false` ở production.

### Database dev vs prod
| | DB_ADAPTER | DATABASE_URI |
|---|---|---|
| Dev | `sqlite` | `file:./payload.db` |
| Prod | `postgres` | `postgres://user:pass@db:5432/dbname` |
