import { describe, it, expect } from 'vitest'
import { isValidTransition, nextStatuses } from '@/features/admin/orderStatus'

describe('isValidTransition', () => {
  it('autorise les transitions logiques', () => {
    expect(isValidTransition('to_pay_pickup', 'paid')).toBe(true)
    expect(isValidTransition('paid', 'preparing')).toBe(true)
    expect(isValidTransition('preparing', 'ready')).toBe(true)
    expect(isValidTransition('ready', 'picked_up')).toBe(true)
    expect(isValidTransition('ready', 'shipped')).toBe(true)
  })
  it('refuse les transitions incohérentes', () => {
    expect(isValidTransition('pending', 'ready')).toBe(false)
    expect(isValidTransition('picked_up', 'preparing')).toBe(false)
    expect(isValidTransition('cancelled', 'paid')).toBe(false)
  })
  it('les statuts terminaux n’ont pas de suite', () => {
    expect(nextStatuses('picked_up')).toEqual([])
    expect(nextStatuses('cancelled')).toEqual([])
  })
})
