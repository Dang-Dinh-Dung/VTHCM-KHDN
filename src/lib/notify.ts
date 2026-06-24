import type { Payload } from 'payload'

import { labelOf, LEAD_TYPES, TIME_SLOTS } from '@/lib/taxonomy'

type LeadLike = {
  id?: string | number
  name?: string | null
  company?: string | null
  phone?: string | null
  email?: string | null
  type?: string | null
  message?: string | null
  preferredDate?: string | null
  timeSlot?: string | null
}

const esc = (s?: string | null) => (s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)

/**
 * Gui thong bao khi co lead moi: email cho sale + Telegram + email xac nhan cho khach.
 * Tu dong bo qua kenh nao chua cau hinh (an toan khi dev).
 */
export async function notifyNewLead(payload: Payload, lead: LeadLike): Promise<void> {
  const typeLabel = labelOf(LEAD_TYPES, lead.type)
  const slotLabel = lead.timeSlot ? labelOf(TIME_SLOTS, lead.timeSlot) : ''
  const lines = [
    `Loại: ${typeLabel}`,
    `Họ tên: ${lead.name ?? ''}`,
    lead.company ? `Doanh nghiệp: ${lead.company}` : '',
    `SĐT: ${lead.phone ?? ''}`,
    lead.email ? `Email: ${lead.email}` : '',
    lead.preferredDate ? `Ngày mong muốn: ${new Date(lead.preferredDate).toLocaleDateString('vi-VN')}` : '',
    slotLabel ? `Khung giờ: ${slotLabel}` : '',
    lead.message ? `Nội dung: ${lead.message}` : '',
  ].filter(Boolean)

  // 1) Telegram
  const tgToken = process.env.TELEGRAM_BOT_TOKEN
  const tgChat = process.env.TELEGRAM_CHAT_ID
  if (tgToken && tgChat) {
    const text = `🔔 <b>Lead mới từ website</b>\n${lines.map(esc).join('\n')}`
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text, parse_mode: 'HTML' }),
      })
    } catch (e) {
      payload.logger.error({ err: e }, 'Telegram notify failed')
    }
  }

  // 2) Email cho sale
  const salesTo = (process.env.SALES_NOTIFY_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (salesTo.length && process.env.SMTP_HOST) {
    try {
      await payload.sendEmail({
        to: salesTo,
        subject: `[KHDN] Lead mới: ${lead.name ?? ''} - ${typeLabel}`,
        html: `<h2>Lead mới từ website</h2><ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`,
      })
    } catch (e) {
      payload.logger.error({ err: e }, 'Sales email notify failed')
    }
  }

  // 3) Email xac nhan cho khach
  if (lead.email && process.env.SMTP_HOST) {
    try {
      await payload.sendEmail({
        to: lead.email,
        subject: 'Viettel KHDN HCM đã nhận yêu cầu của bạn',
        html: `<p>Xin chào ${esc(lead.name)},</p><p>Cảm ơn bạn đã liên hệ Phòng KHDN Viettel Hồ Chí Minh. Chúng tôi đã tiếp nhận yêu cầu <b>${esc(typeLabel)}</b> và sẽ liên hệ lại trong thời gian sớm nhất.</p><p>Trân trọng,<br/>Phòng KHDN Viettel Hồ Chí Minh</p>`,
      })
    } catch (e) {
      payload.logger.error({ err: e }, 'Customer email failed')
    }
  }
}
