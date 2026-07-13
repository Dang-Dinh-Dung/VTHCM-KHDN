'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import { buttonClass } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { COMPANY_SIZES, LEAD_TYPES, TIME_SLOTS } from '@/lib/taxonomy'
import { taxonomyLabel } from '@/lib/taxonomy-i18n'

const schema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ'),
  email: z.union([z.string().email('Email không hợp lệ'), z.literal('')]).optional(),
  company: z.string().optional(),
  type: z.enum(['tu-van', 'demo', 'bao-gia']),
  companySize: z.string().optional(),
  preferredDate: z.string().optional(),
  timeSlot: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type SolutionOption = { id: string | number; title: string; desc?: string }

const fieldClass =
  'w-full rounded-lg border border-border-soft bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-viettel-red focus:outline-none focus:ring-1 focus:ring-viettel-red'
const labelClass = 'mb-1.5 block text-sm font-semibold text-ink'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
    }
  }
}

export function BookingForm({
  solutions,
  defaultSolutionId,
  defaultType = 'tu-van',
}: {
  solutions: SolutionOption[]
  defaultSolutionId?: string | number
  defaultType?: 'tu-van' | 'demo' | 'bao-gia'
}) {
  const t = useTranslations('taxonomy')
  const [selected, setSelected] = useState<Array<string | number>>(
    defaultSolutionId ? [defaultSolutionId] : [],
  )
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: defaultType },
  })

  // Tai widget Turnstile neu co cau hinh
  useEffect(() => {
    if (!siteKey || !captchaRef.current) return
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = () => {
      if (window.turnstile && captchaRef.current) {
        widgetIdRef.current = window.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(''),
          'error-callback': () => setCaptchaToken(''),
        })
      }
    }
    document.body.appendChild(s)
    return () => {
      s.remove()
    }
  }, [siteKey])

  const toggleSolution = (id: string | number) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting')
    setServerError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, interestedSolutions: selected, turnstileToken: captchaToken }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setServerError(
          data.error === 'captcha'
            ? 'Vui lòng xác minh bạn không phải robot.'
            : 'Gửi không thành công, vui lòng thử lại hoặc gọi hotline.',
        )
        resetCaptcha()
      }
    } catch {
      setStatus('error')
      setServerError('Có lỗi kết nối. Vui lòng thử lại.')
      resetCaptcha()
    }
  }

  // Token Turnstile chi dung mot lan -> reset de lan gui sau lay token moi
  const resetCaptcha = () => {
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current)
    }
    setCaptchaToken('')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-pillar-governance/30 bg-pillar-governance/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-pillar-governance" aria-hidden />
        <h3 className="mt-4 text-xl font-bold text-ink">Đã gửi yêu cầu thành công!</h3>
        <p className="mt-2 text-ink-soft">
          Cảm ơn bạn. Đội ngũ KHDN Viettel HCM sẽ liên hệ lại trong thời gian sớm nhất.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot an */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0"
        {...register('website')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Họ tên <span className="text-viettel-red">*</span>
          </label>
          <input id="name" className={fieldClass} placeholder="Nguyễn Văn A" autoComplete="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="company">
            Doanh nghiệp
          </label>
          <input id="company" className={fieldClass} placeholder="Công ty TNHH ..." autoComplete="organization" {...register('company')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Số điện thoại <span className="text-viettel-red">*</span>
          </label>
          <input id="phone" type="tel" inputMode="tel" className={fieldClass} placeholder="09xx xxx xxx" autoComplete="tel" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input id="email" type="email" inputMode="email" className={fieldClass} placeholder="email@congty.vn" autoComplete="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="type">
            Loại yêu cầu
          </label>
          <select id="type" className={fieldClass} {...register('type')}>
            {LEAD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="companySize">
            Quy mô
          </label>
          <select id="companySize" className={fieldClass} {...register('companySize')}>
            <option value="">-- Chọn --</option>
            {COMPANY_SIZES.map((c) => (
              <option key={c.value} value={c.value}>
                {taxonomyLabel(t, 'companySizes', c.value, COMPANY_SIZES)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="timeSlot">
            Khung giờ liên hệ
          </label>
          <select id="timeSlot" className={fieldClass} {...register('timeSlot')}>
            <option value="">-- Chọn --</option>
            {TIME_SLOTS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="preferredDate">
          Ngày mong muốn được liên hệ
        </label>
        <input id="preferredDate" type="date" className={cn(fieldClass, 'sm:max-w-xs')} {...register('preferredDate')} />
      </div>

      {solutions.length > 0 && (
        <div>
          <span className={labelClass}>Giải pháp quan tâm</span>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border-soft p-3">
            {solutions.map((s) => {
              const active = selected.includes(s.id)
              return (
                <span key={s.id} className="group relative inline-flex">
                  <button
                    type="button"
                    onClick={() => toggleSolution(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      s.desc && 'cursor-help',
                      active
                        ? 'border-viettel-red bg-viettel-red text-white'
                        : 'border-border-soft text-ink-soft hover:border-viettel-red/40',
                    )}
                  >
                    {s.title}
                  </button>
                  {s.desc && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-60 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-left text-xs font-normal leading-snug text-white shadow-xl group-hover:block"
                    >
                      <span className="mb-0.5 block font-semibold text-white">{s.title}</span>
                      {s.desc}
                      <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-ink" />
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="message">
          Nội dung / nhu cầu cụ thể
        </label>
        <textarea id="message" rows={4} className={fieldClass} placeholder="Mô tả ngắn nhu cầu của doanh nghiệp..." {...register('message')} />
      </div>

      {siteKey && <div ref={captchaRef} className="cf-turnstile" />}

      {status === 'error' && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || (Boolean(siteKey) && !captchaToken)}
        className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Đang gửi...
          </>
        ) : (
          'Gửi yêu cầu tư vấn'
        )}
      </button>
      <p className="text-xs text-ink-soft">
        Bằng việc gửi thông tin, bạn đồng ý để KHDN Viettel HCM liên hệ tư vấn.
      </p>
    </form>
  )
}
