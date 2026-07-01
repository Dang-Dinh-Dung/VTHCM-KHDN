import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrSales, isAdminOrSalesFieldLevel, isSignedIn } from '@/lib/access'
import { notifyNewLead } from '@/lib/notify'
import { syncLeadToSheet } from '@/lib/gsheet'
import { COMPANY_SIZES, LEAD_STATUSES, LEAD_TYPES, TIME_SLOTS } from '@/lib/taxonomy'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Yêu cầu liên hệ', plural: 'Yêu cầu & đặt lịch' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'phone', 'type', 'leadStatus', 'createdAt'],
    group: 'Kinh doanh',
    listSearchableFields: ['name', 'company', 'phone', 'email'],
    description: 'Yêu cầu tư vấn/demo/báo giá gửi từ website. Quản lý & phân công xử lý tại đây.',
  },
  access: {
    create: anyone, // khach gui form cong khai
    read: isSignedIn, // chi nguoi dang nhap (sales/admin) doc duoc
    update: isAdminOrSales,
    delete: isAdminOrSales,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Khong chan luong tao lead neu thong bao/dong bo loi
          void notifyNewLead(req.payload, doc as Parameters<typeof notifyNewLead>[1])
          void syncLeadToSheet(doc as Record<string, unknown>)
        }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Họ tên', required: true },
        { name: 'company', type: 'text', label: 'Doanh nghiệp' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Số điện thoại', required: true },
        { name: 'email', type: 'email', label: 'Email' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Loại yêu cầu',
      options: LEAD_TYPES,
      defaultValue: 'tu-van',
      required: true,
    },
    {
      name: 'interestedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Giải pháp quan tâm',
    },
    {
      name: 'companySize',
      type: 'select',
      label: 'Quy mô doanh nghiệp',
      options: COMPANY_SIZES,
    },
    { name: 'message', type: 'textarea', label: 'Nội dung / nhu cầu' },
    {
      type: 'row',
      fields: [
        {
          name: 'preferredDate',
          type: 'date',
          label: 'Ngày mong muốn được liên hệ',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        { name: 'timeSlot', type: 'select', label: 'Khung giờ', options: TIME_SLOTS },
      ],
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Đồng ý được liên hệ tư vấn',
      defaultValue: true,
    },
    // --- Truong noi bo: chi sales/admin set/sua ---
    {
      name: 'leadStatus',
      type: 'select',
      label: 'Trạng thái xử lý',
      options: LEAD_STATUSES,
      defaultValue: 'moi',
      index: true,
      access: {
        create: isAdminOrSalesFieldLevel,
        update: isAdminOrSalesFieldLevel,
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Nhân viên phụ trách',
      access: {
        create: isAdminOrSalesFieldLevel,
        update: isAdminOrSalesFieldLevel,
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Nguồn',
      defaultValue: 'website',
      access: {
        create: isAdminOrSalesFieldLevel,
        update: isAdminOrSalesFieldLevel,
      },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'internalNotes',
      type: 'array',
      label: 'Ghi chú nội bộ',
      labels: { singular: 'Ghi chú', plural: 'Ghi chú' },
      access: {
        read: isAdminOrSalesFieldLevel,
        create: isAdminOrSalesFieldLevel,
        update: isAdminOrSalesFieldLevel,
      },
      admin: { position: 'sidebar' },
      fields: [{ name: 'note', type: 'textarea', required: true }],
    },
  ],
  timestamps: true,
}
