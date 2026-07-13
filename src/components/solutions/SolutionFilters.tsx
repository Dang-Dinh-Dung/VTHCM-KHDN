'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'
import { taxonomyLabel, type TaxonomyGroup } from '@/lib/taxonomy-i18n'
import { COMPANY_SIZES, INDUSTRIES, NEEDS, type Option, PILLARS, PRODUCT_GROUPS } from '@/lib/taxonomy'

const selectClass =
  'w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm text-ink focus:border-viettel-red focus:outline-none'

function Select({
  label,
  param,
  options,
  group,
  value,
  onChange,
}: {
  label: string
  param: string
  options: Option[]
  /** Nhom taxonomy de dich nhan lua chon; bo trong => giu label goc (vd nhom san pham) */
  group?: TaxonomyGroup
  value: string
  onChange: (param: string, value: string) => void
}) {
  const t = useTranslations('taxonomy')
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-soft">{label}</span>
      <select className={selectClass} value={value} onChange={(e) => onChange(param, e.target.value)}>
        <option value="">Tất cả</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {group ? taxonomyLabel(t, group, o.value, options) : o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SolutionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const current = (key: string) => searchParams.get(key) ?? ''

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParam('q', q.trim())
  }

  const pillarOptions = PILLARS.map(({ value, label }) => ({ value, label }))
  const hasFilters = ['pillar', 'productGroup', 'industry', 'need', 'companySize', 'q'].some((k) =>
    searchParams.get(k),
  )

  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-4 md:p-5">
      <form onSubmit={submitSearch} className="mb-4 flex gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên giải pháp, nhu cầu..."
          className="flex-1 rounded-lg border border-border-soft px-3 py-2 text-sm focus:border-viettel-red focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-viettel-red px-4 py-2 text-sm font-semibold text-white hover:bg-viettel-red-dark"
        >
          Tìm
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select label="Trụ cột" param="pillar" options={pillarOptions} group="pillars" value={current('pillar')} onChange={setParam} />
        <Select label="Nhóm sản phẩm" param="productGroup" options={PRODUCT_GROUPS} value={current('productGroup')} onChange={setParam} />
        <Select label="Ngành nghề" param="industry" options={INDUSTRIES} group="industries" value={current('industry')} onChange={setParam} />
        <Select label="Nhu cầu" param="need" options={NEEDS} group="needs" value={current('need')} onChange={setParam} />
        <Select label="Quy mô" param="companySize" options={COMPANY_SIZES} group="companySizes" value={current('companySize')} onChange={setParam} />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className={cn('mt-3 text-sm font-semibold text-viettel-red hover:underline')}
        >
          ✕ Xóa bộ lọc
        </button>
      )}
    </div>
  )
}
