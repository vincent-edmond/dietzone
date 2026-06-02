import type { ProductCard, ProductDetail } from './queries'

interface VariantRow {
  id?: string
  label?: string
  price_cents: number
  stock_qty: number
  is_active: boolean
}

interface NamedRow {
  name?: string | null
  slug?: string | null
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  description?: string | null
  images?: string[] | null
  brands?: NamedRow | NamedRow[] | null
  categories?: NamedRow | NamedRow[] | null
  product_variants?: VariantRow[] | null
  product_objectives?: { objectives?: NamedRow | NamedRow[] | null }[] | null
}

/** Normalise un embed Supabase qui peut être objet ou tableau. */
function one<T>(v: T | T[] | null | undefined): T | null {
  if (Array.isArray(v)) return v[0] ?? null
  return v ?? null
}

export function toProductCard(row: ProductRow): ProductCard {
  const variants = (row.product_variants ?? []).filter((v) => v.is_active)
  const prices = variants.map((v) => v.price_cents)
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: one(row.brands)?.name ?? null,
    image: row.images?.[0] ?? null,
    fromPriceCents: prices.length ? Math.min(...prices) : 0,
    inStock: variants.some((v) => v.stock_qty > 0),
  }
}

export function toProductDetail(row: ProductRow): ProductDetail {
  const card = toProductCard(row)
  const variants = (row.product_variants ?? [])
    .filter((v) => v.is_active)
    .map((v) => ({
      id: v.id ?? '',
      label: v.label ?? '',
      priceCents: v.price_cents,
      stock: v.stock_qty,
    }))
  const objectives = (row.product_objectives ?? [])
    .map((po) => one(po.objectives)?.name ?? null)
    .filter((n): n is string => Boolean(n))
  return {
    ...card,
    description: row.description ?? '',
    category: one(row.categories)?.name ?? null,
    objectives,
    variants,
    images: row.images ?? [],
  }
}
