/**
 * Dong bo lead moi sang Google Sheet qua Apps Script Web App (webhook).
 * Chi chay khi co GSHEET_WEBHOOK_URL. Chay nen, KHONG chan luong tao lead;
 * loi chi log, khong nem ra ngoai.
 * Xem huong dan tao Sheet + script tai docs/google-sheet-webhook.md
 */
export async function syncLeadToSheet(doc: Record<string, unknown>): Promise<void> {
  const url = process.env.GSHEET_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.GSHEET_WEBHOOK_SECRET || '',
        name: doc.name ?? '',
        company: doc.company ?? '',
        phone: doc.phone ?? '',
        email: doc.email ?? '',
        type: doc.type ?? '',
        companySize: doc.companySize ?? '',
        message: doc.message ?? '',
        preferredDate: doc.preferredDate ?? '',
        timeSlot: doc.timeSlot ?? '',
        source: doc.source ?? 'website',
        createdAt: doc.createdAt ?? new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.error('[gsheet] sync failed:', err)
  }
}
