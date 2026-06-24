import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, readPublished } from '@/lib/access'
import { statusField, seoGroup } from '@/fields/common'
import { slugField } from '@/fields/slug'
import { POLICY_TYPES } from '@/lib/taxonomy'

export const Policies: CollectionConfig = {
  slug: 'policies',
  labels: { singular: 'Chính sách', plural: 'Nghị định & chính sách' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'documentType', 'documentNumber', 'effectiveDate', 'status'],
    group: 'Nội dung',
    listSearchableFields: ['title', 'documentNumber', 'summary', 'issuingBody'],
    description: 'Nghị định, thông tư, chính sách nhà nước liên quan tới giải pháp Viettel.',
  },
  access: {
    read: readPublished,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề văn bản', required: true },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt nội dung & tác động',
      required: true,
      admin: { description: 'Giải thích ngắn gọn ảnh hưởng tới doanh nghiệp.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh minh họa' },
    { name: 'body', type: 'richText', label: 'Nội dung chi tiết / phân tích' },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      label: 'File văn bản đính kèm (PDF)',
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Liên kết nguồn chính thức',
      admin: { description: 'URL tới văn bản gốc trên cổng thông tin chính phủ.' },
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Giải pháp Viettel liên quan',
      admin: { description: 'Vd: Nghị định hóa đơn điện tử → Sinvoice/vInvoice.' },
    },
    seoGroup,
    // --- Sidebar ---
    {
      name: 'documentType',
      type: 'select',
      label: 'Loại văn bản',
      options: POLICY_TYPES,
      required: true,
      defaultValue: 'nghi-dinh',
      index: true,
      admin: { position: 'sidebar' },
    },
    { name: 'documentNumber', type: 'text', label: 'Số hiệu văn bản', admin: { position: 'sidebar' } },
    { name: 'issuingBody', type: 'text', label: 'Cơ quan ban hành', admin: { position: 'sidebar' } },
    {
      name: 'effectiveDate',
      type: 'date',
      label: 'Ngày hiệu lực',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    statusField,
    slugField('title'),
  ],
}
