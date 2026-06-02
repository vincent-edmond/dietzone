import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types/domain'

export interface RecentOrder {
  id: string
  email: string
  totalCents: number
  status: OrderStatus
  createdAt: string
}

export interface DashboardStats {
  monthRevenueCents: number
  ordersToPrepare: number
  lowStockCount: number
  pendingProCount: number
  recentOrders: RecentOrder[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sb = await createClient()
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const [paid, prepare, lowStock, pendingPro, recent] = await Promise.all([
    sb.from('orders').select('total_cents').eq('status', 'paid').gte('created_at', start.toISOString()),
    sb
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['paid', 'to_pay_pickup', 'preparing']),
    sb.from('product_variants').select('id', { count: 'exact', head: true }).lt('stock_qty', 5),
    sb.from('pro_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb
      .from('orders')
      .select('id, email, total_cents, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    monthRevenueCents: (paid.data ?? []).reduce((s, o) => s + o.total_cents, 0),
    ordersToPrepare: prepare.count ?? 0,
    lowStockCount: lowStock.count ?? 0,
    pendingProCount: pendingPro.count ?? 0,
    recentOrders: (recent.data ?? []).map((o) => ({
      id: o.id,
      email: o.email,
      totalCents: o.total_cents,
      status: o.status as OrderStatus,
      createdAt: o.created_at,
    })),
  }
}
