import { createClient } from '@/lib/supabase/server'
import { toProductCard, toProductDetail } from './transform'

export interface ProductCard {
  id: string
  name: string
  slug: string
  brand: string | null
  image: string | null
  /** Prix mini en centimes parmi les variantes actives. */
  fromPriceCents: number
  inStock: boolean
}

export interface ProductVariantView {
  id: string
  label: string
  priceCents: number
  stock: number
}

export interface ProductDetail extends ProductCard {
  description: string
  category: string | null
  objectives: string[]
  variants: ProductVariantView[]
  images: string[]
}

export type CatalogSort = 'newest' | 'price_asc' | 'price_desc'

export interface CatalogFilters {
  categorySlug?: string
  brandSlug?: string
  objectiveSlug?: string
  search?: string
  sort?: CatalogSort
}

export async function listProducts(filters: CatalogFilters = {}): Promise<ProductCard[]> {
  const sb = await createClient()
  const brandJoin = filters.brandSlug ? 'brands!inner(name, slug)' : 'brands(name, slug)'
  const catJoin = filters.categorySlug ? 'categories!inner(slug)' : 'categories(slug)'
  const objJoin = filters.objectiveSlug
    ? 'product_objectives!inner(objectives!inner(slug))'
    : 'product_objectives(objectives(slug))'

  let q = sb
    .from('products')
    .select(
      `id, name, slug, images, created_at, ${brandJoin}, ${catJoin}, ${objJoin}, product_variants(price_cents, stock_qty, is_active)`,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters.search) q = q.ilike('name', `%${filters.search}%`)
  if (filters.categorySlug) q = q.eq('categories.slug', filters.categorySlug)
  if (filters.brandSlug) q = q.eq('brands.slug', filters.brandSlug)
  if (filters.objectiveSlug) q = q.eq('product_objectives.objectives.slug', filters.objectiveSlug)

  const { data, error } = await q
  if (error) throw error

  const cards = (data ?? []).map(toProductCard)
  if (filters.sort === 'price_asc') cards.sort((a, b) => a.fromPriceCents - b.fromPriceCents)
  if (filters.sort === 'price_desc') cards.sort((a, b) => b.fromPriceCents - a.fromPriceCents)
  return cards
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const sb = await createClient()
  const { data, error } = await sb
    .from('products')
    .select(
      `id, name, slug, description, images, brands(name), categories(name), product_objectives(objectives(name)), product_variants(id, label, price_cents, stock_qty, is_active)`,
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return toProductDetail(data)
}
