import type { Field } from 'payload'

import { STATUS_OPTIONS } from '@/lib/taxonomy'

/** Truong trang thai xuat ban (nhap/da xuat ban) - dat o sidebar */
export const statusField: Field = {
  name: 'status',
  type: 'select',
  label: 'Trạng thái',
  options: STATUS_OPTIONS,
  defaultValue: 'draft',
  required: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Chỉ nội dung "Đã xuất bản" mới hiển thị công khai.',
  },
}

/** Nhom truong SEO dung lai cho cac collection co trang chi tiet */
export const seoGroup: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO & chia sẻ',
  admin: {
    description: 'Tùy chỉnh tiêu đề/mô tả khi xuất hiện trên Google & mạng xã hội. Để trống sẽ dùng giá trị mặc định.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta description' },
      ],
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh chia sẻ (Open Graph)',
    },
  ],
}
