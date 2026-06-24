/**
 * Du lieu seed: catalog giai phap, tin tuc, chinh sach - trich tu he sinh thai san pham Viettel KHDN.
 * Dung slug de lien ket cheo (relatedSolutions) trong qua trinh seed.
 */

export type SeedPricingTier = {
  name: string
  badge?: string
  isContactForPrice?: boolean
  highlight?: boolean
  price?: number
  priceSuffix?: string
  priceLabel?: string
  features: string[]
  ctaLabel?: string
}

export type SeedSolution = {
  title: string
  shortName?: string
  slug: string
  pillar: string
  productGroup?: string
  tagline?: string
  shortDesc: string
  bodyParagraphs?: string[]
  features?: { title: string; description?: string }[]
  faqs?: { question: string; answer: string }[]
  industries?: string[]
  needs?: string[]
  companySizes?: string[]
  pricingNote?: string
  pricingTiers?: SeedPricingTier[]
  relatedSlugs?: string[]
  isFeatured?: boolean
  order?: number
}

export const SOLUTIONS: SeedSolution[] = [
  {
    title: 'Hóa đơn điện tử Sinvoice',
    shortName: 'Sinvoice',
    slug: 'hoa-don-dien-tu-sinvoice',
    pillar: 'chuyen-doi-so',
    productGroup: 'thiet-yeu',
    tagline: 'Phát hành hóa đơn điện tử nhanh, đúng chuẩn Tổng cục Thuế',
    shortDesc:
      'Giải pháp hóa đơn điện tử đáp ứng đầy đủ quy định, tích hợp phần mềm kế toán/bán hàng, phát hành và lưu trữ hóa đơn an toàn.',
    bodyParagraphs: [
      'Sinvoice là giải pháp hóa đơn điện tử của Viettel, đáp ứng đầy đủ Nghị định 123/2020/NĐ-CP và Thông tư 78/2021/TT-BTC.',
      'Hệ thống kết nối trực tiếp Tổng cục Thuế, hỗ trợ hóa đơn có mã và không mã của cơ quan thuế, tích hợp dễ dàng với phần mềm kế toán và bán hàng hiện có của doanh nghiệp.',
    ],
    features: [
      { title: 'Đúng chuẩn pháp lý', description: 'Tuân thủ Nghị định 123 & Thông tư 78, kết nối Tổng cục Thuế.' },
      { title: 'Phát hành tức thì', description: 'Tạo & gửi hóa đơn hàng loạt qua email/SMS chỉ trong vài giây.' },
      { title: 'Lưu trữ an toàn', description: 'Lưu trữ tập trung 10 năm, tra cứu mọi lúc mọi nơi.' },
      { title: 'Tích hợp linh hoạt', description: 'API mở, tích hợp ERP, phần mềm kế toán, bán hàng.' },
    ],
    faqs: [
      {
        question: 'Doanh nghiệp tôi đang dùng phần mềm kế toán khác, có tích hợp được không?',
        answer: 'Có. Sinvoice cung cấp API và các kết nối sẵn với nhiều phần mềm kế toán phổ biến.',
      },
    ],
    industries: ['ban-le-thuong-mai', 'f-and-b', 'san-xuat', 'dich-vu', 'da-nganh'],
    needs: ['hoa-don-ke-toan-chu-ky-so'],
    companySizes: ['sieu-nho', 'nho', 'vua', 'lon'],
    pricingNote: 'Giá theo số lượng hóa đơn. Liên hệ để nhận gói phù hợp.',
    pricingTiers: [
      {
        name: 'Gói khởi đầu',
        priceLabel: '300.000đ',
        priceSuffix: '/300 hóa đơn',
        price: 300000,
        features: ['300 hóa đơn', 'Mẫu hóa đơn cơ bản', 'Hỗ trợ email'],
        ctaLabel: 'Đăng ký tư vấn',
      },
      {
        name: 'Gói doanh nghiệp',
        badge: 'Phổ biến',
        highlight: true,
        priceLabel: 'Từ 0,9đ',
        priceSuffix: '/hóa đơn',
        price: 900,
        features: ['Không giới hạn mẫu', 'Tích hợp API', 'Hỗ trợ 24/7', 'Lưu trữ 10 năm'],
        ctaLabel: 'Đăng ký tư vấn',
      },
      {
        name: 'Gói tùy chỉnh',
        isContactForPrice: true,
        features: ['Triển khai theo yêu cầu', 'SLA riêng', 'Tích hợp ERP chuyên sâu'],
        ctaLabel: 'Liên hệ báo giá',
      },
    ],
    relatedSlugs: ['chu-ky-so-viettel-ca', 'phan-mem-ke-toan-easybooks'],
    isFeatured: true,
    order: 1,
  },
  {
    title: 'Chữ ký số Viettel-CA',
    shortName: 'Viettel-CA',
    slug: 'chu-ky-so-viettel-ca',
    pillar: 'chuyen-doi-so',
    productGroup: 'thiet-yeu',
    tagline: 'Chứng thực chữ ký số an toàn cho doanh nghiệp',
    shortDesc:
      'Dịch vụ chứng thực chữ ký số công cộng giúp doanh nghiệp ký kết, kê khai thuế, BHXH, hải quan điện tử hợp pháp và bảo mật.',
    features: [
      { title: 'Pháp lý đầy đủ', description: 'Được Bộ TT&TT cấp phép, giá trị pháp lý tương đương chữ ký tay.' },
      { title: 'Đa dịch vụ', description: 'Kê khai thuế, BHXH, hải quan, đấu thầu, ký hợp đồng.' },
      { title: 'Nhiều hình thức', description: 'USB Token, HSM, ký số từ xa.' },
    ],
    industries: ['da-nganh'],
    needs: ['hoa-don-ke-toan-chu-ky-so'],
    companySizes: ['sieu-nho', 'nho', 'vua', 'lon'],
    pricingNote: 'Liên hệ để nhận báo giá theo thời hạn gói.',
    pricingTiers: [
      {
        name: 'Gói 1 năm',
        priceLabel: '1.500.000đ',
        price: 1500000,
        features: ['USB Token', 'Hỗ trợ kê khai thuế, BHXH', 'Bảo hành thiết bị'],
      },
      {
        name: 'Gói 3 năm',
        badge: 'Tiết kiệm',
        highlight: true,
        priceLabel: '2.700.000đ',
        price: 2700000,
        features: ['USB Token', 'Tiết kiệm 40%', 'Hỗ trợ ưu tiên'],
      },
    ],
    relatedSlugs: ['ky-so-tu-xa-mysign', 'hoa-don-dien-tu-sinvoice'],
    isFeatured: true,
    order: 2,
  },
  {
    title: 'Ký số từ xa Mysign',
    shortName: 'Mysign',
    slug: 'ky-so-tu-xa-mysign',
    pillar: 'chuyen-doi-so',
    productGroup: 'thiet-yeu',
    tagline: 'Ký số mọi lúc, mọi nơi - không cần USB Token',
    shortDesc:
      'Giải pháp ký số từ xa theo chuẩn eIDAS, ký văn bản trên điện thoại/máy tính an toàn mà không cần thiết bị vật lý.',
    features: [
      { title: 'Không cần USB', description: 'Ký trực tiếp trên điện thoại, laptop.' },
      { title: 'Bảo mật cao', description: 'Xác thực đa lớp, lưu khóa trên HSM đạt chuẩn.' },
      { title: 'Tích hợp dễ', description: 'API ký số nhúng vào quy trình doanh nghiệp.' },
    ],
    industries: ['da-nganh', 'tai-chinh-ngan-hang', 'dich-vu'],
    needs: ['hoa-don-ke-toan-chu-ky-so', 'van-phong-so'],
    companySizes: ['nho', 'vua', 'lon'],
    relatedSlugs: ['chu-ky-so-viettel-ca', 'hop-dong-dien-tu-vcontract'],
    order: 3,
  },
  {
    title: 'Hợp đồng điện tử vContract',
    shortName: 'vContract',
    slug: 'hop-dong-dien-tu-vcontract',
    pillar: 'chuyen-doi-so',
    productGroup: 'thiet-yeu',
    tagline: 'Số hóa toàn bộ quy trình ký kết hợp đồng',
    shortDesc:
      'Nền tảng tạo lập, ký kết và quản lý hợp đồng điện tử, rút ngắn thời gian ký kết từ nhiều ngày xuống vài phút.',
    features: [
      { title: 'Ký kết nhanh', description: 'Gửi - ký - lưu trữ hợp đồng hoàn toàn trực tuyến.' },
      { title: 'Quản lý tập trung', description: 'Theo dõi trạng thái, hạn hợp đồng, nhắc gia hạn.' },
      { title: 'Pháp lý đảm bảo', description: 'Tích hợp chữ ký số, dấu thời gian.' },
    ],
    industries: ['da-nganh', 'tai-chinh-ngan-hang', 'xay-dung-bat-dong-san'],
    needs: ['hoa-don-ke-toan-chu-ky-so', 'van-phong-so'],
    companySizes: ['nho', 'vua', 'lon'],
    relatedSlugs: ['ky-so-tu-xa-mysign'],
    order: 4,
  },
  {
    title: 'Bảo hiểm xã hội điện tử vBHXH',
    shortName: 'vBHXH',
    slug: 'bao-hiem-xa-hoi-dien-tu-vbhxh',
    pillar: 'quan-tri-doanh-nghiep',
    productGroup: 'thiet-yeu',
    tagline: 'Kê khai BHXH điện tử nhanh chóng, chính xác',
    shortDesc:
      'Dịch vụ kê khai bảo hiểm xã hội điện tử giúp doanh nghiệp nộp hồ sơ BHXH trực tuyến, giảm thủ tục giấy tờ.',
    features: [
      { title: 'Kê khai trực tuyến', description: 'Nộp hồ sơ BHXH mọi lúc, không cần đến cơ quan.' },
      { title: 'Cập nhật biểu mẫu', description: 'Tự động cập nhật mẫu mới theo quy định.' },
    ],
    industries: ['da-nganh'],
    needs: ['nhan-su-bao-hiem'],
    companySizes: ['sieu-nho', 'nho', 'vua', 'lon'],
    relatedSlugs: ['chu-ky-so-viettel-ca'],
    order: 5,
  },
  {
    title: 'Nền tảng quản trị doanh nghiệp 1Office',
    shortName: '1Office',
    slug: 'nen-tang-quan-tri-1office',
    pillar: 'quan-tri-doanh-nghiep',
    productGroup: 'quan-tri',
    tagline: 'Quản trị tổng thể: công việc, nhân sự, khách hàng',
    shortDesc:
      'Nền tảng quản trị tổng thể doanh nghiệp gồm WORK, HRM, CRM trên một hệ thống thống nhất, vận hành mọi quy trình nội bộ.',
    features: [
      { title: 'Quản lý công việc', description: 'Giao việc, theo dõi tiến độ, quy trình tự động hóa.' },
      { title: 'Quản lý nhân sự', description: 'Chấm công, tính lương, hồ sơ nhân sự.' },
      { title: 'Quản lý khách hàng', description: 'CRM theo dõi cơ hội, chăm sóc khách hàng.' },
    ],
    industries: ['da-nganh', 'dich-vu', 'san-xuat'],
    needs: ['van-phong-so', 'ban-hang-marketing', 'nhan-su-bao-hiem'],
    companySizes: ['nho', 'vua', 'lon'],
    pricingTiers: [
      {
        name: 'Starter',
        priceLabel: 'Từ 20.000đ',
        priceSuffix: '/người/tháng',
        price: 20000,
        features: ['Quản lý công việc', 'Tối đa 20 người dùng'],
      },
      {
        name: 'Professional',
        badge: 'Phổ biến',
        highlight: true,
        priceLabel: 'Từ 40.000đ',
        priceSuffix: '/người/tháng',
        price: 40000,
        features: ['WORK + HRM + CRM', 'Không giới hạn người dùng', 'Hỗ trợ triển khai'],
      },
      {
        name: 'Enterprise',
        isContactForPrice: true,
        features: ['Tùy biến quy trình', 'Tích hợp hệ thống', 'SLA riêng'],
        ctaLabel: 'Liên hệ báo giá',
      },
    ],
    relatedSlugs: ['phan-mem-ke-toan-easybooks', 'quan-ly-ban-hang-tendoo'],
    isFeatured: true,
    order: 6,
  },
  {
    title: 'Phần mềm kế toán EasyBooks',
    shortName: 'EasyBooks',
    slug: 'phan-mem-ke-toan-easybooks',
    pillar: 'quan-tri-doanh-nghiep',
    productGroup: 'quan-tri',
    tagline: 'Kế toán đơn giản cho doanh nghiệp vừa và nhỏ',
    shortDesc:
      'Phần mềm kế toán trực tuyến giúp doanh nghiệp quản lý sổ sách, báo cáo tài chính, kết nối hóa đơn điện tử và thuế.',
    features: [
      { title: 'Đầy đủ nghiệp vụ', description: 'Thu chi, công nợ, kho, tài sản, báo cáo thuế.' },
      { title: 'Kết nối hóa đơn', description: 'Đồng bộ với Sinvoice, xuất hóa đơn từ phần mềm.' },
    ],
    industries: ['ban-le-thuong-mai', 'dich-vu', 'san-xuat', 'da-nganh'],
    needs: ['hoa-don-ke-toan-chu-ky-so', 'van-phong-so'],
    companySizes: ['sieu-nho', 'nho', 'vua'],
    relatedSlugs: ['hoa-don-dien-tu-sinvoice', 'nen-tang-quan-tri-1office'],
    order: 7,
  },
  {
    title: 'Quản lý bán hàng Tendoo',
    shortName: 'Tendoo',
    slug: 'quan-ly-ban-hang-tendoo',
    pillar: 'quan-tri-doanh-nghiep',
    productGroup: 'thiet-yeu',
    tagline: 'Quản lý bán hàng đa kênh thông minh',
    shortDesc:
      'Giải pháp quản lý bán hàng đa kênh: cửa hàng, online, marketplace - quản lý kho, đơn hàng, khách hàng tập trung.',
    features: [
      { title: 'Bán hàng đa kênh', description: 'Đồng bộ cửa hàng, website, sàn TMĐT.' },
      { title: 'Quản lý kho', description: 'Tồn kho realtime, cảnh báo hết hàng.' },
    ],
    industries: ['ban-le-thuong-mai', 'f-and-b', 'dich-vu'],
    needs: ['ban-hang-marketing'],
    companySizes: ['sieu-nho', 'nho', 'vua'],
    relatedSlugs: ['quan-ly-phan-phoi-dms'],
    order: 8,
  },
  {
    title: 'Quản lý phân phối Viettel DMS',
    shortName: 'Viettel DMS',
    slug: 'quan-ly-phan-phoi-dms',
    pillar: 'quan-tri-doanh-nghiep',
    productGroup: 'chuyen-nganh',
    tagline: 'Số hóa kênh phân phối, giám sát thị trường',
    shortDesc:
      'Hệ thống quản lý phân phối giúp doanh nghiệp giám sát đội ngũ bán hàng, điểm bán, tồn kho và đơn hàng trên toàn tuyến.',
    features: [
      { title: 'Giám sát thị trường', description: 'Theo dõi viếng thăm điểm bán, định vị nhân viên.' },
      { title: 'Quản lý đơn tuyến', description: 'Đặt hàng tại điểm bán, báo cáo tức thì.' },
    ],
    industries: ['ban-le-thuong-mai', 'san-xuat', 'nong-nghiep'],
    needs: ['ban-hang-marketing', 'logistics-van-tai'],
    companySizes: ['vua', 'lon'],
    relatedSlugs: ['quan-ly-ban-hang-tendoo'],
    order: 9,
  },
  {
    title: 'Giám sát hành trình vTracking',
    shortName: 'vTracking',
    slug: 'giam-sat-hanh-trinh-vtracking',
    pillar: 'logistics-van-tai-nang-luong',
    productGroup: 'chuyen-nganh',
    tagline: 'Quản lý đội xe & hành trình vận tải',
    shortDesc:
      'Giải pháp giám sát hành trình, quản lý đội xe theo Nghị định 10/2020, tối ưu chi phí vận hành và nhiên liệu.',
    features: [
      { title: 'Định vị GPS', description: 'Theo dõi vị trí, tốc độ, lộ trình realtime.' },
      { title: 'Tuân thủ quy định', description: 'Báo cáo theo Nghị định 10/2020/NĐ-CP.' },
      { title: 'Tối ưu chi phí', description: 'Giám sát nhiên liệu, cảnh báo vi phạm.' },
    ],
    industries: ['van-tai-logistics', 'san-xuat', 'xay-dung-bat-dong-san'],
    needs: ['logistics-van-tai'],
    companySizes: ['nho', 'vua', 'lon'],
    order: 10,
  },
  {
    title: 'Tin nhắn thương hiệu SMS Brandname',
    shortName: 'SMS Brandname',
    slug: 'tin-nhan-thuong-hieu-sms-brandname',
    pillar: 'vien-thong',
    productGroup: 'thiet-yeu',
    tagline: 'Gửi tin nhắn dưới tên thương hiệu doanh nghiệp',
    shortDesc:
      'Dịch vụ gửi tin nhắn chăm sóc khách hàng, OTP, khuyến mãi hiển thị tên thương hiệu thay cho số điện thoại.',
    features: [
      { title: 'Hiển thị thương hiệu', description: 'Tin nhắn mang tên doanh nghiệp, tăng uy tín.' },
      { title: 'Gửi số lượng lớn', description: 'Hạ tầng Viettel, tốc độ cao, tỷ lệ tới đích lớn.' },
    ],
    industries: ['ban-le-thuong-mai', 'tai-chinh-ngan-hang', 'dich-vu', 'f-and-b'],
    needs: ['vien-thong-ket-noi', 'ban-hang-marketing'],
    companySizes: ['nho', 'vua', 'lon'],
    relatedSlugs: ['tong-dai-da-kenh-omnix'],
    order: 11,
  },
  {
    title: 'Tổng đài chăm sóc khách hàng đa kênh OmniX',
    shortName: 'OmniX',
    slug: 'tong-dai-da-kenh-omnix',
    pillar: 'vien-thong',
    productGroup: 'cloud',
    tagline: 'Tổng đài ảo hợp nhất mọi kênh chăm sóc khách hàng',
    shortDesc:
      'Nền tảng tổng đài đa kênh (thoại, SMS, Zalo, Facebook, email) trên một giao diện, tích hợp Callbot/Chatbot AI.',
    features: [
      { title: 'Hợp nhất đa kênh', description: 'Thoại, Zalo, Facebook, email trong một màn hình.' },
      { title: 'Trợ lý ảo AI', description: 'Callbot/Chatbot tự động trả lời, định tuyến cuộc gọi.' },
    ],
    industries: ['ban-le-thuong-mai', 'tai-chinh-ngan-hang', 'dich-vu', 'y-te'],
    needs: ['vien-thong-ket-noi', 'ban-hang-marketing'],
    companySizes: ['vua', 'lon'],
    relatedSlugs: ['tin-nhan-thuong-hieu-sms-brandname'],
    order: 12,
  },
  {
    title: 'Máy chủ ảo Viettel Cloud Server',
    shortName: 'Cloud Server',
    slug: 'may-chu-ao-cloud-server',
    pillar: 'data-center-an-ninh-mang',
    productGroup: 'cloud',
    tagline: 'Hạ tầng điện toán đám mây trong nước',
    shortDesc:
      'Máy chủ ảo hiệu năng cao đặt tại Data Center Viettel, đảm bảo chủ quyền dữ liệu, mở rộng linh hoạt theo nhu cầu.',
    features: [
      { title: 'Chủ quyền dữ liệu', description: 'Dữ liệu lưu trong nước, tuân thủ quy định.' },
      { title: 'Mở rộng linh hoạt', description: 'Tăng/giảm CPU, RAM, dung lượng tức thì.' },
      { title: 'Uptime cao', description: 'Cam kết SLA, hạ tầng Tier-3.' },
    ],
    industries: ['da-nganh', 'tai-chinh-ngan-hang', 'giao-duc'],
    needs: ['cloud-ha-tang', 'an-ninh-mang'],
    companySizes: ['nho', 'vua', 'lon'],
    pricingTiers: [
      {
        name: 'Cloud Basic',
        priceLabel: 'Từ 200.000đ',
        priceSuffix: '/tháng',
        price: 200000,
        features: ['2 vCPU / 2GB RAM', '40GB SSD', 'Băng thông trong nước'],
      },
      {
        name: 'Cloud Business',
        badge: 'Phổ biến',
        highlight: true,
        priceLabel: 'Từ 650.000đ',
        priceSuffix: '/tháng',
        price: 650000,
        features: ['4 vCPU / 8GB RAM', '100GB SSD', 'Snapshot & backup'],
      },
      {
        name: 'Cloud tùy chỉnh',
        isContactForPrice: true,
        features: ['Cấu hình theo yêu cầu', 'Private cloud', 'Tư vấn kiến trúc'],
        ctaLabel: 'Liên hệ báo giá',
      },
    ],
    relatedSlugs: ['luu-tru-object-storage', 'an-toan-thong-tin-soc'],
    isFeatured: true,
    order: 13,
  },
  {
    title: 'Lưu trữ đám mây Object Storage',
    shortName: 'Object Storage',
    slug: 'luu-tru-object-storage',
    pillar: 'data-center-an-ninh-mang',
    productGroup: 'cloud',
    tagline: 'Lưu trữ không giới hạn, chuẩn S3',
    shortDesc:
      'Dịch vụ lưu trữ đối tượng tương thích chuẩn S3, phù hợp lưu dữ liệu lớn, sao lưu, phân phối nội dung.',
    features: [
      { title: 'Tương thích S3', description: 'Dễ tích hợp với ứng dụng hiện có.' },
      { title: 'Chi phí tối ưu', description: 'Trả tiền theo dung lượng sử dụng.' },
    ],
    industries: ['da-nganh', 'giao-duc'],
    needs: ['cloud-ha-tang'],
    companySizes: ['nho', 'vua', 'lon'],
    relatedSlugs: ['may-chu-ao-cloud-server'],
    order: 14,
  },
  {
    title: 'Hệ thống an toàn thông tin SOC',
    shortName: 'Viettel SOC',
    slug: 'an-toan-thong-tin-soc',
    pillar: 'data-center-an-ninh-mang',
    productGroup: 'chuyen-nganh',
    tagline: 'Giám sát & ứng cứu an ninh mạng 24/7',
    shortDesc:
      'Trung tâm điều hành an ninh mạng (SOC) giám sát, phát hiện và ứng cứu sự cố an toàn thông tin liên tục.',
    features: [
      { title: 'Giám sát 24/7', description: 'Phát hiện sớm tấn công, bất thường.' },
      { title: 'Ứng cứu sự cố', description: 'Đội ngũ chuyên gia phản ứng nhanh.' },
    ],
    industries: ['tai-chinh-ngan-hang', 'y-te', 'da-nganh'],
    needs: ['an-ninh-mang', 'cloud-ha-tang'],
    companySizes: ['vua', 'lon'],
    relatedSlugs: ['may-chu-ao-cloud-server'],
    order: 15,
  },
]

