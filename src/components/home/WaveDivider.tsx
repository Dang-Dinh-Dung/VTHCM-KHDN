import { cn } from '@/lib/cn'

/**
 * Duong luon song ngan giua cac section (chuyen the tu tham khao).
 * Dat trong mot section co position:relative + overflow-hidden.
 * - position="top": song o dinh section (mau `fill` cua section phia tren tran xuong).
 * - position="bottom": song o day section (mau `fill` cua section phia duoi).
 */
export function WaveDivider({
  position = 'top',
  fill = '#ffffff',
  className,
}: {
  position?: 'top' | 'bottom'
  fill?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 z-[1] leading-[0]',
        position === 'top' ? 'top-0' : 'bottom-0',
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={cn('h-8 w-full md:h-12', position === 'bottom' && 'rotate-180')}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 L0,34 Q360,66 720,34 T1440,34 L1440,0 Z" fill={fill} />
      </svg>
    </div>
  )
}
