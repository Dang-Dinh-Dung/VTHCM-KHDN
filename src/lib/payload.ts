import { cache } from 'react'
import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'

/**
 * Lay instance Payload (Local API) dung trong Server Components / route handlers.
 * Boc trong React cache de dedupe trong cung mot request.
 */
export const getPayloadClient = cache(async (): Promise<Payload> => {
  return getPayload({ config })
})
