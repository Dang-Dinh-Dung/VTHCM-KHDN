'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react'

import { buttonClass } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import type { SolutionFacet } from '@/lib/queries'
import { COMPANY_SIZES, INDUSTRIES, NEEDS, type Option } from '@/lib/taxonomy'

type StepKey = 'industry' | 'need' | 'companySize'
type StepDef = { key: StepKey; title: string; desc: string; options: Option[] }

// Anh xa key buoc -> truong facet tuong ung
const FACET_FIELD: Record<StepKey, keyof SolutionFacet> = {
  industry: 'industries',
  need: 'needs',
  companySize: 'companySizes',
}

const STEPS: StepDef[] = [
  {
    key: 'industry',
    title: 'Doanh nghiệp của bạn thuộc ngành nào?',
    desc: 'Giúp chúng tôi gợi ý giải pháp phù hợp với đặc thù ngành.',
    options: INDUSTRIES,
  },
  {
    key: 'need',
    title: 'Bạn đang cần giải quyết nhu cầu gì?',
    desc: 'Chọn nhu cầu trọng tâm nhất hiện nay của doanh nghiệp.',
    options: NEEDS,
  },
  {
    key: 'companySize',
    title: 'Quy mô doanh nghiệp của bạn?',
    desc: 'Để chúng tôi đề xuất gói dịch vụ tối ưu chi phí.',
    options: COMPANY_SIZES,
  },
]

export function SolutionFinder({ facets = [] }: { facets?: SolutionFacet[] }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  // Mot giai phap khop bo lua chon neu voi moi chieu da chon, mang facet chua gia tri do
  const facetMatches = (facet: SolutionFacet, ans: Record<string, string>) =>
    (Object.entries(ans) as Array<[StepKey, string]>).every(
      ([k, v]) => !v || facet[FACET_FIELD[k]].includes(v),
    )

  // Chon gia tri nay o buoc hien tai co con >=1 giai pháp khong? (lam xam neu = 0)
  const optionViable = (value: string) => {
    if (facets.length === 0) return true // chua co du lieu -> khong lam xam
    const trial = { ...answers, [current.key]: value }
    return facets.some((f) => facetMatches(f, trial))
  }

  const select = (value: string) => {
    if (!optionViable(value) && answers[current.key] !== value) return
    setAnswers((a) => ({ ...a, [current.key]: a[current.key] === value ? '' : value }))
  }

  const goNext = () => {
    if (isLast) {
      const params = new URLSearchParams()
      Object.entries(answers).forEach(([k, v]) => {
        if (v) params.set(k, v)
      })
      router.push(`/giai-phap${params.toString() ? `?${params.toString()}` : ''}`)
    } else {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border-soft bg-surface p-6 shadow-brand md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink-soft">
          <span>
            Bước {step + 1}/{STEPS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-viettel-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-ink md:text-2xl">{current.title}</h2>
      <p className="mt-1.5 text-sm text-ink-soft">{current.desc}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {current.options.map((opt) => {
          const selected = answers[current.key] === opt.value
          const viable = selected || optionViable(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              disabled={!viable}
              aria-pressed={selected}
              title={!viable ? 'Chưa có giải pháp phù hợp với lựa chọn này' : undefined}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                selected
                  ? 'border-viettel-red bg-viettel-red/5 text-ink ring-1 ring-viettel-red'
                  : viable
                    ? 'border-border-soft text-ink hover:border-viettel-red/40 hover:bg-surface-muted'
                    : 'cursor-not-allowed border-border-soft/60 bg-surface-muted/40 text-ink-soft/40',
              )}
            >
              {opt.label}
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  selected
                    ? 'border-viettel-red bg-viettel-red text-white'
                    : viable
                      ? 'border-border-soft'
                      : 'border-border-soft/50',
                )}
              >
                {selected && <Check className="h-3 w-3" aria-hidden />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
            step === 0 ? 'cursor-not-allowed text-ink-soft/40' : 'text-ink hover:bg-surface-muted',
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Quay lại
        </button>

        <div className="flex items-center gap-2">
          <button type="button" onClick={goNext} className="text-sm font-medium text-ink-soft hover:text-ink">
            Bỏ qua
          </button>
          <button type="button" onClick={goNext} className={buttonClass('primary', 'md')}>
            {isLast ? (
              <>
                Xem kết quả <Search className="h-4 w-4" aria-hidden />
              </>
            ) : (
              <>
                Tiếp tục <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
