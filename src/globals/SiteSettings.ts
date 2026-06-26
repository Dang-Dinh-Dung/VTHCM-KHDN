import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình website',
  admin: { group: 'Hệ thống' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Liên hệ',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo website (header)',
              admin: {
                description:
                  'Logo hiển thị ở góc trái header. Khuyến nghị PNG nền trong suốt, cao ~80px. Bỏ trống sẽ dùng logo chữ mặc định.',
              },
            },
            {
              name: 'departmentName',
              type: 'text',
              label: 'Tên phòng/đơn vị',
              defaultValue: 'Phòng Khách hàng Doanh nghiệp - Viettel Hồ Chí Minh',
            },
            {
              type: 'row',
              fields: [
                { name: 'hotline', type: 'text', label: 'Hotline', defaultValue: '1800 8000' },
                { name: 'email', type: 'text', label: 'Email', defaultValue: 'khdn.hcm@viettel.com.vn' },
              ],
            },
            { name: 'address', type: 'textarea', label: 'Địa chỉ' },
            { name: 'workingHours', type: 'text', label: 'Giờ làm việc', defaultValue: 'Thứ 2 - Thứ 7, 08:00 - 17:30' },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Link nhúng Google Maps (iframe src)',
              admin: {
                description:
                  'Dùng link EMBED: Google Maps → Chia sẻ → "Nhúng bản đồ" → copy src (dạng https://www.google.com/maps/embed?pb=...). KHÔNG dùng link chia sẻ thường (sẽ bị chặn). Bỏ trống sẽ tự tạo bản đồ từ Địa chỉ.',
              },
            },
            {
              name: 'zaloOaUrl',
              type: 'text',
              label: 'Link Zalo OA',
              admin: {
                description:
                  'Đường dẫn Zalo Official Account (vd: https://zalo.me/<oa_id>). Có giá trị sẽ hiện nút Zalo nổi ở góc dưới phải.',
              },
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Mạng xã hội',
              labels: { singular: 'Liên kết', plural: 'Liên kết' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Nền tảng',
                  options: [
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'zalo', label: 'Zalo' },
                    { value: 'youtube', label: 'YouTube' },
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'tiktok', label: 'TikTok' },
                  ],
                },
                { name: 'url', type: 'text', label: 'Đường dẫn', required: true },
              ],
            },
          ],
        },
        {
          label: 'Trang chủ (Hero)',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              label: 'Tiêu đề lớn',
              defaultValue: 'Giải pháp chuyển đổi số toàn diện cho doanh nghiệp',
            },
            {
              name: 'heroSubheadline',
              type: 'textarea',
              label: 'Mô tả dưới tiêu đề',
              defaultValue:
                'Hệ sinh thái sản phẩm Viettel: viễn thông, chữ ký số, hóa đơn điện tử, cloud, quản trị doanh nghiệp - đồng hành cùng doanh nghiệp tại TP. Hồ Chí Minh.',
            },
            {
              type: 'row',
              fields: [
                { name: 'heroPrimaryCtaLabel', type: 'text', label: 'Nút chính', defaultValue: 'Tìm giải pháp phù hợp' },
                { name: 'heroSecondaryCtaLabel', type: 'text', label: 'Nút phụ', defaultValue: 'Đặt lịch tư vấn' },
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Ảnh nền hero' },
            {
              name: 'stats',
              type: 'array',
              label: 'Số liệu nổi bật',
              labels: { singular: 'Số liệu', plural: 'Số liệu' },
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', label: 'Giá trị (vd: 50+)', required: true },
                { name: 'label', type: 'text', label: 'Nhãn', required: true },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerNote', type: 'textarea', label: 'Ghi chú chân trang' },
            { name: 'copyright', type: 'text', label: 'Dòng bản quyền', defaultValue: '© Viettel Telecom - KHDN Hồ Chí Minh' },
          ],
        },
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
      ],
    },
  ],
}
