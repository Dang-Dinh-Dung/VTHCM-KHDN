import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { NEWS, POLICIES, SOLUTIONS } from './data'

/** Dung mot lexical editor state toi thieu hop le tu cac doan van ban.
 *  Luu y: root.children KHONG duoc rong (Lexical loi "root node never becomes empty"),
 *  nen khi khong co doan nao van tao 1 paragraph rong. */
const lexical = (paragraphs: string[] = []) => {
  const items = paragraphs.length > 0 ? paragraphs : ['']
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: items.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: text
          ? [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }]
          : [],
      })),
    },
  }
}

const daysAgoISO = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

async function run() {
  const payload = await getPayload({ config })

  // eslint-disable-next-line no-console
  const log = (...args: unknown[]) => console.log('[seed]', ...args)

  /** Tim ban ghi theo slug; tra ve id neu co */
  const findIdBySlug = async (collection: 'solutions' | 'news' | 'policies', slug: string) => {
    const res = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return res.docs[0]?.id as string | number | undefined
  }

  const upsert = async (
    collection: 'solutions' | 'news' | 'policies',
    slug: string,
    data: Record<string, unknown>,
  ) => {
    const existingId = await findIdBySlug(collection, slug)
    if (existingId) {
      const doc = await payload.update({ collection, id: existingId, data })
      return doc.id as string | number
    }
    const doc = await payload.create({ collection, data: { ...data, slug } })
    return doc.id as string | number
  }

  // --- 1. Admin user ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@khdn-viettel-hcm.vn'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345'
  const userCount = await payload.count({ collection: 'users' })
  if (userCount.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Quản trị viên',
        email: adminEmail,
        password: adminPassword,
        roles: ['admin'],
      },
    })
    log(`Tao admin: ${adminEmail} / ${adminPassword}`)
  } else {
    log(`Da co ${userCount.totalDocs} user, bo qua tao admin.`)
  }

  // --- 2. Site settings ---
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      departmentName: 'Phòng Khách hàng Doanh nghiệp - Viettel Hồ Chí Minh',
      hotline: '1800 8000',
      email: 'khdn.hcm@viettel.com.vn',
      address: 'Tòa nhà Viettel, Quận 10, TP. Hồ Chí Minh',
      workingHours: 'Thứ 2 - Thứ 7, 08:00 - 17:30',
      // Placeholder: doi sang link Zalo OA that trong /admin (tab Lien he)
      zaloOaUrl: 'https://zalo.me/',
      heroHeadline: 'Giải pháp chuyển đổi số toàn diện cho doanh nghiệp',
      heroSubheadline:
        'Hệ sinh thái sản phẩm Viettel: viễn thông, chữ ký số, hóa đơn điện tử, cloud, quản trị doanh nghiệp - đồng hành cùng doanh nghiệp tại TP. Hồ Chí Minh.',
      stats: [
        { value: '30+', label: 'Giải pháp doanh nghiệp' },
        { value: '6', label: 'Trụ cột hệ sinh thái' },
        { value: '24/7', label: 'Hỗ trợ khách hàng' },
        { value: '100%', label: 'Hạ tầng trong nước' },
      ],
      policyCrawlEnabled: false,
      policyCrawlKeywords: [
        { keyword: 'hóa đơn điện tử' },
        { keyword: 'chữ ký số' },
        { keyword: 'bảo hiểm xã hội' },
        { keyword: 'thuế' },
        { keyword: 'hợp đồng điện tử' },
        { keyword: 'vận tải' },
        { keyword: 'chuyển đổi số' },
        { keyword: 'an toàn thông tin' },
      ],
    },
  })
  log('Cap nhat Site settings.')

  // --- 3. Solutions (luot 1: tao/cap nhat, chua link related) ---
  const slugToId = new Map<string, string | number>()
  for (const s of SOLUTIONS) {
    const id = await upsert('solutions', s.slug, {
      title: s.title,
      shortName: s.shortName,
      status: 'published',
      pillar: s.pillar,
      productGroup: s.productGroup,
      tagline: s.tagline,
      shortDesc: s.shortDesc,
      body: lexical(s.bodyParagraphs),
      features: s.features ?? [],
      faqs: s.faqs ?? [],
      industries: s.industries ?? [],
      needs: s.needs ?? [],
      companySizes: s.companySizes ?? [],
      pricingNote: s.pricingNote,
      pricingTiers: (s.pricingTiers ?? []).map((t) => ({
        name: t.name,
        badge: t.badge,
        isContactForPrice: t.isContactForPrice ?? false,
        highlight: t.highlight ?? false,
        price: t.price,
        priceSuffix: t.priceSuffix,
        priceLabel: t.priceLabel,
        ctaLabel: t.ctaLabel ?? 'Đăng ký tư vấn',
        features: (t.features ?? []).map((text) => ({ text, included: true })),
      })),
      isFeatured: s.isFeatured ?? false,
      order: s.order ?? 100,
    })
    slugToId.set(s.slug, id)
  }
  log(`Seed ${SOLUTIONS.length} giai phap.`)

  // --- 4. Solutions (luot 2: link relatedSolutions) ---
  for (const s of SOLUTIONS) {
    if (!s.relatedSlugs?.length) continue
    const id = slugToId.get(s.slug)
    if (!id) continue
    const related = s.relatedSlugs.map((rs) => slugToId.get(rs)).filter(Boolean)
    if (related.length) {
      await payload.update({ collection: 'solutions', id, data: { relatedSolutions: related } })
    }
  }
  log('Lien ket giai phap lien quan.')

  // --- 5. News ---
  for (const n of NEWS) {
    const related = (n.relatedSlugs ?? []).map((rs) => slugToId.get(rs)).filter(Boolean)
    await upsert('news', n.slug, {
      title: n.title,
      status: 'published',
      category: n.category,
      excerpt: n.excerpt,
      body: lexical(n.bodyParagraphs),
      tags: (n.tags ?? []).map((tag) => ({ tag })),
      relatedSolutions: related,
      publishedAt: daysAgoISO(n.daysAgo ?? 1),
      author: 'Phòng KHDN Viettel HCM',
    })
  }
  log(`Seed ${NEWS.length} tin tuc.`)

  // --- 6. Policies ---
  for (const p of POLICIES) {
    const related = (p.relatedSlugs ?? []).map((rs) => slugToId.get(rs)).filter(Boolean)
    await upsert('policies', p.slug, {
      title: p.title,
      status: 'published',
      documentType: p.documentType,
      documentNumber: p.documentNumber,
      issuingBody: p.issuingBody,
      summary: p.summary,
      body: lexical(p.bodyParagraphs),
      sourceUrl: p.sourceUrl,
      relatedSolutions: related,
      effectiveDate: p.effectiveDateISO ? new Date(p.effectiveDateISO).toISOString() : undefined,
      publishedAt: new Date().toISOString(),
    })
  }
  log(`Seed ${POLICIES.length} chinh sach.`)

  log('HOAN TAT seed du lieu.')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] LOI:', err)
  process.exit(1)
})
