import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

import { getPayloadClient } from '@/lib/payload'
import { hasRole } from '@/lib/access'
import { COMPANY_SIZES, LEAD_STATUSES, LEAD_TYPES, TIME_SLOTS, labelOf } from '@/lib/taxonomy'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Xuat toan bo lead (khach dat lich) ra file Excel .xlsx.
 * Chi admin/sales dang nhap moi tai duoc (xac thuc bang cookie phien).
 */
export async function GET(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || !hasRole(user, 'admin', 'sales')) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const res = await payload.find({
    collection: 'leads',
    limit: 10000,
    depth: 1,
    sort: '-createdAt',
    overrideAccess: true,
  })

  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Khách hàng đặt lịch')
  ws.columns = [
    { header: 'Họ tên', key: 'name', width: 22 },
    { header: 'Doanh nghiệp', key: 'company', width: 24 },
    { header: 'Số điện thoại', key: 'phone', width: 16 },
    { header: 'Email', key: 'email', width: 26 },
    { header: 'Loại yêu cầu', key: 'type', width: 16 },
    { header: 'Quy mô', key: 'companySize', width: 22 },
    { header: 'Giải pháp quan tâm', key: 'solutions', width: 32 },
    { header: 'Nội dung', key: 'message', width: 40 },
    { header: 'Ngày mong muốn', key: 'preferredDate', width: 16 },
    { header: 'Khung giờ', key: 'timeSlot', width: 22 },
    { header: 'Trạng thái', key: 'leadStatus', width: 16 },
    { header: 'Phụ trách', key: 'assignedTo', width: 22 },
    { header: 'Nguồn', key: 'source', width: 12 },
    { header: 'Ngày tạo', key: 'createdAt', width: 20 },
  ]
  const header = ws.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEE0033' } }
  header.alignment = { vertical: 'middle' }

  type LeadRow = Record<string, unknown>
  for (const l of res.docs as unknown as LeadRow[]) {
    const sols = Array.isArray(l.interestedSolutions)
      ? (l.interestedSolutions as Array<Record<string, unknown> | number>)
          .map((s) => (typeof s === 'object' && s ? (s.shortName ?? s.title) : s))
          .filter(Boolean)
          .join(', ')
      : ''
    const assignee =
      l.assignedTo && typeof l.assignedTo === 'object'
        ? ((l.assignedTo as Record<string, unknown>).name ?? (l.assignedTo as Record<string, unknown>).email ?? '')
        : ''
    ws.addRow({
      name: l.name ?? '',
      company: l.company ?? '',
      phone: l.phone ?? '',
      email: l.email ?? '',
      type: labelOf(LEAD_TYPES, l.type as string),
      companySize: labelOf(COMPANY_SIZES, l.companySize as string),
      solutions: sols,
      message: l.message ?? '',
      preferredDate: l.preferredDate ? new Date(l.preferredDate as string).toLocaleDateString('vi-VN') : '',
      timeSlot: labelOf(TIME_SLOTS, l.timeSlot as string),
      leadStatus: labelOf(LEAD_STATUSES, l.leadStatus as string),
      assignedTo: assignee,
      source: l.source ?? '',
      createdAt: l.createdAt ? new Date(l.createdAt as string).toLocaleString('vi-VN') : '',
    })
  }

  const buffer = await wb.xlsx.writeBuffer()
  const filename = `khach-hang-dat-lich-${new Date().toISOString().slice(0, 10)}.xlsx`
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
