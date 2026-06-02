import { describe, it, expect } from 'vitest'
import { displayPriceCents } from '@/features/pro/pricing'

describe('displayPriceCents', () => {
  it('renvoie le prix public pour un non-pro', () => {
    expect(displayPriceCents(10000, { isPro: false, proPercent: 20 })).toBe(10000)
  })
  it('applique la remise pour un pro', () => {
    expect(displayPriceCents(10000, { isPro: true, proPercent: 20 })).toBe(8000)
  })
  it('sans remise (0%) le prix pro = public', () => {
    expect(displayPriceCents(6500, { isPro: true, proPercent: 0 })).toBe(6500)
  })
})
