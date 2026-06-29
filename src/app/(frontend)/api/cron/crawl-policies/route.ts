import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { runPolicyCrawl } from '@/lib/crawler/runCrawl'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get('secret') === secret
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const payload = await getPayloadClient()
  const result = await runPolicyCrawl(payload)
  return NextResponse.json(result)
}
