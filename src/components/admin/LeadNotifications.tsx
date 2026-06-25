import type { Payload } from 'payload'

type AdminUser = {
  id: string | number
  name?: string | null
  roles?: string[] | null
}

const LEAD_STATUS_LABEL: Record<string, string> = {
  moi: 'Mới',
  'dang-xu-ly': 'Đang xử lý',
  'da-lien-he': 'Đã liên hệ',
  dong: 'Đóng',
}

/**
 * Bảng thông báo hiển thị đầu trang Dashboard admin:
 *  - Số lead MỚI chưa xử lý (cho mọi sales/admin).
 *  - Danh sách khách hàng được GIAO cho chính người đang đăng nhập.
 * Render server-side, đọc user hiện tại từ props Payload truyền vào.
 */
export async function LeadNotifications({
  payload,
  user,
}: {
  payload: Payload
  user?: AdminUser | null
}) {
  if (!user) return null

  // Lead mới chưa xử lý (toàn phòng)
  const newLeads = await payload
    .count({ collection: 'leads', where: { leadStatus: { equals: 'moi' } } })
    .catch(() => ({ totalDocs: 0 }))

  // Khách hàng được giao cho user hiện tại & chưa đóng
  const mine = await payload
    .find({
      collection: 'leads',
      where: {
        and: [{ assignedTo: { equals: user.id } }, { leadStatus: { not_equals: 'dong' } }],
      },
      sort: '-createdAt',
      limit: 5,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [], totalDocs: 0 }))

  const myLeads = mine.docs as unknown as Array<Record<string, unknown>>
  const leadsListUrl = '/admin/collections/leads'
  const newLeadsUrl = `${leadsListUrl}?where[leadStatus][equals]=moi`

  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        marginBottom: '28px',
      }}
    >
      {/* Lead moi chua xu ly */}
      <a
        href={newLeadsUrl}
        style={{
          display: 'block',
          textDecoration: 'none',
          borderRadius: '12px',
          border: '1px solid var(--theme-elevation-150)',
          borderLeft: '4px solid #ee0033',
          padding: '16px 18px',
          background: 'var(--theme-elevation-50)',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--theme-elevation-600)' }}>
          🔔 Yêu cầu / đặt lịch mới chưa xử lý
        </div>
        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#ee0033' }}>
            {newLeads.totalDocs}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--theme-elevation-600)' }}>
            {newLeads.totalDocs > 0 ? 'cần tiếp nhận →' : 'Tất cả đã được xử lý 👍'}
          </span>
        </div>
      </a>

      {/* Khach hang duoc giao cho toi */}
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--theme-elevation-150)',
          borderLeft: '4px solid #2e3192',
          padding: '16px 18px',
          background: 'var(--theme-elevation-50)',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--theme-elevation-600)' }}>
          👤 Khách hàng được giao cho bạn{user.name ? ` (${user.name})` : ''}
        </div>
        {mine.totalDocs === 0 ? (
          <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--theme-elevation-500)' }}>
            Chưa có khách hàng nào được phân công cho bạn.
          </div>
        ) : (
          <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
            {myLeads.map((lead) => (
              <li key={String(lead.id)} style={{ marginBottom: '6px' }}>
                <a
                  href={`${leadsListUrl}/${lead.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    color: 'var(--theme-text)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {String(lead.name ?? 'Khách hàng')}
                    {lead.company ? ` · ${String(lead.company)}` : ''}
                  </span>
                  <span style={{ color: 'var(--theme-elevation-500)', whiteSpace: 'nowrap' }}>
                    {LEAD_STATUS_LABEL[String(lead.leadStatus)] ?? ''}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {mine.totalDocs > myLeads.length && (
          <a
            href={`${leadsListUrl}?where[assignedTo][equals]=${user.id}`}
            style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', color: '#ee0033' }}
          >
            Xem tất cả ({mine.totalDocs}) →
          </a>
        )}
      </div>
    </div>
  )
}
