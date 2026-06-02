import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const sb = await createClient()
  const { data: products } = await sb
    .from('products')
    .select('slug, created_at')
    .eq('is_active', true)

  const staticPaths = [
    '',
    '/boutique',
    '/pro',
    '/a-propos',
    '/contact',
    '/faq',
    '/livraison-retours',
    '/cgv',
    '/mentions-legales',
  ]
  const now = new Date()
  const staticUrls: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
  }))
  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${base}/produit/${p.slug}`,
    lastModified: new Date(p.created_at),
  }))

  return [...staticUrls, ...productUrls]
}
