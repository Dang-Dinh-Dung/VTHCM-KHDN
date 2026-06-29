'use client'

import { useState } from 'react'

type Result = {
  ok: boolean
  skipped?: boolean
  reason?: string
  created?: number
  matched?: number
  fetched?: number
  skippedExisting?: number
  error?: string
}

/**
 * Nut cho admin/editor tu bam crawl van ban ngay (chay thu cong, ngoai lich cron).
 * Goi POST /api/admin/crawl-policies (xac thuc bang cookie phien admin).
 */
export function CrawlNowButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  async function run() {
    setLoading(true)
    setMsg(null)
    setIsError(false)
    try {
      const res = await fetch('/api/admin/crawl-policies', { method: 'POST' })
      const data: Result = await res.json()
      if (!res.ok || data.ok === false) {
        setIsError(true)
        setMsg(data.error === 'unauthorized' ? 'Không có quyền chạy crawl.' : `Lỗi: ${data.error ?? 'không xác định'}`)
      } else if (data.skipped) {
        setMsg('Crawl đang TẮT. Bật "Tự động crawl" trong Cấu hình website để dùng.')
      } else {
        setMsg(
          `Xong: lấy ${data.fetched ?? 0}, khớp ${data.matched ?? 0}, thêm mới ${data.created ?? 0}, bỏ qua trùng ${data.skippedExisting ?? 0}.`,
        )
        if ((data.created ?? 0) > 0) setTimeout(() => window.location.reload(), 1500)
      }
    } catch (e) {
      setIsError(true)
      setMsg(`Lỗi gọi API: ${String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          border: '1px solid var(--theme-elevation-150)',
          background: loading ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
          color: 'var(--theme-text)',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? '⏳ Đang crawl...' : '🔄 Crawl văn bản ngay'}
      </button>
      {msg && (
        <span style={{ fontSize: '12px', color: isError ? '#ee0033' : 'var(--theme-elevation-600)' }}>{msg}</span>
      )}
    </div>
  )
}
