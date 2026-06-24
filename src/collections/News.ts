import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, readPublished } from '@/lib/access'
import { statusField, seoGroup } from '@/fields/common'
import { slugField } from '@/fields/slug'
import { NEWS_CATEGORIES } from '@/lib/taxonomy'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Tin tức', plural: 'Tin tức' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'status'],
    group: 'Nội dung',
    listSearchableFields: ['title', 'excerpt'],
    description: 'Tin tức Viettel, khuyến mãi, sự kiện, cập nhật chuyển đổi số.',
  },
  access: {
    read: readPublished,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Tóm tắt',
      maxLength: 320,
      admin: { description: 'Hiển thị ở danh sách và khi chia sẻ.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh bìa' },
    { name: 'body', type: 'richText', label: 'Nội dung' },
    {
      name: 'tags',
      type: 'array',
      label: 'Thẻ',
      labels: { singular: 'Thẻ', plural: 'Thẻ' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Giải pháp liên quan',
    },
    seoGroup,
    // --- Sidebar ---
    {
      name: 'category',
      type: 'select',
      label: 'Chuyên mục',
      options: NEWS_CATEGORIES,
      required: true,
      defaultValue: 'tin-viettel',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      defaultValue: () => new Date().toISOString(),
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'author', type: 'text', label: 'Tác giả', admin: { position: 'sidebar' } },
    statusField,
    slugField('title'),
  ],
}
