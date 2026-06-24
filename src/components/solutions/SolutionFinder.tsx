'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react'

import { buttonClass } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { COMPANY_SIZES, INDUSTRIES, NEEDS, type Option } from '@/lib/taxonomy'

type StepDef = { key: 'industry' | 'need' | 'companySize'; title: string; desc: string; options: Option[] }

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

export function SolutionFinder() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  const select = (value: string) => {
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
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              aria-pressed={selected}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                selected
                  ? 'border-viettel-red bg-viettel-red/5 text-ink ring-1 ring-viettel-red'
                  : 'border-border-soft text-ink hover:border-viettel-red/40 hover:bg-surface-muted',
              )}
            >
              {opt.label}
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-viettel-red bg-viettel-red text-white' : 'border-border-soft',
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
