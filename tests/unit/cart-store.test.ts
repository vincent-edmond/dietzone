import { describe, it, expect, beforeEach } from 'vitest'
import { useCart } from '@/features/cart/store'
import type { CartLine } from '@/types/domain'

const L = (variantId: string, qty: number, maxStock = 10): CartLine => ({
  variantId,
  productId: 'p',
  name: 'x',
  unitPriceCents: 1000,
  qty,
  maxStock,
})

describe('cart store', () => {
  beforeEach(() => useCart.getState().clear())

  it('ajoute une ligne et fusionne par variantId', () => {
    useCart.getState().add(L('v1', 1))
    useCart.getState().add(L('v1', 2))
    const lines = useCart.getState().lines
    expect(lines).toHaveLength(1)
    expect(lines[0].qty).toBe(3)
  })

  it('borne la quantité au stock max', () => {
    useCart.getState().add(L('v2', 1, 3))
    useCart.getState().setQty('v2', 99)
    expect(useCart.getState().lines[0].qty).toBe(3)
  })

  it('supprime une ligne', () => {
    useCart.getState().add(L('v3', 1))
    useCart.getState().remove('v3')
    expect(useCart.getState().lines.find((l) => l.variantId === 'v3')).toBeUndefined()
  })

  it('compte le nombre total d’articles', () => {
    useCart.getState().add(L('v1', 2))
    useCart.getState().add(L('v4', 3))
    expect(useCart.getState().count()).toBe(5)
  })
})
