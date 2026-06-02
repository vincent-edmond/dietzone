import { describe, it, expect } from 'vitest'
import { hasRoleAccess, isProPricing } from '@/features/account/roles'

describe('hasRoleAccess', () => {
  it('admin accède à tout', () => {
    expect(hasRoleAccess('admin', 'admin')).toBe(true)
    expect(hasRoleAccess('admin', 'pro')).toBe(true)
    expect(hasRoleAccess('admin', 'customer')).toBe(true)
  })
  it('pro accède à pro et customer mais pas admin', () => {
    expect(hasRoleAccess('pro', 'pro')).toBe(true)
    expect(hasRoleAccess('pro', 'customer')).toBe(true)
    expect(hasRoleAccess('pro', 'admin')).toBe(false)
  })
  it('customer n’accède qu’à customer', () => {
    expect(hasRoleAccess('customer', 'customer')).toBe(true)
    expect(hasRoleAccess('customer', 'pro')).toBe(false)
    expect(hasRoleAccess('customer', 'admin')).toBe(false)
  })
})

describe('isProPricing', () => {
  it('seul le rôle pro bénéficie des prix pro', () => {
    expect(isProPricing('pro')).toBe(true)
    expect(isProPricing('customer')).toBe(false)
    expect(isProPricing('admin')).toBe(false)
  })
})
