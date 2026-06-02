import { describe, it, expect } from 'vitest'
import { requireEnv } from '@/lib/supabase/env'

describe('requireEnv', () => {
  it('renvoie la valeur si présente', () => {
    process.env.TEST_X = 'abc'
    expect(requireEnv('TEST_X')).toBe('abc')
  })
  it('jette si absente', () => {
    delete process.env.TEST_Y
    expect(() => requireEnv('TEST_Y')).toThrow(/TEST_Y/)
  })
})
