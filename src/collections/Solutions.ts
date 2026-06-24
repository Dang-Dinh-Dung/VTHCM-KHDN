import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, readPublished } from '@/lib/access'
import { statusField, seoGroup } from '@/fields/common'
import { slugField } from '@/fields/slug'
import {
  COMPANY_SIZES,
  INDUSTRIES,
  NEEDS,
  PILLARS,
  PRODUCT_GROUPS,
} from '@/lib/taxonomy'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Giải pháp', plural: 'Giải pháp' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pillar', 'productGroup', 'status', 'isFeatured'],
    group: 'Nội dung',
    listSearchableFields: ['title', 'shortName', 'shortDesc'],
    description: 'Danh mục giải pháp/sản phẩm doanh nghiệp đang cung cấp.',
  },
  access: {
    read: readPublished,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin chung',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', label: 'Tên giải pháp', required: true },
                { name: 'shortName', type: 'text', label: 'Tên ngắn (vd: Sinvoice)' },
              ],
            },
            { name: 'tagline', type: 'text', label: 'Khẩu hiệu ngắn' },
            {
              name: 'shortDesc',
              type: 'textarea',
              label: 'Mô tả ngắn (hiển thị ở thẻ danh sách)',
              required: true,
              maxLength: 300,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo',
                  admin: {
                    description:
                      'Ảnh logo hiển thị trên thẻ giải pháp. Chưa upload sẽ dùng icon trụ cột tạm thời. Khuyến nghị PNG nền trong suốt.',
                  },
                },
                { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện' },
              ],
            },
            { name: 'body', type: 'richText', label: 'Mô tả chi tiết' },
            {
              name: 'features',
              type: 'array',
              label: 'Tính năng / lợi ích nổi bật',
              labels: { singular: 'Tính năng', plural: 'Tính năng' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                { name: 'description', type: 'textarea', label: 'Mô tả' },
              ],
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Câu hỏi thường gặp',
              labels: { singular: 'Câu hỏi', plural: 'Câu hỏi' },
              fields: [
                { name: 'question', type: 'text', label: 'Câu hỏi', required: true },
                { name: 'answer', type: 'textarea', label: 'Trả lời', required: true },
              ],
            },
          ],
        },
        {
          label: 'Bảng giá',
          fields: [
            {
              name: 'pricingNote',
              type: 'text',
              label: 'Ghi chú giá',
              defaultValue: 'Liên hệ để nhận báo giá phù hợp với quy mô doanh nghiệp.',
            },
            {
              name: 'pricingTiers',
              type: 'array',
              label: 'Các gói giá',
              labels: { singular: 'Gói', plural: 'Gói' },
              admin: {
                description: 'Mỗi gói là một cột trong bảng giá / so sánh.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Tên gói', required: true },
                    { name: 'badge', type: 'text', label: 'Nhãn (vd: Phổ biến)' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'isContactForPrice',
                      type: 'checkbox',
                      label: 'Giá theo liên hệ',
                      defaultValue: false,
                    },
                    { name: 'highlight', type: 'checkbox', label: 'Gói nổi bật', defaultValue: false },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Giá (VNĐ)',
                      admin: {
                        description: 'Dùng để so sánh/sắp xếp. Bỏ trống nếu giá theo liên hệ.',
                        condition: (_, sibling) => !sibling?.isContactForPrice,
                      },
                    },
                    {
                      name: 'priceSuffix',
                      type: 'text',
                      label: 'Đơn vị (vd: /tháng, /hóa đơn)',
                    },
                  ],
                },
                {
                  name: 'priceLabel',
                  type: 'text',
                  label: 'Nhãn giá hiển thị (ghi đè)',
                  admin: { description: 'Vd: "Từ 9.000đ/hóa đơn". Bỏ trống sẽ tự dựng từ Giá + Đơn vị.' },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Tính năng trong gói',
                  labels: { singular: 'Dòng', plural: 'Dòng' },
                  fields: [
                    { name: 'text', type: 'text', label: 'Nội dung', required: true },
                    { name: 'included', type: 'checkbox', label: 'Có', defaultValue: true },
                  ],
                },
                { name: 'ctaLabel', type: 'text', label: 'Nhãn nút', defaultValue: 'Đăng ký tư vấn' },
              ],
            },
          ],
        },
        {
          label: 'Phân loại & gợi ý',
          fields: [
            {
              name: 'industries',
              type: 'select',
              label: 'Ngành nghề phù hợp',
              hasMany: true,
              options: INDUSTRIES,
              admin: { description: 'Dùng cho bộ lọc và công cụ "Tìm giải pháp phù hợp".' },
            },
            {
              name: 'needs',
              type: 'select',
              label: 'Nhu cầu giải quyết',
              hasMany: true,
              options: NEEDS,
            },
            {
              name: 'companySizes',
              type: 'select',
              label: 'Quy mô doanh nghiệp phù hợp',
              hasMany: true,
              options: COMPANY_SIZES,
            },
            {
              name: 'relatedSolutions',
              type: 'relationship',
              relationTo: 'solutions',
              hasMany: true,
              label: 'Giải pháp liên quan',
              admin: { description: 'Gợi ý kèm theo ở trang chi tiết.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup],
        },
      ],
    },
    // --- Sidebar ---
    {
      name: 'pillar',
      type: 'select',
      label: 'Trụ cột hệ sinh thái',
      required: true,
      index: true,
      options: PILLARS.map(({ value, label }) => ({ value, label })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'productGroup',
      type: 'select',
      label: 'Nhóm sản phẩm',
      options: PRODUCT_GROUPS,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Nổi bật trên trang chủ',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự ưu tiên',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Số nhỏ hiển thị trước.' },
    },
    statusField,
    slugField('title'),
  ],
}
