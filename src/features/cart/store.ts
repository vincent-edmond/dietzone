import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartLine } from '@/types/domain'

interface CartState {
  lines: CartLine[]
  add: (line: CartLine) => void
  remove: (variantId: string) => void
  setQty: (variantId: string, qty: number) => void
  clear: () => void
  count: () => number
}

const clamp = (qty: number, max: number) => Math.max(1, Math.min(qty, max))

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === line.variantId)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, qty: clamp(l.qty + line.qty, l.maxStock) }
                  : l,
              ),
            }
          }
          return { lines: [...state.lines, { ...line, qty: clamp(line.qty, line.maxStock) }] }
        }),
      remove: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      setQty: (variantId, qty) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.variantId === variantId ? { ...l, qty: clamp(qty, l.maxStock) } : l,
          ),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((s, l) => s + l.qty, 0),
    }),
    {
      name: 'dietzone-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)
