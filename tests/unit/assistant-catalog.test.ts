import { describe, it, expect } from 'vitest'
import { formatCatalog } from '@/lib/assistant/catalog'

describe('formatCatalog', () => {
  it('formate un produit avec prix et stock', () => {
    const out = formatCatalog([
      {
        name: 'SuperPump Max',
        brand: 'Gaspari',
        category: 'Pre-workout',
        variants: [{ label: 'Fruit Punch 480g', priceCents: 4900, stock: 15 }],
      },
    ])
    expect(out).toContain('SuperPump Max')
    expect(out).toContain('Gaspari')
    expect(out).toContain('49.00€')
    expect(out).toContain('stock: 15')
  })

  it('signale les ruptures', () => {
    const out = formatCatalog([
      { name: 'X', brand: null, category: null, variants: [{ label: 'U', priceCents: 1000, stock: 0 }] },
    ])
    expect(out).toContain('RUPTURE')
  })
})
