import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// Dung cac API nay THAY CHO next/link va next/navigation o moi trang cong khai,
// de dieu huong noi bo tu dong giu nguyen ngon ngu hien tai.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
