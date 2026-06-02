import { createClient } from '@/lib/supabase/server'
import { formatCatalog, type LLMProduct } from './catalog'

function embedName(v: unknown): string | null {
  if (Array.isArray(v)) return (v[0] as { name?: string } | undefined)?.name ?? null
  return (v as { name?: string } | null)?.name ?? null
}

/** Construit le contexte catalogue (produits actifs + stock) pour l'assistant. */
export async function getCatalogContext(): Promise<string> {
  const sb = await createClient()
  const { data } = await sb
    .from('products')
    .select('name, brands(name), categories(name), product_variants(label, price_cents, stock_qty, is_active)')
    .eq('is_active', true)
  const products: LLMProduct[] = (data ?? []).map((p) => ({
    name: p.name,
    brand: embedName(p.brands),
    category: embedName(p.categories),
    variants: ((p.product_variants ?? []) as {
      label: string
      price_cents: number
      stock_qty: number
      is_active: boolean
    }[])
      .filter((v) => v.is_active)
      .map((v) => ({ label: v.label, priceCents: v.price_cents, stock: v.stock_qty })),
  }))
  return formatCatalog(products)
}
