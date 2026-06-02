'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/money'
import type { ProductVariantView } from '@/features/catalog/queries'
import { useCart } from '@/features/cart/store'
import { displayPriceCents, PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'

export function VariantPicker({
  productId,
  productName,
  image,
  variants,
  pricing = PUBLIC_PRICING,
}: {
  productId: string
  productName: string
  image?: string | null
  variants: ProductVariantView[]
  pricing?: PricingContext
}) {
  const add = useCart((s) => s.add)
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const [added, setAdded] = useState(false)
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]

  if (!selected) {
    return <p className="text-neutral-500">Aucune variante disponible.</p>
  }

  const outOfStock = selected.stock <= 0
  const shownCents = displayPriceCents(selected.priceCents, pricing)
  const discounted = pricing.isPro && shownCents < selected.priceCents

  function handleAdd() {
    if (!selected || outOfStock) return
    add({
      variantId: selected.id,
      productId,
      name: `${productName} · ${selected.label}`,
      unitPriceCents: selected.priceCents,
      qty: 1,
      image: image ?? undefined,
      maxStock: selected.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

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
        <span className="text-2xl font-bold">{formatEuros(shownCents)}</span>
        {discounted && (
          <span className="text-sm text-neutral-400 line-through">
            {formatEuros(selected.priceCents)}
          </span>
        )}
        {discounted && (
          <span className="rounded bg-[#0A2540] px-2 py-0.5 text-xs font-bold text-white">
            PRO
          </span>
        )}
        <span className={`text-sm ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
          {outOfStock ? 'En rupture' : 'En stock'}
        </span>
      </div>

      <Button
        size="lg"
        disabled={outOfStock}
        onClick={handleAdd}
        data-testid="add-to-cart"
        aria-label={`Ajouter au panier ${productName}`}
      >
        {added ? 'Ajouté ✓' : 'Ajouter au panier'}
      </Button>
    </div>
  )
}
