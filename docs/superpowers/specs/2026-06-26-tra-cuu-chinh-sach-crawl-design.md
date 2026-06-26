# Thiết kế: Trang tra cứu Nghị định & Chính sách + Crawl theo lịch từ chinhphu.vn

- Ngày: 2026-06-26
- Trạng thái: Đã duyệt thiết kế (chờ review spec)
- Phạm vi: Landing page KHDN Viettel HCM (Next.js 16 + Payload CMS 3)

## 1. Mục tiêu

Hai phần liên quan:

A. **Thiết kế lại giao diện công khai** `/chinh-sach` theo phong cách cổng tra cứu văn bản pháp quy (tham khảo bố cục chức năng của vanban.chinhphu.vn — KHÔNG sao chép logo/tài sản/nội dung gốc), dùng nhận diện Viettel.

B. **Crawler theo lịch** lấy metadata văn bản từ vanban.chinhphu.vn, **lọc theo từ khóa liên quan doanh nghiệp**, đưa vào **hàng chờ duyệt** trong admin (văn bản chỉ hiện công khai sau khi editor duyệt).

Không làm: republish toàn văn văn bản; crawl không lọc; cron tần suất cao hơn 1 lần/ngày (giới hạn Vercel Hobby).

## 2. Mô hình dữ liệu (sửa collection `src/collections/Policies.ts`)

Giữ nguyên các field hiện có (`title`, `summary`, `documentType`, `documentNumber`, `issuingBody`, `effectiveDate`, `sourceUrl`, `body`, `attachment`, `relatedSolutions`, `coverImage`, `status`, `slug`, SEO).

Thêm:
- `source`: `select` = `manual | crawl`, mặc định `manual`, position sidebar, index. Đánh dấu nguồn gốc bản ghi.
- `crawledAt`: `date`, position sidebar, chỉ set khi crawl về.

Cơ chế hàng chờ duyệt: **tái dùng `status`** (draft/published) sẵn có. Văn bản crawl về tạo với `status='draft'`. Frontend đã lọc `readPublished` → bản draft không hiện công khai cho tới khi editor đổi sang `published`. Không cần thêm trạng thái mới.

Dedupe: trước khi tạo, query Policies theo `documentNumber` (nếu có) hoặc `sourceUrl`. Nếu đã tồn tại → bỏ qua (không tạo trùng, không ghi đè bản editor đã sửa).

## 3. Cấu hình từ khóa (global `src/globals/SiteSettings.ts`)

Thêm group/field:
- `policyCrawlEnabled`: `checkbox`, mặc định `false`. Công tắc tổng để bật/tắt crawl.
- `policyCrawlKeywords`: `array` of `{ keyword: text }` (hoặc `text` hasMany). Mặc định seed: `hóa đơn điện tử`, `chữ ký số`, `bảo hiểm xã hội`, `thuế`, `hợp đồng điện tử`, `vận tải`, `chuyển đổi số`, `an toàn thông tin`. Admin tự chỉnh.

Khớp từ khóa: không phân biệt hoa/thường + bỏ dấu (so khớp trên `title` + `summary`/trích yếu lấy được). Một văn bản khớp ≥1 từ khóa thì lấy.

## 4. Crawler

### 4.1 `src/lib/crawler/chinhphu.ts`
- Hàm `fetchPolicyCandidates(opts): Promise<CrawledPolicy[]>`.
- `CrawledPolicy = { title, documentNumber?, documentType?, issuingBody?, effectiveDate?, summary?, sourceUrl }`.
- Tải trang danh sách văn bản mới của vanban.chinhphu.vn bằng `fetch` (User-Agent rõ ràng), parse HTML bằng **cheerio**.
- Map loại văn bản text → value trong `POLICY_TYPES` (`luat/nghi-dinh/thong-tu/quyet-dinh/cong-van`); không khớp → `nghi-dinh` mặc định hoặc bỏ trống.
- Parse `effectiveDate`/ngày ban hành sang ISO (an toàn, lỗi thì để trống).
- **Chỉ lấy metadata + link nguồn**, không tải/republish toàn văn.
- Tôn trọng `robots.txt` (kiểm tra path được phép), giới hạn số trang/bản ghi mỗi lần (vd tối đa 50).
- Lỗi mạng/parse: ném lỗi có thông điệp rõ để caller log; KHÔNG nuốt lỗi ở tầng này (caller quyết định).

> Ghi chú quan trọng: cấu trúc HTML thật của trang nguồn chưa biết tại thời điểm viết spec. Selector cụ thể PHẢI được dò trên trang thật lúc triển khai (lưu 1 HTML fixture để test), và có thể cần chỉnh nhiều lần. Crawler vốn dễ vỡ khi nguồn đổi giao diện.

### 4.2 Route `src/app/(frontend)/api/cron/crawl-policies/route.ts`
- `GET`. Xác thực: header `Authorization: Bearer $CRON_SECRET` hoặc query `?secret=` khớp `process.env.CRON_SECRET`. Sai → 401.
- Đọc SiteSettings: nếu `policyCrawlEnabled=false` → trả `{ skipped: true }`.
- Gọi `fetchPolicyCandidates`, lọc theo `policyCrawlKeywords`.
- Với mỗi ứng viên: dedupe; nếu mới → `payload.create({ collection:'policies', data:{ ...metadata, source:'crawl', crawledAt:now, status:'draft' }, overrideAccess:true })`.
- Bọc `try/catch` từng item (lỗi 1 item không chặn item khác). Route **không bao giờ trả 500 do lỗi parse/item** — trả JSON `{ ok, fetched, matched, created, skipped, errors[] }` và log `console.error` chi tiết.

