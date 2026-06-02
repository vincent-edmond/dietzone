import type { CartLine } from '@/types/domain'
import { applyProDiscount } from '@/lib/money'

export interface TotalsCtx {
  fulfillment: 'delivery' | 'pickup'
  isPro: boolean
  proPercent: number
  shippingFeeCents: number
  freeShipThresholdCents: number
}

export interface Totals {
  subtotalCents: number
  shippingCents: number
  totalCents: number
}

export function computeTotals(lines: CartLine[], ctx: TotalsCtx): Totals {
  const gross = lines.reduce((s, l) => s + l.unitPriceCents * l.qty, 0)
  const subtotalCents = ctx.isPro ? applyProDiscount(gross, ctx.proPercent) : gross
  let shippingCents = 0
  if (ctx.fulfillment === 'delivery' && subtotalCents < ctx.freeShipThresholdCents) {
    shippingCents = ctx.shippingFeeCents
  }
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents }
}
