import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Thư viện Media' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Mô tả ảnh (alt)',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      label: 'Chú thích',
      type: 'text',
    },
  ],
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    focalPoint: true,
  },
}