### 4.3 Lịch chạy `vercel.json`
```json
{ "crons": [ { "path": "/api/cron/crawl-policies", "schedule": "0 1 * * *" } ] }
```
Chạy ~08:00 giờ VN (01:00 UTC), 1 lần/ngày (phù hợp giới hạn Hobby). Vercel Cron gọi kèm cơ chế xác thực của Vercel; vẫn kiểm `CRON_SECRET` để chặn gọi ngoài.

### 4.4 Biến môi trường
- `CRON_SECRET` (bắt buộc khi bật crawl). Thêm vào `.env.example` (để trống) và Vercel env.

## 5. Giao diện công khai `/chinh-sach`

Bố cục: **sidebar lọc trái + danh sách/bảng phải**, lọc qua URL (`force-dynamic`).

- **Sidebar trái** (`src/components/content/PolicyFilters.tsx`, client component điều hướng bằng URL):
  - Ô tìm kiếm: khớp `title` / `documentNumber` / `summary`.
  - Loại văn bản: checkbox theo `POLICY_TYPES`.
  - Cơ quan ban hành: select/checkbox lấy từ giá trị `issuingBody` distinct trong dữ liệu (hoặc danh sách cấu hình).
  - Năm hiệu lực: select theo năm.
  - Mobile: sidebar thu thành nút "Bộ lọc" mở drawer.
- **Danh sách phải** (dạng list/table rows):
  - Mỗi dòng: badge **số hiệu** + nhãn loại, **trích yếu** (link `/chinh-sach/[slug]`), **cơ quan**, **ngày hiệu lực**.
  - Phân trang giữ filter trên URL.
  - Empty state khi không có kết quả.
- Truy vấn: mở rộng `getPoliciesList` trong `src/lib/queries.ts` nhận thêm `q`, `issuingBody`, `year` (ngoài `documentType`, `page`). Chỉ trả `status=published`.
- Branding: đỏ Viettel + neutral; bảng sạch, dễ đọc; tuân thủ a11y (tương phản, focus, label).
- Trang chi tiết `/chinh-sach/[slug]`: giữ nguyên, tinh chỉnh nhẹ (hiển thị rõ số hiệu/cơ quan/ngày + nút mở "văn bản gốc" theo `sourceUrl`).

## 6. (Tùy chọn) Thẻ nhắc Dashboard admin

Thêm vào component dashboard admin (mẫu giống `AdminLeadDashboard`): thẻ "X văn bản chờ duyệt" đếm `policies` có `source=crawl & status=draft`, link tới danh sách đã lọc `/admin/collections/policies?where[...]`. Nếu thêm component mới vào `beforeDashboard` → **phải chạy lại `generate:importmap`** (xem bài học importmap-plugin-gotcha).

## 7. Xử lý lỗi

- Crawler tầng route: try/catch từng item; route trả JSON thống kê, không 500 vì lỗi item/parse; log lỗi.
- Dedupe chống tạo trùng và chống ghi đè bản editor đã chỉnh.
- Parse ngày/loại an toàn (lỗi → để trống, không chặn).
- Nguồn đổi cấu trúc → fetch trả 0 ứng viên → log cảnh báo, không crash; admin vẫn nhập tay được.
- Frontend lọc rỗng/sai → hiển thị empty state.

## 8. Kiểm thử / Verification

- **Crawler parse:** test với HTML fixture lưu sẵn (vì cấu trúc nguồn chưa biết) → khẳng định map đúng field; chạy thật 1 lần local gọi route với `CRON_SECRET` để dò selector trên trang thật.
- **Dedupe:** chạy crawl 2 lần → lần 2 `created=0`.
- **Keyword filter:** văn bản không khớp từ khóa → không tạo.
- **Frontend:** lọc theo loại/cơ quan/năm/tìm kiếm phản ánh đúng trên URL và kết quả; bản draft (crawl) KHÔNG hiện; sau khi publish thì hiện.
- **Quyền:** route cron không có secret → 401.
- `npm run build` pass; nếu sửa `beforeDashboard` → importMap regenerate.

## 9. Rủi ro & phụ thuộc

- **Crawler dễ vỡ** theo cấu trúc HTML nguồn; cần dò selector trên trang thật, có thể chỉnh nhiều lần; bảo trì định kỳ.
- **Pháp lý/ToS:** chỉ metadata + tóm tắt + link gốc; tôn trọng robots.txt; không republish toàn văn.
- **Giới hạn Vercel Hobby:** cron tối đa 1 lần/ngày.
- Thêm dependency **cheerio**.
- Duyệt thủ công là chốt chặn chất lượng cuối.

## 10. Đơn vị triển khai (tóm tắt)

1. Sửa data model `Policies` (+`source`,`crawledAt`) + `generate:types`.
2. Thêm cấu hình crawl vào `SiteSettings` (+ seed keywords) + `generate:types`.
3. `src/lib/crawler/chinhphu.ts` (+ fixture test).
4. Route cron `/api/cron/crawl-policies` + `vercel.json` + `CRON_SECRET` vào `.env.example`.
5. Redesign `/chinh-sach`: `PolicyFilters` + danh sách dạng bảng; mở rộng `getPoliciesList`.
6. (Tùy chọn) thẻ Dashboard chờ duyệt (+ importmap regenerate).
7. Build verify.
