import { describe, it, expect } from 'vitest'
import {
  formatEuros,
  eurosToCents,
  applyProDiscount,
  htCentsFromTtc,
  vatCentsFromTtc,
} from '@/lib/money'

describe('formatEuros', () => {
  it('formate des centimes en euros FR', () => {
    expect(formatEuros(6500)).toBe('65,00 €')
    expect(formatEuros(9900)).toBe('99,00 €')
    expect(formatEuros(0)).toBe('0,00 €')
  })
})

describe('eurosToCents', () => {
  it('convertit des euros en centimes entiers', () => {
    expect(eurosToCents(65)).toBe(6500)
    expect(eurosToCents(65.9)).toBe(6590)
    expect(eurosToCents(0.1)).toBe(10)
  })
})

describe('applyProDiscount', () => {
  it('applique une remise % et arrondit au centime', () => {
    expect(applyProDiscount(10000, 20)).toBe(8000)
    expect(applyProDiscount(9999, 15)).toBe(8499)
    expect(applyProDiscount(6500, 0)).toBe(6500)
  })
})

describe('TVA (HT/TVA depuis TTC)', () => {
  it('décompose un TTC en HT + TVA (taux 8,5 % Réunion)', () => {
    // 3990 TTC à 8,5 % => HT 3677, TVA 313
    expect(htCentsFromTtc(3990, 8.5)).toBe(3677)
    expect(vatCentsFromTtc(3990, 8.5)).toBe(313)
    // HT + TVA == TTC
    expect(htCentsFromTtc(3990, 8.5) + vatCentsFromTtc(3990, 8.5)).toBe(3990)
  })

  it('taux 0 % => HT == TTC et TVA == 0', () => {
    expect(htCentsFromTtc(2490, 0)).toBe(2490)
    expect(vatCentsFromTtc(2490, 0)).toBe(0)
  })
})
