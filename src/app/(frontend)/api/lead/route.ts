import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'
import { verifyTurnstile } from '@/lib/turnstile'

const schema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên').max(120),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ').max(20),
  email: z.union([z.string().email('Email không hợp lệ'), z.literal('')]).optional(),
  company: z.string().max(160).optional(),
  type: z.enum(['tu-van', 'demo', 'bao-gia']).optional(),
  companySize: z.string().optional(),
  message: z.string().max(2000).optional(),
  preferredDate: z.string().optional(),
  timeSlot: z.string().optional(),
  interestedSolutions: z.array(z.union([z.string(), z.number()])).optional(),
  // chong spam
  website: z.string().optional(), // honeypot - phai rong
  turnstileToken: z.string().optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const data = parsed.data

  // Honeypot: bot dien vao field an -> gia vo thanh cong, khong luu
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const captchaOk = await verifyTurnstile(data.turnstileToken)
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 })
  }

  // Chuyen chuoi rong -> undefined: field 'select' cua Payload khong chap nhan ''
  const clean = (v?: string | null) => (v && v.trim() !== '' ? v : undefined)

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name: data.name,
        phone: data.phone,
        email: clean(data.email),
        company: clean(data.company),
        type: data.type ?? 'tu-van',
        companySize: clean(data.companySize) as never,
        message: clean(data.message),
        preferredDate: data.preferredDate ? new Date(data.preferredDate).toISOString() : undefined,
        timeSlot: clean(data.timeSlot) as never,
        interestedSolutions:
          data.interestedSolutions && data.interestedSolutions.length > 0
            ? (data.interestedSolutions as never)
            : undefined,
        source: 'website',
      },
    })
    return NextResponse.json({ ok: true, id: doc.id })
  } catch (err) {
    console.error('[api/lead] create failed:', err)
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }
}
