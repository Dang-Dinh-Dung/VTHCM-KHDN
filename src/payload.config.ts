import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Solutions } from './collections/Solutions'
import { News } from './collections/News'
import { Policies } from './collections/Policies'
import { Leads } from './collections/Leads'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * DB adapter: SQLite cho dev (khong can Docker), PostgreSQL cho production (Viettel Cloud).
 * Chon bang bien moi truong DB_ADAPTER = "postgres" | "sqlite" (mac dinh sqlite).
 */
const databaseAdapter =
  process.env.DB_ADAPTER === 'postgres'
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URI || '' },
        // Lan dau co the bat DB_PUSH=true de tao schema; sau do dung migration.
        push: process.env.DB_PUSH === 'true',
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || 'file:./payload.db' },
      })

/**
 * Email adapter chi bat khi co cau hinh SMTP (Viettel SMTP noi bo).
 * Khi chua co SMTP, Payload dung adapter mac dinh (log ra console) - tien cho dev.
 */
const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'no-reply@khdn-viettel-hcm.vn',
      defaultFromName: process.env.SMTP_FROM_NAME || 'KHDN Viettel HCM',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  : undefined

/**
 * Luu media: mac dinh o o dia (thu muc ./media). Khi co cau hinh S3_BUCKET ->
 * day file len Object Storage Viettel IDC (S3-compatible). Viettel IDC thuong
 * yeu cau forcePathStyle=true va endpoint rieng.
 */
const s3Plugin = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'us-east-1',
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Dashboard lead: tong quan + breakdown trang thai + phan cong; roi thong bao ca nhan
      beforeDashboard: [
        '/components/admin/AdminLeadDashboard#AdminLeadDashboard',
        '/components/admin/LeadNotifications#LeadNotifications',
      ],
    },
    meta: {
      title: 'Quan tri',
      titleSuffix: ' | KHDN Viettel HCM',
      description: 'He thong quan tri noi dung & lead - Phong KHDN Viettel Ho Chi Minh',
    },
  },
  collections: [Solutions, News, Policies, Leads, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseAdapter,
  email: emailAdapter,
  plugins: [...s3Plugin],
  sharp,
})
