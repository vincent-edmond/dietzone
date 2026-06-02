import { describe, it, expect } from 'vitest'
import { computeTotals } from '@/features/cart/totals'
import type { CartLine } from '@/types/domain'

const line = (priceCents: number, qty: number): CartLine => ({
  variantId: 'v',
  productId: 'p',
  name: 'x',
  unitPriceCents: priceCents,
  qty,
  maxStock: 99,
})

describe('computeTotals', () => {
  it('somme le sous-total au prix public', () => {
    const t = computeTotals([line(4900, 2), line(6500, 1)], {
      fulfillment: 'pickup',
      isPro: false,
      proPercent: 0,
      shippingFeeCents: 500,
      freeShipThresholdCents: 4499,
    })
    expect(t.subtotalCents).toBe(4900 * 2 + 6500)
  })

  it('applique la remise pro au sous-total', () => {
    const t = computeTotals([line(10000, 1)], {
      fulfillment: 'pickup',
      isPro: true,
      proPercent: 20,
      shippingFeeCents: 500,
      freeShipThresholdCents: 99999,
    })
    expect(t.subtotalCents).toBe(8000)
  })

  it('frais de port nuls en retrait', () => {
    const t = computeTotals([line(1000, 1)], {
      fulfillment: 'pickup',
      isPro: false,
      proPercent: 0,
      shippingFeeCents: 500,
      freeShipThresholdCents: 99999,
    })
    expect(t.shippingCents).toBe(0)
  })

  it('port offert au-delà du seuil en livraison', () => {
    const t = computeTotals([line(5000, 1)], {
      fulfillment: 'delivery',
      isPro: false,
      proPercent: 0,
      shippingFeeCents: 500,
      freeShipThresholdCents: 4499,
    })
    expect(t.shippingCents).toBe(0)
  })

  it('port facturé sous le seuil en livraison', () => {
    const t = computeTotals([line(3000, 1)], {
      fulfillment: 'delivery',
      isPro: false,
      proPercent: 0,
      shippingFeeCents: 500,
      freeShipThresholdCents: 4499,
    })
    expect(t.shippingCents).toBe(500)
    expect(t.totalCents).toBe(3500)
  })
})
