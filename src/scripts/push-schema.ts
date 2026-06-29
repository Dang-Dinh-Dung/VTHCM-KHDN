import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * Dong bo schema vao DB hien tai (theo .env) bang co che push cua Payload.
 * Chi khoi tao Payload roi thoat - KHONG seed du lieu.
 * Yeu cau .env: DB_ADAPTER=postgres, DATABASE_URI=<neon>, DB_PUSH=true, PAYLOAD_SECRET=...
 *
 * Chay: cross-env NODE_OPTIONS="--no-deprecation --import=tsx/esm" tsx src/scripts/push-schema.ts
 */
async function run() {
  if (process.env.DB_PUSH !== 'true') {
    console.error('DB_PUSH chua = true -> dat DB_PUSH=true trong .env roi chay lai.')
    process.exit(1)
  }
  console.log('Dang khoi tao Payload de push schema...')
  console.log('  DB_ADAPTER =', process.env.DB_ADAPTER)
  await getPayload({ config })
  console.log('OK: schema da duoc dong bo (push) vao DB.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Push schema that bai:', err)
  process.exit(1)
})
