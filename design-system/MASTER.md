# Design System — KHDN Viettel HCM Landing Page

> Sinh từ skill **ui-ux-pro-max** (pattern "Enterprise Gateway" + style "Trust & Authority"),
> **điều chỉnh** để giữ bản sắc thương hiệu Viettel (đỏ #EE0033 là màu chính, không thay bằng navy).

## Pattern: Enterprise Gateway
- Path selection ("Doanh nghiệp của bạn thuộc ngành...") + mega menu giải pháp.
- **Trust signals nổi bật**: số liệu, logo khách hàng, chứng nhận, bảo mật.
- CTA chính: **"Đặt lịch tư vấn / Liên hệ KHDN"**; phụ: "Tìm giải pháp".
- Bố cục: Hero (sứ mệnh) → Giải pháp theo ngành/nhu cầu → Hệ sinh thái → Số liệu/uy tín → Tin tức/chính sách → Liên hệ.

## Style: Trust & Authority
- Hiển thị uy tín: số liệu có ý nghĩa, case study, badge bảo mật/chứng nhận.
- Sạch, nhiều khoảng thở, bo góc vừa, shadow tiết chế nhất quán.
- Hỗ trợ Light đầy đủ (Dark để sau). Mục tiêu tương phản **WCAG AA+**.

## Bảng màu (đã hòa thương hiệu Viettel)
| Vai trò | Hex | Token |
|--------|-----|-------|
| Thương hiệu / CTA chính | `#EE0033` (Viettel đỏ) | `--color-viettel-red` |
| CTA hover | `#C4002B` | `--color-viettel-red-dark` |
| Mực/Heading (navy) | `#0F172A` | `--color-ink` |
| Chữ phụ (slate) | `#334155` | `--color-ink-soft` |
| Nền | `#FFFFFF` | `--color-surface` |
| Nền dịu | `#F8FAFC` | `--color-surface-muted` |
| Viền | `#E2E8F0` | `--color-border-soft` |
| Accent phụ (xanh, dùng tiết chế) | `#0369A1` | `--color-accent` |
| Thành công | `#15803D` | `--color-success` |
| Lỗi/Destructive | `#DC2626` | `--color-destructive` |

> 6 màu trụ cột hệ sinh thái giữ nguyên (telecom/digital/datacenter/governance/logistics/partner).

## Typography
- Giữ **Be Vietnam Pro** (hỗ trợ tiếng Việt tốt nhất, mood corporate/trustworthy tương đương Lexend đề xuất).
- Type scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48. Body 16px, line-height 1.6.
- Weight: heading 700–800, label 500–600, body 400.

## Hiệu ứng
- Hover mượt 150–300ms (transform/opacity), card nhấc nhẹ, số liệu reveal, badge hover.
- Tôn trọng `prefers-reduced-motion`. Không animate width/height.

## Tránh (anti-patterns)
- Thiết kế "playful", gradient tím/hồng kiểu AI.
- Emoji làm icon hệ thống (dùng SVG — Lucide/Heroicons).
- Chữ xám-trên-xám, tương phản thấp.

## Checklist trước khi giao
- [ ] Không emoji làm icon (SVG inline) · [ ] cursor-pointer mọi phần tử bấm
- [ ] Hover/focus rõ, transition 150–300ms · [ ] Tương phản ≥ 4.5:1
- [ ] Focus ring cho bàn phím · [ ] Tôn trọng reduced-motion
- [ ] Responsive 375 / 768 / 1024 / 1440 · [ ] Touch target ≥ 44px