export type SeedNews = {
  title: string
  slug: string
  category: string
  excerpt: string
  bodyParagraphs: string[]
  tags?: string[]
  relatedSlugs?: string[]
  daysAgo?: number
}

export const NEWS: SeedNews[] = [
  {
    title: 'Viettel ra mắt gói giải pháp chuyển đổi số toàn diện cho doanh nghiệp SME',
    slug: 'viettel-goi-giai-phap-chuyen-doi-so-sme',
    category: 'tin-viettel',
    excerpt:
      'Bộ giải pháp tích hợp hóa đơn điện tử, chữ ký số, quản trị doanh nghiệp với mức giá tối ưu dành cho doanh nghiệp vừa và nhỏ.',
    bodyParagraphs: [
      'Viettel chính thức giới thiệu gói giải pháp chuyển đổi số toàn diện, kết hợp các sản phẩm thiết yếu giúp doanh nghiệp SME số hóa nhanh chóng.',
      'Gói bao gồm hóa đơn điện tử Sinvoice, chữ ký số Viettel-CA và nền tảng quản trị 1Office với chính sách ưu đãi khi đăng ký trọn bộ.',
    ],
    tags: ['chuyển đổi số', 'SME', 'ưu đãi'],
    relatedSlugs: ['hoa-don-dien-tu-sinvoice', 'nen-tang-quan-tri-1office'],
    daysAgo: 3,
  },
  {
    title: 'Ưu đãi 40% chữ ký số Viettel-CA gói 3 năm cho khách hàng doanh nghiệp HCM',
    slug: 'uu-dai-chu-ky-so-viettel-ca-3-nam',
    category: 'khuyen-mai',
    excerpt:
      'Đăng ký chữ ký số Viettel-CA gói 3 năm trong tháng này để nhận ưu đãi đặc biệt cùng hỗ trợ kê khai thuế, BHXH.',
    bodyParagraphs: [
      'Nhằm hỗ trợ doanh nghiệp tại TP. Hồ Chí Minh đẩy nhanh số hóa, Viettel triển khai chương trình ưu đãi chữ ký số.',
    ],
    tags: ['khuyến mãi', 'chữ ký số'],
    relatedSlugs: ['chu-ky-so-viettel-ca'],
    daysAgo: 7,
  },
  {
    title: 'Hội thảo: Lộ trình chuyển đổi số cho doanh nghiệp sản xuất tại TP.HCM',
    slug: 'hoi-thao-chuyen-doi-so-doanh-nghiep-san-xuat',
    category: 'su-kien',
    excerpt:
      'Sự kiện chia sẻ giải pháp DMS, IoT, Cloud cho doanh nghiệp sản xuất, kèm tư vấn 1-1 cùng chuyên gia Viettel.',
    bodyParagraphs: [
      'Phòng KHDN Viettel HCM tổ chức hội thảo chuyên đề về chuyển đổi số cho ngành sản xuất.',
    ],
    tags: ['sự kiện', 'sản xuất'],
    relatedSlugs: ['quan-ly-phan-phoi-dms', 'may-chu-ao-cloud-server'],
    daysAgo: 14,
  },
]

