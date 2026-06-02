'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/features/account/auth'
import { eurosToCents } from '@/lib/money'

export async function addVariant(productId: string, formData: FormData): Promise<void> {
  await requireRole('admin')
  const label = String(formData.get('label') ?? '').trim()
  if (!label) return
  const price = Number(formData.get('price') ?? 0)
  const stock = Number(formData.get('stock') ?? 0)
  const sku = String(formData.get('sku') ?? '').trim() || null
  const sb = await createClient()
  await sb.from('product_variants').insert({
    product_id: productId,
    label,
    sku,
    price_cents: eurosToCents(price),
    stock_qty: Math.max(0, Math.floor(stock)),
  })
  revalidatePath(`/admin/produits/${productId}`)
}

export async function updateVariant(
  variantId: string,
  productId: string,
  formData: FormData,
): Promise<void> {
  await requireRole('admin')
  const label = String(formData.get('label') ?? '').trim()
  const price = Number(formData.get('price') ?? 0)
  const stock = Number(formData.get('stock') ?? 0)
  const sku = String(formData.get('sku') ?? '').trim() || null
  const sb = await createClient()
  await sb
    .from('product_variants')
    .update({
      label,
      sku,
      price_cents: eurosToCents(price),
      stock_qty: Math.max(0, Math.floor(stock)),
    })
    .eq('id', variantId)
  revalidatePath(`/admin/produits/${productId}`)
}

export async function deleteVariant(variantId: string, productId: string): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  await sb.from('product_variants').delete().eq('id', variantId)
  revalidatePath(`/admin/produits/${productId}`)
}
