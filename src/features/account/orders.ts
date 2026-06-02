import { createClient } from '@/lib/supabase/server'
import type { OrderStatus, Fulfillment } from '@/types/domain'

export interface OrderSummary {
  id: string
  createdAt: string
  totalCents: number
  status: OrderStatus
  fulfillment: Fulfillment
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente de paiement',
  paid: 'Payée',
  to_pay_pickup: 'À payer au retrait',
  preparing: 'En préparation',
  ready: 'Prête',
  shipped: 'Expédiée',
  picked_up: 'Retirée',
  cancelled: 'Annulée',
}

export async function listMyOrders(): Promise<OrderSummary[]> {
  const sb = await createClient()
  const { data } = await sb
    .from('orders')
    .select('id, created_at, total_cents, status, fulfillment')
    .order('created_at', { ascending: false })
  return (data ?? []).map((o) => ({
    id: o.id,
    createdAt: o.created_at,
    totalCents: o.total_cents,
    status: o.status as OrderStatus,
    fulfillment: o.fulfillment as Fulfillment,
  }))
}
