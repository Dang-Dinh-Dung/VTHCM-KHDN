import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { hasRole } from '@/lib/access'
import { runPolicyCrawl } from '@/lib/crawler/runCrawl'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Cho phep admin/editor dang nhap tu bam "crawl ngay" tu trong admin.
 * Xac thuc bang user Payload (cookie phien), KHONG dung CRON_SECRET.
 */
export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || !hasRole(user, 'admin', 'editor')) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const result = await runPolicyCrawl(payload)
  return NextResponse.json(result)
}
