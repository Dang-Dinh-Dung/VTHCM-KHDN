import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Bo qua: /api va /admin cua Payload, noi bo Next (_next, _vercel),
  // va moi duong dan co dau cham (sitemap.xml, robots.txt, favicon, anh...).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
