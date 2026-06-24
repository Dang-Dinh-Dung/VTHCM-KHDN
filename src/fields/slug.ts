import type { Field } from 'payload'

import { slugify } from '@/lib/slugify'

/**
 * Truong slug dung lai cho nhieu collection.
 * Tu sinh tu `sourceField` (mac dinh "title") khi de trong; luon chuan hoa ve dang khong dau.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Đường dẫn (slug)',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Để trống sẽ tự sinh từ tiêu đề. Dùng trong URL, chỉ gồm chữ thường, số và dấu gạch.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return slugify(value)
        }
        const source = data?.[sourceField]
        if (typeof source === 'string' && source.length > 0) {
          return slugify(source)
        }
        return value
      },
    ],
  },
})
