'use client'

import { useState } from 'react'
import { Minus, Plus, ShieldCheck, Truck, Store, CreditCard, Check, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/money'
import type { ProductVariantView } from '@/features/catalog/queries'
import { useCart } from '@/features/cart/store'
import { displayPriceCents, PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'

export function BuyBox({
  productId,
  productName,
  image,
  variants,
  pricing = PUBLIC_PRICING,
  freeShipThresholdCents,
}: {
  productId: string
  productName: string
  image?: string | null
  variants: ProductVariantView[]
  pricing?: PricingContext
  freeShipThresholdCents: number
}) {
  const add = useCart((s) => s.add)
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]

  if (!selected) return <p className="text-neutral-500">Aucune variante disponible.</p>

  const outOfStock = selected.stock <= 0
  const lowStock = !outOfStock && selected.stock <= 5
  const unit = displayPriceCents(selected.priceCents, pricing)
  const discounted = pricing.isPro && unit < selected.priceCents
  const lineTotal = unit * qty
  const remaining = Math.max(0, freeShipThresholdCents - lineTotal)
  const shipPct = Math.min(100, Math.round((lineTotal / freeShipThresholdCents) * 100))

  function handleAdd() {
    if (outOfStock) return
    add({
      variantId: selected.id,
      productId,
      name: `${productName} — ${selected.label}`,
      unitPriceCents: selected.priceCents,
      qty,
      image: image ?? undefined,
      maxStock: selected.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Variantes */}
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedId(v.id)}
              aria-pressed={v.id === selected.id}
              className={`rounded-md border-2 px-4 py-2 text-sm font-semibold transition ${
                v.id === selected.id
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Prix */}
      <div className="flex items-end gap-3">
        <span className="text-4xl font-extrabold text-neutral-900">{formatEuros(unit)}</span>
        {discounted && (
          <span className="mb-1 text-lg text-neutral-400 line-through">
            {formatEuros(selected.priceCents)}
          </span>
        )}
        {discounted && (
          <span className="mb-1.5 rounded bg-[#0A2540] px-2 py-0.5 text-xs font-bold uppercase text-white">
            Prix PRO
          </span>
        )}
        <span className="mb-2 text-xs text-neutral-400">TTC</span>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 text-sm">
        {outOfStock ? (
          <span className="font-semibold text-red-600">En rupture de stock</span>
        ) : lowStock ? (
          <span className="flex items-center gap-1 font-semibold text-orange-600">
            <Flame className="h-4 w-4" /> Plus que {selected.stock} en stock — dépêche-toi !
          </span>
        ) : (
          <span className="flex items-center gap-1 font-semibold text-green-600">
            <Check className="h-4 w-4" /> En stock, expédié sous 24-48h
          </span>
        )}
      </div>

      {/* Quantité + Ajouter */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-md border-2 border-neutral-200">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-12 w-11 items-center justify-center text-neutral-600 hover:bg-neutral-100"
            aria-label="Diminuer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(selected.stock || 99, q + 1))}
            className="flex h-12 w-11 items-center justify-center text-neutral-600 hover:bg-neutral-100"
            aria-label="Augmenter"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAdd}
          data-testid="add-to-cart"
          className="h-12 flex-1 text-base font-bold uppercase tracking-wide"
        >
          {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </Button>
      </div>

      {/* Barre livraison offerte */}
      {!outOfStock && (
        <div className="rounded-lg bg-neutral-100 p-3">
          {remaining > 0 ? (
            <p className="text-sm text-neutral-700">
              Plus que <strong>{formatEuros(remaining)}</strong> pour la{' '}
              <strong>livraison offerte</strong> !
            </p>
          ) : (
            <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
              <Check className="h-4 w-4" /> Vous bénéficiez de la livraison offerte !
            </p>
          )}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${shipPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Réassurance */}
      <ul className="grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
        <li className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" /> Livraison sur toute l’île
        </li>
        <li className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" /> Retrait gratuit St-Denis
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Produits authentiques
        </li>
        <li className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" /> Paiement sécurisé
        </li>
      </ul>
    </div>
  )
}
