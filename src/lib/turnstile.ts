/**
 * Xac thuc Cloudflare Turnstile. Neu chua cau hinh TURNSTILE_SECRET_KEY -> bo qua (cho phep).
 */
export async function verifyTurnstile(token?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // chua bat chong spam -> khong chan
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch {
    return false
  }
}
