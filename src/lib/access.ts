import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor' | 'sales'

/** Kiem tra user co it nhat 1 trong cac vai tro */
export const hasRole = (user: unknown, ...roles: Role[]): boolean => {
  const r = (user as { roles?: Role[] } | null)?.roles
  return Array.isArray(r) && r.some((role) => roles.includes(role))
}

/** Chi admin */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

/** Admin hoac editor (quan ly noi dung) */
export const isAdminOrEditor: Access = ({ req: { user } }) => hasRole(user, 'admin', 'editor')

/** Admin hoac sales (quan ly lead) */
export const isAdminOrSales: Access = ({ req: { user } }) => hasRole(user, 'admin', 'sales')

/** Da dang nhap (bat ky vai tro) */
export const isSignedIn: Access = ({ req: { user } }) => Boolean(user)

/** Ai cung duoc (cong khai) */
export const anyone: Access = () => true

/**
 * Doc cong khai noi dung da xuat ban; user dang nhap thay tat ca (ke ca ban nhap).
 * Tra ve query constraint cho khach an danh.
 */
export const readPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}

/** Field-level: chi admin moi sua duoc (vd: truong roles) */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

/** Field-level: admin hoac sales (vd: truong noi bo cua lead) */
export const isAdminOrSalesFieldLevel: FieldAccess = ({ req: { user } }) =>
  hasRole(user, 'admin', 'sales')
