'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/features/account/auth'
import { isValidTransition } from './orderStatus'
import type { OrderStatus, Fulfillment, PaymentMethod } from '@/types/domain'

export interface AdminOrderRow {
  id: string
  email: string
  totalCents: number
  status: OrderStatus
  fulfillment: Fulfillment
  paymentMethod: PaymentMethod
  createdAt: string
}

export interface AdminOrderItem {
  name: string
  unitPriceCents: number
  qty: number
}

export interface AdminOrderDetail extends AdminOrderRow {
  subtotalCents: number
  shippingCents: number
  isProOrder: boolean
  shippingAddress: Record<string, unknown> | null
  items: AdminOrderItem[]
}

export async function listOrders(): Promise<AdminOrderRow[]> {
  await requireRole('admin')
  const sb = await createClient()
  const { data } = await sb
    .from('orders')
    .select('id, email, total_cents, status, fulfillment, payment_method, created_at')
    .order('created_at', { ascending: false })
  return (data ?? []).map((o) => ({
    id: o.id,
    email: o.email,
    totalCents: o.total_cents,
    status: o.status as OrderStatus,
    fulfillment: o.fulfillment as Fulfillment,
    paymentMethod: o.payment_method as PaymentMethod,
    createdAt: o.created_at,
  }))
}

export async function getOrder(id: string): Promise<AdminOrderDetail | null> {
  await requireRole('admin')
  const sb = await createClient()
  const { data } = await sb
    .from('orders')
    .select(
      'id, email, total_cents, subtotal_cents, shipping_cents, status, fulfillment, payment_method, is_pro_order, shipping_address, created_at, order_items(name_snapshot, unit_price_cents, qty)',
    )
    .eq('id', id)
    .maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    email: data.email,
    totalCents: data.total_cents,
    subtotalCents: data.subtotal_cents,
    shippingCents: data.shipping_cents,
    status: data.status as OrderStatus,
    fulfillment: data.fulfillment as Fulfillment,
    paymentMethod: data.payment_method as PaymentMethod,
    isProOrder: data.is_pro_order,
    shippingAddress: data.shipping_address as Record<string, unknown> | null,
    createdAt: data.created_at,
    items: ((data.order_items ?? []) as {
      name_snapshot: string
      unit_price_cents: number
      qty: number
    }[]).map((it) => ({
      name: it.name_snapshot,
      unitPriceCents: it.unit_price_cents,
      qty: it.qty,
    })),
  }
}

export async function changeOrderStatus(id: string, formData: FormData): Promise<void> {
  await requireRole('admin')
  const to = String(formData.get('status') ?? '') as OrderStatus
  const sb = await createClient()
  const { data: current } = await sb.from('orders').select('status').eq('id', id).maybeSingle()
  if (!current) return
  if (!isValidTransition(current.status as OrderStatus, to)) return
  await sb.from('orders').update({ status: to }).eq('id', id)
  revalidatePath(`/admin/commandes/${id}`)
  revalidatePath('/admin/commandes')
}
