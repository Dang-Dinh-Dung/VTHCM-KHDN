import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type LexicalData = ComponentProps<typeof LexicalRichText>['data']

/**
 * Render noi dung richtext (lexical) tu Payload.
 * Styling toi gian, dam bao doc tot tren mobile.
 */
export function RichText({
  data,
  className,
}: {
  data?: LexicalData | null
  className?: string
}) {
  if (!data) return null
  return (
    <div
      className={cn(
        'max-w-none leading-relaxed text-ink-soft',
        '[&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink',
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_a]:text-viettel-red [&_a]:underline [&_li]:mb-1',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
