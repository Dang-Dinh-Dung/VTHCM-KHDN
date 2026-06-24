/**
 * Tu dien phan loai dung chung cho toan he thong (collection options, seed, frontend filter).
 * Giu mot nguon duy nhat de tranh lech du lieu.
 */

export type Option = { value: string; label: string }

/** 6 tru cot "He sinh thai san pham toan dien doanh nghiep" */
export const PILLARS: Array<Option & { color: string; order: number; description: string }> = [
  {
    value: 'vien-thong',
    label: 'Viễn thông',
    color: '#f9b233',
    order: 1,
    description: 'VoiceBrandname, SMSBrandname, 1900/1800, Internet cáp quang, kênh thuê riêng, SIM DATA/M2M, 5G Private, tổng đài OmniX.',
  },
  {
    value: 'chuyen-doi-so',
    label: 'Chuyển đổi số',
    color: '#29abe2',
    order: 2,
    description: 'Hợp đồng điện tử s/vContract, chữ ký số từ xa Mysign, AI-DMS, Camera AI, Callbot/Chatbot, OCR/eKYC.',
  },
  {
    value: 'data-center-an-ninh-mang',
    label: 'Data Center & An ninh mạng',
    color: '#2e3192',
    order: 3,
    description: 'Cloud Server, Object Storage, Colocation, hệ thống an toàn thông tin SOC.',
  },
  {
    value: 'quan-tri-doanh-nghiep',
    label: 'Quản trị doanh nghiệp',
    color: '#39b54a',
    order: 4,
    description: 'IOC, Viettel Pi, bộ giải pháp WORK - HRM - CRM, quản trị tài chính, DMS/Tendoo, hóa đơn vInvoice.',
  },
  {
    value: 'logistics-van-tai-nang-luong',
    label: 'Logistics - Vận tải - Năng lượng',
    color: '#f7931e',
    order: 5,
    description: 'Giải pháp quản lý vận tải, logistics và năng lượng cho doanh nghiệp.',
  },
  {
    value: 'san-pham-hop-tac',
    label: 'Sản phẩm hợp tác',
    color: '#ed1c24',
    order: 6,
    description: 'Giải pháp hợp tác: ngân hàng, nguồn nhân lực.',
  },
]

/** Nhom san pham (theo menu danh muc) */
export const PRODUCT_GROUPS: Option[] = [
  { value: 'thiet-yeu', label: 'Sản phẩm thiết yếu' },
  { value: 'quan-tri', label: 'Quản trị doanh nghiệp' },
  { value: 'cloud', label: 'Viettel Cloud' },
  { value: 'chuyen-nganh', label: 'Sản phẩm chuyên ngành' },
]

/** Nganh nghe - dung cho bo loc & Solution Finder */
export const INDUSTRIES: Option[] = [
  { value: 'ban-le-thuong-mai', label: 'Bán lẻ & thương mại' },
  { value: 'f-and-b', label: 'Nhà hàng - F&B' },
  { value: 'san-xuat', label: 'Sản xuất' },
  { value: 'van-tai-logistics', label: 'Vận tải & logistics' },
  { value: 'giao-duc', label: 'Giáo dục & đào tạo' },
  { value: 'y-te', label: 'Y tế & dược' },
  { value: 'tai-chinh-ngan-hang', label: 'Tài chính & ngân hàng' },
  { value: 'xay-dung-bat-dong-san', label: 'Xây dựng & bất động sản' },
  { value: 'dich-vu', label: 'Dịch vụ chuyên nghiệp' },
  { value: 'nong-nghiep', label: 'Nông nghiệp' },
  { value: 'da-nganh', label: 'Đa ngành / Khác' },
]

/** Nhu cau doanh nghiep - dung cho bo loc & Solution Finder */
export const NEEDS: Option[] = [
  { value: 'vien-thong-ket-noi', label: 'Viễn thông & kết nối' },
  { value: 'van-phong-so', label: 'Văn phòng số & cộng tác' },
  { value: 'hoa-don-ke-toan-chu-ky-so', label: 'Hóa đơn - kế toán - chữ ký số' },
  { value: 'ban-hang-marketing', label: 'Bán hàng & marketing' },
  { value: 'nhan-su-bao-hiem', label: 'Nhân sự & bảo hiểm xã hội' },
  { value: 'cloud-ha-tang', label: 'Cloud & hạ tầng' },
  { value: 'an-ninh-mang', label: 'An ninh mạng' },
  { value: 'logistics-van-tai', label: 'Logistics & vận tải' },
]

/** Quy mo doanh nghiep */
export const COMPANY_SIZES: Option[] = [
  { value: 'sieu-nho', label: 'Siêu nhỏ (dưới 10 nhân sự)' },
  { value: 'nho', label: 'Nhỏ (10 - 50 nhân sự)' },
  { value: 'vua', label: 'Vừa (50 - 200 nhân sự)' },
  { value: 'lon', label: 'Lớn (trên 200 nhân sự)' },
]

/** Phan loai tin tuc */
export const NEWS_CATEGORIES: Option[] = [
  { value: 'tin-viettel', label: 'Tin Viettel' },
  { value: 'chuyen-doi-so', label: 'Chuyển đổi số' },
  { value: 'khuyen-mai', label: 'Khuyến mãi' },
  { value: 'su-kien', label: 'Sự kiện' },
]

/** Loai van ban phap quy */
export const POLICY_TYPES: Option[] = [
  { value: 'luat', label: 'Luật' },
  { value: 'nghi-dinh', label: 'Nghị định' },
  { value: 'thong-tu', label: 'Thông tư' },
  { value: 'quyet-dinh', label: 'Quyết định' },
  { value: 'cong-van', label: 'Công văn' },
]

/** Loai yeu cau lead */
export const LEAD_TYPES: Option[] = [
  { value: 'tu-van', label: 'Tư vấn giải pháp' },
  { value: 'demo', label: 'Đặt lịch demo' },
  { value: 'bao-gia', label: 'Yêu cầu báo giá' },
]

/** Trang thai xu ly lead */
export const LEAD_STATUSES: Option[] = [
  { value: 'moi', label: 'Mới' },
  { value: 'dang-xu-ly', label: 'Đang xử lý' },
  { value: 'da-lien-he', label: 'Đã liên hệ' },
  { value: 'hoan-tat', label: 'Hoàn tất' },
  { value: 'huy', label: 'Hủy' },
]

/** Khung gio mong muon duoc lien he */
export const TIME_SLOTS: Option[] = [
  { value: 'sang', label: 'Buổi sáng (08:00 - 11:00)' },
  { value: 'trua', label: 'Buổi trưa (11:00 - 13:00)' },
  { value: 'chieu', label: 'Buổi chiều (13:00 - 17:00)' },
  { value: 'toi', label: 'Buổi tối (17:00 - 19:00)' },
]

export const STATUS_OPTIONS: Option[] = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Đã xuất bản' },
]

/** Tien ich tra label tu value */
export const labelOf = (options: Option[], value?: string | null): string =>
  options.find((o) => o.value === value)?.label ?? (value ?? '')
