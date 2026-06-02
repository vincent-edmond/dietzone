'use client'

import Link from 'next/link'
import {
  Minus,
  Plus,
  X,
  Truck,
  Store,
  ShieldCheck,
  CreditCard,
  Check,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/features/cart/store'
import { useHydrated } from '@/features/cart/useHydrated'
import { computeTotals } from '@/features/cart/totals'
import { formatEuros } from '@/lib/money'
import { displayPriceCents, PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'
import type { ProductCard } from '@/features/catalog/queries'

export function CartView({
  freeShipThresholdCents,
  pricing = PUBLIC_PRICING,
  suggestions = [],
}: {
  freeShipThresholdCents: number
  pricing?: PricingContext
  suggestions?: ProductCard[]
}) {
  const hydrated = useHydrated()
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const add = useCart((s) => s.add)

  if (!hydrated) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-neutral-500">Chargement…</main>
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingCart className="h-7 w-7 text-neutral-400" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-neutral-500">
          Trouvez la nutrition qui correspond à vos objectifs.
        </p>
        <Link
          href="/boutique"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
        >
          Découvrir la boutique
        </Link>
      </main>
    )
  }

  const totals = computeTotals(lines, {
    fulfillment: 'pickup',
    isPro: pricing.isPro,
    proPercent: pricing.proPercent,
    shippingFeeCents: 0,
    freeShipThresholdCents,
  })
  const grossCents = lines.reduce((s, l) => s + l.unitPriceCents * l.qty, 0)
  const proSavingCents = grossCents - totals.subtotalCents
  const remaining = Math.max(0, freeShipThresholdCents - totals.subtotalCents)
  const shipPct = freeShipThresholdCents
    ? Math.min(100, Math.round((totals.subtotalCents / freeShipThresholdCents) * 100))
    : 100

  const inCart = new Set(lines.map((l) => l.productId))
  const reco = suggestions
    .filter((s) => s.variantId && s.inStock && !inCart.has(s.id))
    .slice(0, 3)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">Mon panier</h1>
        <Link
          href="/boutique"
          className="hidden items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 sm:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> Continuer mes achats
        </Link>
      </div>

      {/* Barre livraison offerte — incite à compléter la commande */}
      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        {remaining > 0 ? (
          <p className="text-sm text-neutral-700">
            Plus que <strong className="text-primary">{formatEuros(remaining)}</strong> pour la{' '}
            <strong>livraison offerte</strong> sur toute l’île&nbsp;!
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
            <Check className="h-4 w-4" /> Livraison offerte débloquée&nbsp;!
          </p>
        )}
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-royal transition-all"
            style={{ width: `${shipPct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lignes */}
        <div>
          <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {lines.map((l) => {
              const unit = displayPriceCents(l.unitPriceCents, pricing)
              return (
                <li key={l.variantId} className="flex items-center gap-4 p-4">
                  <Link
                    href="/boutique"
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                  >
                    {l.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingCart className="h-6 w-6 text-neutral-300" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">{l.name}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">{formatEuros(unit)} / unité</p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-neutral-200">
                        <button
                          type="button"
                          onClick={() => setQty(l.variantId, l.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.variantId, l.qty + 1)}
                          disabled={l.qty >= l.maxStock}
                          className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.variantId)}
                        className="flex items-center gap-1 text-xs text-neutral-400 transition hover:text-primary"
                        aria-label={`Retirer ${l.name}`}
                      >
                        <X className="h-3.5 w-3.5" /> Retirer
                      </button>
                    </div>
                  </div>

                  <span className="w-20 shrink-0 text-right text-sm font-bold tabular-nums">
                    {formatEuros(unit * l.qty)}
                  </span>
                </li>
              )
            })}
          </ul>

          {/* Cross-sell — incite à acheter plus */}
          {reco.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded bg-gradient-to-b from-primary to-royal" />
                <h2 className="text-lg font-extrabold uppercase tracking-tight">
                  Complétez votre commande
                </h2>
              </div>
              <ul className="mt-4 space-y-3">
                {reco.map((s) => {
                  const unit = displayPriceCents(s.fromPriceCents, pricing)
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
                    >
                      <Link
                        href={`/produit/${s.slug}`}
                        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                      >
                        {s.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-heading text-xl font-extrabold text-neutral-300">
                            {s.name.charAt(0)}
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/produit/${s.slug}`}
                          className="block truncate text-sm font-semibold text-neutral-900 hover:underline"
                        >
                          {s.name}
                        </Link>
                        <p className="text-sm text-neutral-500">{formatEuros(unit)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          add({
                            variantId: s.variantId as string,
                            productId: s.id,
                            name: s.variantLabel ? `${s.name} · ${s.variantLabel}` : s.name,
                            unitPriceCents: s.fromPriceCents,
                            qty: 1,
                            image: s.image ?? undefined,
                            maxStock: s.stock,
                          })
                        }
                        className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md border-2 border-primary px-3 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white"
                      >
                        <Plus className="h-4 w-4" /> Ajouter
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Récap */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-bold">Récapitulatif</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Sous-total</span>
                <span className="tabular-nums">{formatEuros(grossCents)}</span>
              </div>
              {pricing.isPro && proSavingCents > 0 && (
                <div className="flex justify-between font-semibold text-navy">
                  <span>Remise PRO (-{pricing.proPercent}%)</span>
                  <span className="tabular-nums">− {formatEuros(proSavingCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Livraison</span>
                <span className="text-right text-xs text-neutral-500">
                  {remaining > 0 ? 'calculée à l’étape suivante' : 'offerte 🎉'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-neutral-200 pt-4">
              <span className="text-base font-bold">Total</span>
              <span className="text-2xl font-extrabold tabular-nums">
                {formatEuros(totals.totalCents)}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-neutral-400">Retrait magasin ou livraison</p>

            <Button size="lg" className="mt-5 h-12 w-full text-base font-bold uppercase tracking-wide" disabled>
              Passer la commande
            </Button>
            <p className="mt-2 text-center text-xs text-neutral-400">
              Le paiement (carte &amp; retrait) sera activé à l’étape suivante.
            </p>

            <ul className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Paiement 100% sécurisé
              </li>
              <li className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" /> Retrait gratuit à St-Denis
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Livraison sur toute l’île
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Produits 100% authentiques
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
