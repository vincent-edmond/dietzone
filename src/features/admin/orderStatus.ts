import type { OrderStatus } from '@/types/domain'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  to_pay_pickup: ['paid', 'cancelled'],
  paid: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['shipped', 'picked_up', 'cancelled'],
  shipped: ['picked_up'],
  picked_up: [],
  cancelled: [],
}

export function nextStatuses(from: OrderStatus): OrderStatus[] {
  return TRANSITIONS[from]
}

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to)
}
