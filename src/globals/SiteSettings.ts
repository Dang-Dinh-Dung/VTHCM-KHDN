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
            {
              name: 'customerLogos',
              type: 'array',
              label: 'Logo khách hàng tin dùng',
              labels: { singular: 'Logo', plural: 'Logo' },
              admin: {
                description:
                  'Logo các khách hàng đang dùng dịch vụ Viettel — hiển thị dạng slide chạy tự động ở trang chủ. Khuyến nghị PNG nền trong suốt.',
              },
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo', required: true },
                { name: 'name', type: 'text', label: 'Tên khách hàng', required: true },
                { name: 'url', type: 'text', label: 'Website (tùy chọn)' },
              ],
            },
          ],
        },
        {
          label: 'Giới thiệu Viettel',
          fields: [
            {
              name: 'aboutEyebrow',
              type: 'text',
              label: 'Nhãn nhỏ (eyebrow)',
              defaultValue: 'Về Viettel',
            },
            {
              type: 'row',
              fields: [
                { name: 'aboutTitleLine1', type: 'text', label: 'Tiêu đề - dòng 1', defaultValue: 'Tiên phong kiến tạo' },
                { name: 'aboutTitleHighlight', type: 'text', label: 'Tiêu đề - dòng 2 (đỏ)', defaultValue: 'tương lai số' },
              ],
            },
            {
              name: 'aboutIntro1',
              type: 'textarea',
              label: 'Đoạn giới thiệu 1',
              defaultValue:
                'Viettel là tập đoàn công nghệ – viễn thông hàng đầu Việt Nam, tiên phong trong lĩnh vực chuyển đổi số và cung cấp các giải pháp công nghệ toàn diện cho doanh nghiệp, tổ chức và cộng đồng.',
            },
            {
              name: 'aboutIntro2',
              type: 'textarea',
              label: 'Đoạn giới thiệu 2',
              defaultValue:
                'Với hạ tầng vững mạnh, hệ sinh thái dịch vụ số đa dạng và đội ngũ chuyên gia giàu kinh nghiệm, Viettel đồng hành cùng doanh nghiệp tối ưu vận hành, nâng cao hiệu quả và bứt phá trong kỷ nguyên số.',
            },
            {
              name: 'aboutHighlights',
              type: 'array',
              label: 'Mục nổi bật (Sứ mệnh, Tầm nhìn...)',
              labels: { singular: 'Mục', plural: 'Mục' },
              admin: {
                description:
                  'Các mục nội dung nổi bật (thêm/bớt tùy ý). Bỏ trống sẽ dùng bộ mặc định (Sứ mệnh, Tầm nhìn).',
              },
              defaultValue: [
                {
                  icon: 'rocket',
                  title: 'Sứ mệnh',
                  description: 'Tiên phong kiến tạo xã hội số vì một cuộc sống tốt đẹp hơn.',
                },
                {
                  icon: 'target',
                  title: 'Tầm nhìn',
                  description:
                    'Trở thành doanh nghiệp công nghệ dẫn dắt chuyển đổi số tại Việt Nam và vươn tầm thế giới.',
                },
              ],
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Biểu tượng',
                  defaultValue: 'rocket',
                  options: [
                    { value: 'rocket', label: 'Bứt phá / tên lửa' },
                    { value: 'target', label: 'Mục tiêu' },
                    { value: 'users', label: 'Khách hàng (người)' },
                    { value: 'globe', label: 'Toàn cầu / quốc tế' },
                    { value: 'team', label: 'Nhân sự / đội ngũ' },
                    { value: 'award', label: 'Giải thưởng / huy chương' },
                    { value: 'star', label: 'Ngôi sao' },
                    { value: 'building', label: 'Doanh nghiệp / tòa nhà' },
                    { value: 'shield', label: 'Bảo mật / khiên' },
                    { value: 'network', label: 'Mạng lưới' },
                    { value: 'heart', label: 'Trái tim / giá trị' },
                    { value: 'lightbulb', label: 'Sáng tạo / ý tưởng' },
                  ],
                },
                { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                { name: 'description', type: 'textarea', label: 'Mô tả', required: true },
              ],
            },
            // Cot cu (Su menh/Tam nhin dang co dinh) - da thay bang aboutHighlights.
            // Giu lai duoi dang an de push schema chi THEM (khong xoa cot) -> khong hoi
            // xac nhan mat du lieu, khong treo push tren moi moi truong (local/Neon/IDC).
            { name: 'aboutMissionTitle', type: 'text', admin: { hidden: true } },
            { name: 'aboutVisionTitle', type: 'text', admin: { hidden: true } },
            { name: 'aboutMissionDesc', type: 'textarea', admin: { hidden: true } },
            { name: 'aboutVisionDesc', type: 'textarea', admin: { hidden: true } },
            {
              type: 'row',
              fields: [
                { name: 'aboutPrimaryCtaLabel', type: 'text', label: 'Nút chính - nhãn', defaultValue: 'Tìm hiểu thêm' },
                { name: 'aboutPrimaryCtaHref', type: 'text', label: 'Nút chính - đường dẫn', defaultValue: '/giai-phap' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'aboutSecondaryCtaLabel', type: 'text', label: 'Nút phụ - nhãn', defaultValue: 'Liên hệ tư vấn' },
                { name: 'aboutSecondaryCtaHref', type: 'text', label: 'Nút phụ - đường dẫn', defaultValue: '/lien-he' },
              ],
            },
            {
              name: 'aboutImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh nền giới thiệu',
              admin: {
                description:
                  'Ảnh làm nền phần Giới thiệu (nét bên phải, mờ trắng dần về trái). Khuyến nghị ảnh ngang, chất lượng cao. Bỏ trống sẽ dùng Ảnh nền hero.',
              },
            },
            {
              name: 'aboutStats',
              type: 'array',
              label: 'Chỉ số tập đoàn',
              labels: { singular: 'Chỉ số', plural: 'Chỉ số' },
              maxRows: 4,
              admin: {
                description: 'Dải chỉ số hiển thị bên dưới phần giới thiệu. Bỏ trống sẽ dùng bộ mặc định.',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Biểu tượng',
                  defaultValue: 'users',
                  options: [
                    { value: 'users', label: 'Khách hàng (người)' },
                    { value: 'globe', label: 'Toàn cầu / quốc tế' },
                    { value: 'team', label: 'Nhân sự / đội ngũ' },
                    { value: 'award', label: 'Giải thưởng / huy chương' },
                    { value: 'star', label: 'Ngôi sao' },
                    { value: 'building', label: 'Doanh nghiệp / tòa nhà' },
                    { value: 'shield', label: 'Bảo mật / khiên' },
                    { value: 'network', label: 'Mạng lưới' },
                    { value: 'rocket', label: 'Bứt phá / tên lửa' },
                    { value: 'target', label: 'Mục tiêu' },
                  ],
                },
                { name: 'value', type: 'text', label: 'Giá trị (vd: 50+)', required: true },
                { name: 'label', type: 'text', label: 'Nhãn', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO & Ảnh nền trang',
          fields: [
            {
              name: 'seoDefaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh chia sẻ mặc định (OG image)',
              admin: {
                description:
                  'Ảnh hiển thị khi chia sẻ link lên Facebook/Zalo/Google cho các trang chưa có ảnh riêng. Khuyến nghị 1200×630px. Bỏ trống sẽ dùng ảnh OG mặc định của hệ thống.',
              },
            },
            {
              name: 'pageSeo',
              type: 'array',
              label: 'SEO & ảnh nền từng trang (trang chủ & các menu)',
              labels: { singular: 'Trang', plural: 'Trang' },
              admin: {
                description:
                  'Đặt tiêu đề/mô tả SEO và ảnh nền hero cho trang chủ và các trang menu. Mỗi trang thêm tối đa 1 dòng. Bỏ trống dòng nào thì trang đó dùng nội dung mặc định.',
              },
              fields: [
                {
                  name: 'page',
                  type: 'select',
                  label: 'Trang',
                  required: true,
                  options: [
                    { value: 'home', label: 'Trang chủ (tên miền chính)' },
                    { value: 'giai-phap', label: 'Giải pháp (danh mục)' },
                    { value: 'bang-gia', label: 'Bảng giá' },
                    { value: 'tim-giai-phap', label: 'Tìm giải pháp' },
                    { value: 'tin-tuc', label: 'Tin tức (danh mục)' },
                    { value: 'chinh-sach', label: 'Nghị định & chính sách (danh mục)' },
                    { value: 'dat-lich', label: 'Đặt lịch tư vấn' },
                    { value: 'lien-he', label: 'Liên hệ' },
                  ],
                },
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Tiêu đề SEO (Meta title)',
                  admin: {
                    description:
                      'Tiêu đề hiển thị trên kết quả Google & tab trình duyệt. Nên 50–60 ký tự, chứa từ khóa chính. Với trang menu, hãy ghi ĐẦY ĐỦ (kể cả thương hiệu) vì nội dung này thay thế toàn bộ tiêu đề.',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Mô tả SEO (Meta description)',
                  admin: { description: 'Đoạn mô tả dưới tiêu đề trên Google. Nên 140–160 ký tự.' },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ảnh chia sẻ riêng (tùy chọn)',
                  admin: { description: 'Ảnh khi chia sẻ link trang này. Bỏ trống sẽ dùng ảnh OG mặc định ở trên.' },
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ảnh nền hero của trang (tùy chọn)',
                  admin: {
                    description:
                      'Ảnh nền cho khối tiêu đề đầu trang (hero). Áp dụng cho các trang: Giải pháp, Bảng giá, Tin tức, Nghị định & chính sách. Khuyến nghị ảnh ngang, chất lượng cao (≥1600px). Bỏ trống sẽ dùng nền mặc định. (Trang chủ dùng "Ảnh nền hero" ở tab Trang chủ.)',
                  },
                },
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