export type SeedPolicy = {
  title: string
  slug: string
  documentType: string
  documentNumber?: string
  issuingBody?: string
  summary: string
  bodyParagraphs?: string[]
  sourceUrl?: string
  relatedSlugs?: string[]
  effectiveDateISO?: string
}

export const POLICIES: SeedPolicy[] = [
  {
    title: 'Nghị định 123/2020/NĐ-CP quy định về hóa đơn, chứng từ',
    slug: 'nghi-dinh-123-2020-hoa-don-chung-tu',
    documentType: 'nghi-dinh',
    documentNumber: '123/2020/NĐ-CP',
    issuingBody: 'Chính phủ',
    summary:
      'Quy định bắt buộc sử dụng hóa đơn điện tử với hầu hết doanh nghiệp. Doanh nghiệp cần triển khai giải pháp hóa đơn điện tử đúng chuẩn để tuân thủ.',
    bodyParagraphs: [
      'Nghị định 123/2020/NĐ-CP cùng Thông tư 78/2021/TT-BTC quy định lộ trình áp dụng hóa đơn điện tử trên toàn quốc.',
      'Doanh nghiệp cần lựa chọn nhà cung cấp hóa đơn điện tử được kết nối với Tổng cục Thuế như Sinvoice để đảm bảo tuân thủ.',
    ],
    sourceUrl: 'https://vanban.chinhphu.vn',
    relatedSlugs: ['hoa-don-dien-tu-sinvoice'],
    effectiveDateISO: '2020-10-19',
  },
  {
    title: 'Nghị định 10/2020/NĐ-CP về kinh doanh và điều kiện kinh doanh vận tải bằng xe ô tô',
    slug: 'nghi-dinh-10-2020-kinh-doanh-van-tai',
    documentType: 'nghi-dinh',
    documentNumber: '10/2020/NĐ-CP',
    issuingBody: 'Chính phủ',
    summary:
      'Yêu cầu lắp đặt thiết bị giám sát hành trình với xe kinh doanh vận tải. Doanh nghiệp vận tải cần giải pháp giám sát hành trình hợp chuẩn.',
    bodyParagraphs: [
      'Nghị định quy định xe kinh doanh vận tải phải lắp thiết bị giám sát hành trình, truyền dữ liệu về cơ quan quản lý.',
    ],
    sourceUrl: 'https://vanban.chinhphu.vn',
    relatedSlugs: ['giam-sat-hanh-trinh-vtracking'],
    effectiveDateISO: '2020-04-01',
  },
  {
    title: 'Luật Giao dịch điện tử 2023 - nền tảng pháp lý cho ký số & hợp đồng điện tử',
    slug: 'luat-giao-dich-dien-tu-2023',
    documentType: 'luat',
    documentNumber: '20/2023/QH15',
    issuingBody: 'Quốc hội',
    summary:
      'Mở rộng giá trị pháp lý của giao dịch điện tử, chữ ký số và hợp đồng điện tử, thúc đẩy doanh nghiệp số hóa quy trình ký kết.',
    bodyParagraphs: [
      'Luật Giao dịch điện tử 2023 công nhận rộng rãi giá trị pháp lý của thông điệp dữ liệu, chữ ký điện tử và hợp đồng điện tử.',
    ],
    sourceUrl: 'https://vanban.chinhphu.vn',
    relatedSlugs: ['ky-so-tu-xa-mysign', 'hop-dong-dien-tu-vcontract', 'chu-ky-so-viettel-ca'],
    effectiveDateISO: '2024-07-01',
  },
]
