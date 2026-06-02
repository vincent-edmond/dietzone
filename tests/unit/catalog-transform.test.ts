import { describe, it, expect } from 'vitest'
import { toProductCard } from '@/features/catalog/transform'

describe('toProductCard', () => {
  it('mappe une ligne produit en ProductCard (prix mini, en stock)', () => {
    const row = {
      id: 'p1',
      name: 'SuperPump Max',
      slug: 'superpump-max',
      images: ['/img/spm.jpg'],
      brands: { name: 'Gaspari' },
      product_variants: [
        { price_cents: 4900, stock_qty: 15, is_active: true },
        { price_cents: 3900, stock_qty: 0, is_active: true },
      ],
    }
    expect(toProductCard(row)).toEqual({
      id: 'p1',
      name: 'SuperPump Max',
      slug: 'superpump-max',
      brand: 'Gaspari',
      image: '/img/spm.jpg',
      fromPriceCents: 3900,
      inStock: true,
    })
  })

  it('marque hors stock si toutes les variantes sont à 0', () => {
    const row = {
      id: 'p2',
      name: 'X',
      slug: 'x',
      images: [],
      brands: null,
      product_variants: [{ price_cents: 1000, stock_qty: 0, is_active: true }],
    }
    const card = toProductCard(row)
    expect(card.inStock).toBe(false)
    expect(card.brand).toBeNull()
    expect(card.image).toBeNull()
  })
})
