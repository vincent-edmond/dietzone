'use client'

import Link from 'next/link'
import { useCart } from '@/features/cart/store'
import { useHydrated } from '@/features/cart/useHydrated'
import { computeTotals } from '@/features/cart/totals'
import { formatEuros } from '@/lib/money'
import { Button } from '@/components/ui/button'

export default function PanierPage() {
  const hydrated = useHydrated()
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)

  if (!hydrated) {
    return <main className="mx-auto max-w-3xl px-4 py-12 text-neutral-500">Chargement…</main>
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Votre panier est vide</h1>
        <Link href="/boutique" className="mt-4 inline-block text-red-600 hover:underline">
          Découvrir la boutique
        </Link>
      </main>
    )
  }

  // Mode retrait par défaut sur la page panier → port 0. Le mode de livraison
  // et les prix pro sont déterminés au checkout (Plan 3 paiement / Plan 4 PRO).
  const totals = computeTotals(lines, {
    fulfillment: 'pickup',
    isPro: false,
    proPercent: 0,
    shippingFeeCents: 0,
    freeShipThresholdCents: 0,
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Mon panier</h1>

      <ul className="mt-6 divide-y divide-neutral-200">
        {lines.map((l) => (
          <li key={l.variantId} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{l.name}</p>
              <p className="text-sm text-neutral-500">{formatEuros(l.unitPriceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`qty-${l.variantId}`}>
                Quantité
              </label>
              <input
                id={`qty-${l.variantId}`}
                type="number"
                min={1}
                max={l.maxStock}
                value={l.qty}
                onChange={(e) => setQty(l.variantId, Number(e.target.value))}
                className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm"
              />
              <span className="w-20 text-right text-sm font-semibold">
                {formatEuros(l.unitPriceCents * l.qty)}
              </span>
              <button
                type="button"
                onClick={() => remove(l.variantId)}
                className="text-sm text-neutral-400 hover:text-red-600"
                aria-label={`Retirer ${l.name}`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-neutral-200 pt-4">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Sous-total</span>
          <span>{formatEuros(totals.subtotalCents)}</span>
        </div>
        <div className="mt-2 flex justify-between text-lg font-bold">
          <span>Total (retrait magasin)</span>
          <span>{formatEuros(totals.totalCents)}</span>
        </div>
      </div>

      <div className="mt-6">
        <Button size="lg" className="w-full" disabled>
          Passer la commande
        </Button>
        <p className="mt-2 text-center text-xs text-neutral-400">
          Le paiement (carte &amp; retrait) sera activé à l’étape suivante.
        </p>
      </div>
    </main>
  )
}
