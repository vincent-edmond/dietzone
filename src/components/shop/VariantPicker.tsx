'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/money'
import type { ProductVariantView } from '@/features/catalog/queries'

export function VariantPicker({
  productName,
  variants,
}: {
  productName: string
  variants: ProductVariantView[]
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]

  if (!selected) {
    return <p className="text-neutral-500">Aucune variante disponible.</p>
  }

  const outOfStock = selected.stock <= 0

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedId(v.id)}
              aria-pressed={v.id === selected.id}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                v.id === selected.id
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">{formatEuros(selected.priceCents)}</span>
        <span className={`text-sm ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
          {outOfStock ? 'En rupture' : 'En stock'}
        </span>
      </div>

      {/* TODO Plan 3 : brancher l'ajout au panier (store Zustand). */}
      <Button
        size="lg"
        disabled={outOfStock}
        data-testid="add-to-cart"
        data-variant-id={selected.id}
        aria-label={`Ajouter au panier ${productName}`}
      >
        Ajouter au panier
      </Button>
    </div>
  )
}
