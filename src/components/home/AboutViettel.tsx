import {
  ArrowRight,
  Award,
  Building2,
  Globe2,
  Heart,
  Lightbulb,
  type LucideIcon,
  Network,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  Users,
  UsersRound,
} from 'lucide-react'

import { ButtonLink, Container, Section } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import type { Media, SiteSetting } from '@/payload-types'

/** Cac muc noi bat mac dinh (dung khi admin chua cau hinh). */
const DEFAULT_HIGHLIGHTS = [
  { icon: 'rocket', title: 'Sứ mệnh', description: 'Tiên phong kiến tạo xã hội số vì một cuộc sống tốt đẹp hơn.' },
  {
    icon: 'target',
    title: 'Tầm nhìn',
    description: 'Trở thành doanh nghiệp công nghệ dẫn dắt chuyển đổi số tại Việt Nam và vươn tầm thế giới.',
  },
]

/** Bo chi so tap doan mac dinh (dung khi admin chua cau hinh). */
const DEFAULT_STATS = [
  { icon: 'users', value: '50+', label: 'Triệu khách hàng' },
  { icon: 'globe', value: '10+', label: 'Thị trường quốc tế' },
  { icon: 'team', value: '60.000+', label: 'Nhân sự toàn cầu' },
  { icon: 'award', value: 'Top 1', label: 'Doanh nghiệp viễn thông lớn nhất Việt Nam' },
]

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  globe: Globe2,
  team: UsersRound,
  award: Award,
  star: Star,
  building: Building2,
  shield: ShieldCheck,
  network: Network,
  rocket: Rocket,
  target: Target,
  heart: Heart,
  lightbulb: Lightbulb,
}

/** Anh minh hoa: uu tien aboutImage, roi den heroImage, ban lon. */
function imageUrl(ref: number | Media | null | undefined): string | undefined {
  if (ref && typeof ref === 'object' && 'url' in ref) {
    const sizes = (ref as Media).sizes
    return sizes?.og?.url ?? ref.url ?? undefined
  }
  return undefined
}

export function AboutViettel({ settings }: { settings: SiteSetting }) {
  const imgUrl = imageUrl(settings.aboutImage) ?? imageUrl(settings.heroImage)

  const eyebrow = settings.aboutEyebrow || 'Về Viettel'
  const titleLine1 = settings.aboutTitleLine1 || 'Tiên phong kiến tạo'
  const titleHighlight = settings.aboutTitleHighlight || 'tương lai số'
  const intro1 =
    settings.aboutIntro1 ||
    'Viettel là tập đoàn công nghệ – viễn thông hàng đầu Việt Nam, tiên phong trong lĩnh vực chuyển đổi số và cung cấp các giải pháp công nghệ toàn diện cho doanh nghiệp, tổ chức và cộng đồng.'
  const intro2 =
    settings.aboutIntro2 ||
    'Với hạ tầng vững mạnh, hệ sinh thái dịch vụ số đa dạng và đội ngũ chuyên gia giàu kinh nghiệm, Viettel đồng hành cùng doanh nghiệp tối ưu vận hành, nâng cao hiệu quả và bứt phá trong kỷ nguyên số.'
  const highlights =
    settings.aboutHighlights && settings.aboutHighlights.length > 0
      ? settings.aboutHighlights
      : DEFAULT_HIGHLIGHTS
  const primaryLabel = settings.aboutPrimaryCtaLabel || 'Tìm hiểu thêm'
  const primaryHref = settings.aboutPrimaryCtaHref || '/giai-phap'
  const secondaryLabel = settings.aboutSecondaryCtaLabel || 'Liên hệ tư vấn'
  const secondaryHref = settings.aboutSecondaryCtaHref || '/lien-he'

  const stats =
    settings.aboutStats && settings.aboutStats.length > 0 ? settings.aboutStats : DEFAULT_STATS

  return (
    <Section className="relative overflow-hidden bg-surface pt-12 md:pt-16">
      {/* Anh nen: net ben phai, mo trang dan ve trai de chu de doc (chi desktop) */}
      {imgUrl ? (
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[72%] object-cover object-center"
          />
          {/* Lop phu trang: dac ben trai -> trong dan sang phai */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #ffffff 0%, #ffffff 40%, rgba(255,255,255,0.9) 52%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0.08) 88%, rgba(255,255,255,0) 100%)',
            }}
          />
          {/* Mo nhe mep duoi cho lien mach voi nen trang */}
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }}
          />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute right-0 top-0 h-72 w-[36rem] opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #ee0033, transparent 70%)' }}
          aria-hidden
        />
      )}
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Cot trai: gioi thieu */}
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-viettel-red">
              <span className="h-0.5 w-8 bg-viettel-red" aria-hidden />
              {eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.15] text-ink md:text-[2.6rem]">
              {titleLine1}
              {titleHighlight && (
                <>
                  <br />
                  <span className="text-viettel-red">{titleHighlight}</span>
                </>
              )}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">{intro1}</p>
            {intro2 && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{intro2}</p>
            )}

            {/* Cac muc noi bat (Su menh, Tam nhin... - thay doi duoc so luong) */}
            <div
              className={cn(
                'mt-8 grid gap-x-8 gap-y-6',
                highlights.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
              )}
            >
              {highlights.map((h, i) => {
                const Icon = ICONS[h.icon ?? 'rocket'] ?? Rocket
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-viettel-red/10 text-viettel-red">
                      <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="font-bold text-ink">{h.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{h.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={primaryHref} variant="primary" size="lg">
                {primaryLabel}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
              <ButtonLink href={secondaryHref} variant="outline" size="lg">
                {secondaryLabel}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>

          {/* Cot phai: tren desktop anh nen lo ra o day; tren mobile hien tam thuong hieu khi chua co anh */}
          {!imgUrl && (
            <Reveal delay={120} className="relative lg:hidden">
              <div
                className="flex h-[18rem] w-full items-center justify-center rounded-[1.75rem] shadow-2xl shadow-viettel-red/15"
                style={{
                  background:
                    'linear-gradient(135deg, #8f0c22 0%, #c8132f 45%, #e11537 70%, #a30e28 100%)',
                }}
              >
                <div className="text-center text-white">
                  <div className="text-4xl font-black tracking-tight">Viettel</div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/85">
                    Theo cách của bạn
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Dai chi so tap doan */}
        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 rounded-3xl border border-border-soft bg-surface-muted/60 p-7 md:mt-14 md:grid-cols-4 md:p-8">
            {stats.map((s, i) => {
              const Icon = ICONS[s.icon ?? 'users'] ?? Users
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viettel-red/10 text-viettel-red">
                    <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-2xl font-extrabold leading-none text-viettel-red md:text-3xl">
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-sm leading-snug text-ink-soft">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
