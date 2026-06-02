import Link from 'next/link'
import { Truck, Store, ShieldCheck, MessageCircle } from 'lucide-react'
import { listProducts } from '@/features/catalog/queries'
import { getPricingContext } from '@/features/pro/context'
import { listBrands } from '@/features/catalog/taxonomy'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ObjectiveTiles } from '@/components/shop/home/ObjectiveTiles'
import { buttonVariants } from '@/components/ui/button'

const REASSURANCE = [
  { icon: Truck, t: 'Livraison sur toute l’île', d: 'Réunion 974, rapide' },
  { icon: Store, t: 'Retrait magasin', d: 'St-Denis, gratuit' },
  { icon: ShieldCheck, t: 'Paiement sécurisé', d: 'Carte bancaire' },
  { icon: MessageCircle, t: 'Conseils d’expert', d: 'Assistant & magasin' },
]

export default async function HomePage() {
  const [products, pricing, brands] = await Promise.all([
    listProducts({ sort: 'newest' }),
    getPricingContext(),
    listBrands(),
  ])
  const bestSellers = products.slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Nutrition sportive · La Réunion
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Atteignez vos objectifs avec les meilleures marques
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Protéines, créatine, pre-workout et plus — sélectionnés par Alexandre, votre expert à
            St-Denis. Livraison sur l’île ou retrait en magasin.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/boutique" className={buttonVariants({ size: 'lg' })}>
              Découvrir la boutique
            </Link>
            <Link
              href="/pro"
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
            >
              Espace PRO
            </Link>
          </div>
        </div>
      </section>

      {/* Objectifs */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight">Achetez par objectif</h2>
        <div className="mt-6">
          <ObjectiveTiles />
        </div>
      </section>

      {/* Best-sellers */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Nos produits</h2>
          <Link href="/boutique" className="text-sm font-medium text-primary hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={bestSellers} pricing={pricing} />
        </div>
      </section>

      {/* Marques */}
      {brands.length > 0 && (
        <section className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-8">
            {brands.map((b) => (
              <span key={b.slug} className="text-lg font-bold uppercase tracking-wide text-neutral-400">
                {b.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Réassurance */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {REASSURANCE.map((r) => (
            <div key={r.t} className="flex flex-col items-center text-center">
              <r.icon className="h-8 w-8 text-primary" />
              <p className="mt-2 font-semibold text-neutral-900">{r.t}</p>
              <p className="text-sm text-neutral-500">{r.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
