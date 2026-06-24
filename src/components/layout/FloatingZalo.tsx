import { MessageCircle } from 'lucide-react'

/**
 * Nut Zalo OA noi o goc duoi phai. Chi hien khi co cau hinh zaloOaUrl trong SiteSettings.
 */
export function FloatingZalo({ zaloOaUrl }: { zaloOaUrl?: string | null }) {
  if (!zaloOaUrl) return null

  return (
    <a
      href={zaloOaUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat với phòng KHDN qua Zalo OA"
      className="group fixed bottom-5 right-5 z-[90] inline-flex items-center gap-2 rounded-full bg-[#0068FF] py-3 pl-3 pr-4 text-white shadow-lg shadow-[#0068FF]/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2 md:bottom-7 md:right-7"
    >
      {/* Vong ping nhe (tat khi reduced-motion qua globals) */}
      <span
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#0068FF] opacity-30"
        aria-hidden
      />
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <MessageCircle className="h-5 w-5" aria-hidden strokeWidth={2} />
      </span>
      <span className="text-sm font-semibold">Chat Zalo</span>
    </a>
  )
}
