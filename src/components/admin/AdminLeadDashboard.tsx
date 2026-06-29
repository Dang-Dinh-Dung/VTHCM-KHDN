import type { CSSProperties } from 'react'
import type { Payload } from 'payload'

import { LEAD_STATUSES } from '@/lib/taxonomy'
import { CrawlNowButton } from './CrawlNowButton'

type AdminUser = { id: string | number; roles?: string[] | null }

const STATUS_COLOR: Record<string, string> = {
  moi: '#ee0033',
  'dang-xu-ly': '#f7931e',
  'da-lien-he': '#0369a1',
  'hoan-tat': '#15803d',
  huy: '#64748b',
}

const ACTIVE_STATUSES = ['moi', 'dang-xu-ly', 'da-lien-he']

/**
 * Dashboard tong quan lead (chi hien cho admin/sales):
 *  - Tong so khach da dat lich.
 *  - So luong theo tung trang thai (mới / đang xử lý / đã liên hệ / hoàn tất / hủy).
 *  - Bang nhan su dang quan ly khach hang nao (so khach + so dang xu ly).
 * Gom du lieu trong JS tu 2 truy van (leads + users) cho nhe.
 */
export async function AdminLeadDashboard({
  payload,
  user,
}: {
  payload: Payload
  user?: AdminUser | null
}) {
  if (!user) return null

  const leadsRes = await payload
    .find({
      collection: 'leads',
      limit: 5000,
      depth: 0,
      overrideAccess: true,
      select: { leadStatus: true, assignedTo: true },
    })
    .catch(() => ({ docs: [] as Record<string, unknown>[], totalDocs: 0 }))

  const usersRes = await payload
    .find({ collection: 'users', limit: 200, depth: 0, overrideAccess: true })
    .catch(() => ({ docs: [] as Record<string, unknown>[] }))

  const pendingPolicies = await payload
    .count({
      collection: 'policies',
      where: { and: [{ source: { equals: 'crawl' } }, { status: { equals: 'draft' } }] },
    })
    .catch(() => ({ totalDocs: 0 }))

  const leads = leadsRes.docs as unknown as Array<{ leadStatus?: string; assignedTo?: string | number | null }>
  const total = leadsRes.totalDocs ?? leads.length

  // Dem theo trang thai
  const statusCount: Record<string, number> = {}
  // Dem theo nhan su: { total, active }
  const byAssignee = new Map<string, { total: number; active: number }>()
  let unassigned = 0

  for (const l of leads) {
    const st = l.leadStatus ?? 'moi'
    statusCount[st] = (statusCount[st] ?? 0) + 1

    const key = l.assignedTo != null ? String(l.assignedTo) : null
    if (!key) {
      unassigned += 1
    } else {
      const cur = byAssignee.get(key) ?? { total: 0, active: 0 }
      cur.total += 1
      if (ACTIVE_STATUSES.includes(st)) cur.active += 1
      byAssignee.set(key, cur)
    }
  }

  const userName = new Map<string, string>()
  for (const u of usersRes.docs as unknown as Array<Record<string, unknown>>) {
    userName.set(String(u.id), String(u.name ?? u.email ?? `#${u.id}`))
  }

  const assigneeRows = Array.from(byAssignee.entries())
    .map(([id, v]) => ({ id, name: userName.get(id) ?? `#${id}`, ...v }))
    .sort((a, b) => b.total - a.total)

  const leadsListUrl = '/admin/collections/leads'
  const cardBase: CSSProperties = {
    borderRadius: '12px',
    border: '1px solid var(--theme-elevation-150)',
    padding: '14px 16px',
    background: 'var(--theme-elevation-50)',
    textDecoration: 'none',
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--theme-text)' }}>
        Tổng quan khách hàng đặt lịch
      </h2>

      {/* Hang the so lieu: Tong + tung trang thai */}
      <div
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}
      >
        <a href={leadsListUrl} style={{ ...cardBase, borderLeft: '4px solid #0f172a' }}>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Tổng đã đặt lịch</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--theme-text)' }}>{total}</div>
        </a>
        <a
          href={`/admin/collections/policies?where[and][0][source][equals]=crawl&where[and][1][status][equals]=draft`}
          style={{ ...cardBase, borderLeft: '4px solid #f7931e' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Văn bản chờ duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f7931e' }}>{pendingPolicies.totalDocs}</div>
        </a>
        {LEAD_STATUSES.map((s) => {
          const color = STATUS_COLOR[s.value] ?? '#64748b'
          return (
            <a
              key={s.value}
              href={`${leadsListUrl}?where[leadStatus][equals]=${s.value}`}
              style={{ ...cardBase, borderLeft: `4px solid ${color}` }}
            >
              <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>{s.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color }}>{statusCount[s.value] ?? 0}</div>
            </a>
          )
        })}
      </div>

      {/* Nut crawl thu cong (ngoai lich cron hang ngay) */}
      <div style={{ marginTop: '12px' }}>
        <CrawlNowButton />
      </div>

      {/* Bang phan cong theo nhan su */}
      <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '20px 0 8px', color: 'var(--theme-text)' }}>
        Phân công theo nhân sự
      </h3>
      <div style={{ ...cardBase, padding: '4px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--theme-elevation-600)' }}>
              <th style={{ padding: '8px 16px', fontWeight: 600 }}>Nhân sự</th>
              <th style={{ padding: '8px 16px', fontWeight: 600, textAlign: 'right' }}>Tổng khách</th>
              <th style={{ padding: '8px 16px', fontWeight: 600, textAlign: 'right' }}>Đang xử lý</th>
            </tr>
          </thead>
          <tbody>
            {assigneeRows.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '12px 16px', color: 'var(--theme-elevation-500)' }}>
                  Chưa có khách hàng nào được phân công.
                </td>
              </tr>
            )}
            {assigneeRows.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                <td style={{ padding: '8px 16px' }}>
                  <a
                    href={`${leadsListUrl}?where[assignedTo][equals]=${r.id}`}
                    style={{ color: 'var(--theme-text)', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {r.name}
                  </a>
                </td>
                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 700 }}>{r.total}</td>
                <td style={{ padding: '8px 16px', textAlign: 'right', color: '#f7931e', fontWeight: 700 }}>
                  {r.active}
                </td>
              </tr>
            ))}
            {unassigned > 0 && (
              <tr style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                <td style={{ padding: '8px 16px' }}>
                  <a
                    href={`${leadsListUrl}?where[assignedTo][exists]=false`}
                    style={{ color: '#ee0033', fontWeight: 600, textDecoration: 'none' }}
                  >
                    ⚠️ Chưa phân công
                  </a>
                </td>
                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 700 }}>{unassigned}</td>
                <td style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--theme-elevation-400)' }}>—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
