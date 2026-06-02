import type { OrderStatus } from '@/types/domain'
import { ORDER_STATUS_LABELS } from '@/features/account/orders'

const COLORS: Record<OrderStatus, string> = {
  pending: 'bg-neutral-100 text-neutral-600',
  to_pay_pickup: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  preparing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  picked_up: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
