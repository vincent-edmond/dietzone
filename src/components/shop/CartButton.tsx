'use client'

import Link from 'next/link'
import { useCart } from '@/features/cart/store'
import { useHydrated } from '@/features/cart/useHydrated'

export function CartButton() {
  const count = useCart((s) => s.count())
  const hydrated = useHydrated()

  return (
    <Link
      href="/panier"
      className="relative inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900"
      aria-label="Panier"
    >
      Panier
      {hydrated && count > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
