import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gop class Tailwind an toan (xu ly trung lap) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
