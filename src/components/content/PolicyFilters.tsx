'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

import { POLICY_TYPES } from '@/lib/taxonomy'
import { cn } from '@/lib/cn'

export function PolicyFilters({
  issuingBodies,
  years,
}: {
  issuingBodies: string[]
  years: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()))
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.push(`${pathname}?${next.toString()}`)
  }

  const documentType = sp.get('documentType') ?? ''
  const issuingBody = sp.get('issuingBody') ?? ''
  const year = sp.get('year') ?? ''

  return (
    <aside className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setParam('q', q.trim() || undefined)
        }}
      >
        <label htmlFor="policy-search" className="mb-1 block text-sm font-semibold text-ink">Tìm kiếm</label>
        <input
          id="policy-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Số hiệu, từ khóa..."
          className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm outline-none focus:border-viettel-red"
        />
      </form>

      <div>
        <div className="mb-2 text-sm font-semibold text-ink">Loại văn bản</div>
        <div className="space-y-1">
          <button onClick={() => setParam('documentType')} className={cn('block text-sm', !documentType ? 'font-semibold text-viettel-red' : 'text-ink-soft hover:text-viettel-red')}>Tất cả</button>
          {POLICY_TYPES.map((t) => (
            <button key={t.value} onClick={() => setParam('documentType', t.value)} className={cn('block text-sm', documentType === t.value ? 'font-semibold text-viettel-red' : 'text-ink-soft hover:text-viettel-red')}>{t.label}</button>
          ))}
        </div>
      </div>

      {issuingBodies.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Cơ quan ban hành</div>
          <select aria-label="Cơ quan ban hành" value={issuingBody} onChange={(e) => setParam('issuingBody', e.target.value || undefined)} className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {issuingBodies.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      {years.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Năm hiệu lực</div>
          <select aria-label="Năm hiệu lực" value={year} onChange={(e) => setParam('year', e.target.value || undefined)} className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </aside>
  )
}
