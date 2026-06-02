import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('met en minuscules et remplace les espaces', () => {
    expect(slugify('Whey Core Protein')).toBe('whey-core-protein')
  })
  it('retire les accents et la ponctuation', () => {
    expect(slugify('Crème Brûlée 5KG!')).toBe('creme-brulee-5kg')
  })
  it('nettoie les tirets en trop', () => {
    expect(slugify('  --SuperPump   Max-- ')).toBe('superpump-max')
  })
})
