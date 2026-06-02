'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/features/account/auth'
import { slugify } from '@/lib/slugify'

export interface ProductFormState {
  error?: string
}

function embedName(v: unknown): string | null {
  if (Array.isArray(v)) return (v[0] as { name?: string } | undefined)?.name ?? null
  return (v as { name?: string } | null)?.name ?? null
}

export interface AdminProductRow {
  id: string
  name: string
  slug: string
  brand: string | null
  category: string | null
  isActive: boolean
  variantCount: number
  totalStock: number
  minPriceCents: number | null
}

export async function listAdminProducts(): Promise<AdminProductRow[]> {
  await requireRole('admin')
  const sb = await createClient()
  const { data } = await sb
    .from('products')
    .select('id, name, slug, is_active, brands(name), categories(name), product_variants(price_cents, stock_qty)')
    .order('created_at', { ascending: false })
  return (data ?? []).map((p) => {
    const variants = (p.product_variants ?? []) as { price_cents: number; stock_qty: number }[]
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: embedName(p.brands),
      category: embedName(p.categories),
      isActive: p.is_active,
      variantCount: variants.length,
      totalStock: variants.reduce((s, v) => s + v.stock_qty, 0),
      minPriceCents: variants.length ? Math.min(...variants.map((v) => v.price_cents)) : null,
    }
  })
}

export interface AdminVariant {
  id: string
  label: string
  sku: string | null
  priceCents: number
  stock: number
}

export interface AdminProductDetail {
  id: string
  name: string
  slug: string
  description: string
  brandId: string | null
  categoryId: string | null
  isActive: boolean
  objectiveIds: string[]
  variants: AdminVariant[]
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  await requireRole('admin')
  const sb = await createClient()
  const { data } = await sb
    .from('products')
    .select(
      'id, name, slug, description, brand_id, category_id, is_active, product_objectives(objective_id), product_variants(id, label, sku, price_cents, stock_qty)',
    )
    .eq('id', id)
    .maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    brandId: data.brand_id,
    categoryId: data.category_id,
    isActive: data.is_active,
    objectiveIds: ((data.product_objectives ?? []) as { objective_id: string }[]).map(
      (o) => o.objective_id,
    ),
    variants: (
      (data.product_variants ?? []) as {
        id: string
        label: string
        sku: string | null
        price_cents: number
        stock_qty: number
      }[]
    ).map((v) => ({
      id: v.id,
      label: v.label,
      sku: v.sku,
      priceCents: v.price_cents,
      stock: v.stock_qty,
    })),
  }
}

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole('admin')
  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'Le nom est requis.' }
  const slug = slugify(String(formData.get('slug') ?? '') || name)
  const description = String(formData.get('description') ?? '')
  const brand_id = String(formData.get('brand_id') ?? '') || null
  const category_id = String(formData.get('category_id') ?? '') || null
  const is_active = formData.get('is_active') === 'on'
  const objectiveIds = formData.getAll('objectives').map(String)

  const sb = await createClient()
  let productId = id
  if (id) {
    const { error } = await sb
      .from('products')
      .update({ name, slug, description, brand_id, category_id, is_active })
      .eq('id', id)
    if (error) return { error: 'Échec de la mise à jour (slug déjà utilisé ?).' }
  } else {
    const { data, error } = await sb
      .from('products')
      .insert({ name, slug, description, brand_id, category_id, is_active })
      .select('id')
      .single()
    if (error || !data) return { error: 'Échec de la création (slug déjà utilisé ?).' }
    productId = data.id
  }

  await sb.from('product_objectives').delete().eq('product_id', productId)
  if (objectiveIds.length) {
    await sb
      .from('product_objectives')
      .insert(objectiveIds.map((oid) => ({ product_id: productId, objective_id: oid })))
  }

  revalidatePath('/admin/produits')
  redirect(`/admin/produits/${productId}`)
}

export async function deleteProduct(id: string): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  await sb.from('products').delete().eq('id', id)
  revalidatePath('/admin/produits')
  redirect('/admin/produits')
}
