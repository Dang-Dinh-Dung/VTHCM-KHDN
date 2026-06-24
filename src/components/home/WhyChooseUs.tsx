import { Award, Banknote, Headset, Rocket, ScrollText, ShieldCheck } from 'lucide-react'

import { Container, Section, SectionHeading } from '@/components/ui/primitives'

const ADVANTAGES = [
  {
    icon: Award,
    title: 'Uy tín tập đoàn Viettel',
    desc: 'Đồng hành cùng hàng trăm nghìn doanh nghiệp, hạ tầng và dịch vụ hàng đầu Việt Nam.',
  },
  {
    icon: ScrollText,
    title: 'Tuân thủ pháp lý',
    desc: 'Giải pháp đáp ứng đầy đủ nghị định, thông tư của cơ quan quản lý nhà nước.',
  },
  {
    icon: Rocket,
    title: 'Triển khai nhanh',
    desc: 'Tư vấn, cài đặt và đào tạo sử dụng nhanh chóng, đưa vào vận hành trong thời gian ngắn.',
  },
  {
    icon: Headset,
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ kỹ thuật và chăm sóc khách hàng doanh nghiệp túc trực mọi lúc.',
  },
  {
    icon: ShieldCheck,
    title: 'An toàn & chủ quyền dữ liệu',
    desc: 'Dữ liệu lưu trữ tại Data Center Viettel trong nước, đạt chuẩn an toàn thông tin.',
  },
  {
    icon: Banknote,
    title: 'Tối ưu chi phí',
    desc: 'Đa dạng gói dịch vụ theo quy mô, giúp doanh nghiệp tối ưu ngân sách đầu tư.',
  },
]

export function WhyChooseUs() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Vì sao chọn chúng tôi"
          title="Đối tác chuyển đổi số tin cậy của doanh nghiệp"
          description="Phòng KHDN Viettel HCM mang đến giải pháp toàn diện cùng cam kết về chất lượng, pháp lý và đồng hành lâu dài."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border-soft bg-surface p-6 transition-all hover:-translate-y-1 hover:border-viettel-red/30 hover:shadow-brand"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-viettel-red/10 text-viettel-red transition-colors group-hover:bg-viettel-red group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mb-1.5 text-lg font-bold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
