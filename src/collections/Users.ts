import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminFieldLevel } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Hệ thống',
  },
  auth: true,
  access: {
    // Admin quan ly tat ca; user thuong chi thay/sua chinh minh
    read: ({ req: { user } }) => {
      if (hasRole(user, 'admin')) return true
      return { id: { equals: user?.id } }
    },
    create: isAdmin,
    update: ({ req: { user }, id }) => {
      if (hasRole(user, 'admin')) return true
      return user?.id === id
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Họ tên',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Vai trò',
      hasMany: true,
      required: true,
      defaultValue: ['sales'],
      options: [
        { value: 'admin', label: 'Quản trị viên (toàn quyền)' },
        { value: 'editor', label: 'Biên tập nội dung' },
        { value: 'sales', label: 'Kinh doanh (quản lý lead)' },
      ],
      access: {
        // Chi admin moi thay doi vai tro
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Editor: quản lý giải pháp/tin tức/chính sách. Sales: quản lý lead. Admin: toàn quyền.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
    },
  ],
}
