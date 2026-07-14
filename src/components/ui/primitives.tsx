import type { ComponentProps, ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 md:px-8', className)}>{children}</div>
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} className={cn('py-14 md:py-20', className)}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <div className={cn('mb-10 max-w-3xl', align === 'center' ? 'mx-auto text-center' : '')}>
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-viettel-red">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-extrabold leading-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-ink-soft md:text-lg">{description}</p>}
    </div>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-viettel-red text-white hover:bg-viettel-red-dark shadow-brand',
  secondary: 'bg-ink text-white hover:bg-ink/90',
  outline: 'border border-viettel-red text-viettel-red hover:bg-viettel-red hover:text-white',
  ghost: 'text-ink hover:bg-surface-muted',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viettel-red focus-visible:ring-offset-2 disabled:opacity-60'

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}

export function Badge({
  children,
  className,
  color,
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className,
      )}
      style={color ? { backgroundColor: `${color}1a`, color } : undefined}
    >
      {children}
    </span>
  )
}
