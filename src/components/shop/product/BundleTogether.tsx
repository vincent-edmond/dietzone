'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/money'
import { useCart } from '@/features/cart/store'
import {
  displayPriceCents,
  canAddToCart,
  PUBLIC_PRICING,
  type PricingContext,
} from '@/features/pro/pricing'

export interface BundleItem {
  variantId: string
  productId: string
  name: string
  brand?: string | null
  image?: string | null
  priceCents: number
  stock: number
  slug: string
  isMain?: boolean
}

export function BundleTogether({
  items,
  pricing = PUBLIC_PRICING,
}: {
  items: BundleItem[]
  pricing?: PricingContext
}) {
  const add = useCart((s) => s.add)
  const buyable = items.filter((it) => it.stock > 0)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(buyable.map((it) => it.variantId)),
  )
  const [done, setDone] = useState(false)
  const purchasable = canAddToCart(pricing)

  if (buyable.length < 2) return null

  function toggle(it: BundleItem) {
    if (it.isMain) return // l'article courant reste toujours sélectionné
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(it.variantId)) next.delete(it.variantId)
      else next.add(it.variantId)
      return next
    })
  }

  const chosen = buyable.filter((it) => selected.has(it.variantId))
  const totalCents = chosen.reduce((s, it) => s + displayPriceCents(it.priceCents, pricing), 0)

  function addAll() {
    chosen.forEach((it) => {
      add({
        variantId: it.variantId,
        productId: it.productId,
        name: it.name,
        unitPriceCents: it.priceCents,
        qty: 1,
        image: it.image ?? undefined,
        maxStock: it.stock,
      })
    })
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded bg-gradient-to-b from-primary to-royal" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          Fréquemment achetés ensemble
        </h2>
      </div>

      {/* Visuels + / = */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {buyable.map((it, i) => (
          <div key={it.variantId} className="flex items-center gap-3">
            <Link
              href={`/produit/${it.slug}`}
              className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-white transition ${
                selected.has(it.variantId)
                  ? 'border-royal ring-2 ring-royal/30'
                  : 'border-neutral-200 opacity-50'
              }`}
              title={it.name}
            >
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-heading text-3xl font-extrabold text-neutral-300">
                  {it.name.charAt(0)}
                </span>
              )}
            </Link>
            {i < buyable.length - 1 && (
              <Plus className="h-5 w-5 shrink-0 text-neutral-400" />
            )}
          </div>
        ))}
        <span className="ml-1 hidden text-2xl font-extrabold text-neutral-300 sm:inline">=</span>
        <div className="ml-auto text-right sm:ml-2">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Total sélection</p>
          <p className="text-2xl font-extrabold text-neutral-900">{formatEuros(totalCents)}</p>
        </div>
      </div>

      {/* Cases à cocher */}
      <ul className="mt-5 space-y-2">
        {buyable.map((it) => {
          const unit = displayPriceCents(it.priceCents, pricing)
          const checked = selected.has(it.variantId)
          return (
            <li key={it.variantId}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition ${
                  checked ? 'border-neutral-300 bg-white' : 'border-transparent'
                } ${it.isMain ? 'cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={it.isMain}
                  onChange={() => toggle(it)}
                  className="h-4 w-4 accent-royal"
                />
                <span className="flex-1 text-sm">
                  <span className="font-semibold text-neutral-900">
                    {it.isMain ? 'Cet article : ' : ''}
                    {it.name}
                  </span>
                  {it.brand && <span className="text-neutral-400"> · {it.brand}</span>}
                </span>
                <span className="text-sm font-bold tabular-nums text-neutral-900">
                  {formatEuros(unit)}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <Button
        size="lg"
        onClick={addAll}
        disabled={chosen.length === 0 || !purchasable}
        className="mt-5 h-12 w-full text-base font-bold uppercase tracking-wide sm:w-auto"
      >
        {!purchasable ? (
          'PRO en attente de validation'
        ) : done ? (
          <>
            <Check className="h-5 w-5" /> Ajouté au panier
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" /> Ajouter la sélection ({chosen.length})
          </>
        )}
      </Button>
    </section>
  )
}
