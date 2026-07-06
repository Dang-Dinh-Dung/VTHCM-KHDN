import { ArrowRight, Award, Globe2, Rocket, Target, Users, UsersRound } from 'lucide-react'

import { ButtonLink, Container, Section } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import type { Media, SiteSetting } from '@/payload-types'

/** Chi so tap doan Viettel (cap tap doan - dung chung, khong lay tu DB). */
const CORP_STATS = [
  { icon: Users, value: '50+', label: 'Triệu khách hàng' },
  { icon: Globe2, value: '10+', label: 'Thị trường quốc tế' },
  { icon: UsersRound, value: '60.000+', label: 'Nhân sự toàn cầu' },
  { icon: Award, value: 'Top 1', label: 'Doanh nghiệp viễn thông lớn nhất Việt Nam' },
]

/** Anh minh hoa cot phai: uu tien anh nen hero upload trong admin, ban lon. */
function imageUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    return sizes?.og?.url ?? ref.url ?? undefined
  }
  return undefined
}

export function AboutViettel({ settings }: { settings: SiteSetting }) {
  const imgUrl = imageUrl(settings.heroImage)

  return (
    <Section className="relative overflow-hidden bg-surface pt-12 md:pt-16">
      {/* Nen trang tri do nhe goc phai */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-[36rem] opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
        aria-hidden
      />
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Cot trai: gioi thieu */}
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-viettel-red">
              <span className="h-0.5 w-8 bg-viettel-red" aria-hidden />
              Về Viettel
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.15] text-ink md:text-[2.6rem]">
              Tiên phong kiến tạo
              <br />
              <span className="text-viettel-red">tương lai số</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
              Viettel là tập đoàn công nghệ – viễn thông hàng đầu Việt Nam, tiên phong trong lĩnh vực
              chuyển đổi số và cung cấp các giải pháp công nghệ toàn diện cho doanh nghiệp, tổ chức và
              cộng đồng.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
              Với hạ tầng vững mạnh, hệ sinh thái dịch vụ số đa dạng và đội ngũ chuyên gia giàu kinh
              nghiệm, Viettel đồng hành cùng doanh nghiệp tối ưu vận hành, nâng cao hiệu quả và bứt
              phá trong kỷ nguyên số.
            </p>

            {/* Su menh + Tam nhin */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
                  <Rocket className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">Sứ mệnh</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Tiên phong kiến tạo xã hội số vì một cuộc sống tốt đẹp hơn.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:border-l sm:border-border-soft sm:pl-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
                  <Target className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">Tầm nhìn</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Trở thành doanh nghiệp công nghệ dẫn dắt chuyển đổi số tại Việt Nam và vươn tầm
                    thế giới.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/giai-phap" variant="primary" size="lg">
                Tìm hiểu thêm
                <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/lien-he" variant="outline" size="lg">
                Liên hệ tư vấn
                <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>

          {/* Cot phai: anh minh hoa Viettel */}
          <Reveal delay={120} className="relative">
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-viettel-red/15 ring-1 ring-black/5">
              {imgUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt="Viettel - Tập đoàn công nghệ viễn thông hàng đầu Việt Nam"
                    className="h-[24rem] w-full object-cover md:h-[30rem]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 55%, rgba(163,14,40,0.55) 100%)',
                    }}
                    aria-hidden
                  />
                </>
              ) : (
                // Fallback khi chua co anh: tam thuong hieu do
                <div
                  className="flex h-[24rem] w-full items-center justify-center md:h-[30rem]"
                  style={{
                    background:
                      'linear-gradient(135deg, #8f0c22 0%, #c8132f 45%, #e11537 70%, #a30e28 100%)',
                  }}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl font-black tracking-tight md:text-5xl">Viettel</div>
                    <div className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/85">
                      Theo cách của bạn
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Dai chi so tap doan */}
        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 rounded-3xl border border-border-soft bg-surface-muted/60 p-7 md:mt-14 md:grid-cols-4 md:p-8">
            {CORP_STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viettel-red/10 text-viettel-red">
                  <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <div className="text-2xl font-extrabold leading-none text-viettel-red md:text-3xl">
                    {value}
                  </div>
                  <div className="mt-1.5 text-sm leading-snug text-ink-soft">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
