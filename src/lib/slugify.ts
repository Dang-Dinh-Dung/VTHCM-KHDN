/**
 * Chuyen chuoi tieng Viet co dau thanh slug khong dau, an toan cho URL.
 * Vi du: "Hoa don dien tu Sinvoice" -> "hoa-don-dien-tu-sinvoice"
 */
export function slugify(input: string): string {
  if (!input) return ''
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bo dau ket hop (combining marks)
    .replace(/[đ]/g, 'd') // d co gach (đ)
    .replace(/[Đ]/g, 'd') // D co gach (Đ)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // bo ky tu dac biet
    .replace(/[\s_-]+/g, '-') // gop khoang trang/gach
    .replace(/^-+|-+$/g, '') // bo gach dau/cuoi
}
