import Link from 'next/link'
import { Truck, Store, ShieldCheck, Dumbbell, ArrowRight } from 'lucide-react'
import { listProducts } from '@/features/catalog/queries'
import { getPricingContext } from '@/features/pro/context'
import { listBrands } from '@/features/catalog/taxonomy'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ObjectiveTiles } from '@/components/shop/home/ObjectiveTiles'
import { Reveal } from '@/components/ui/Reveal'
import { demoImages } from '@/lib/demoImages'

const REASSURANCE = [
  { icon: Truck, t: 'Livraison île', d: 'Réunion 974' },
  { icon: Store, t: 'Retrait magasin', d: 'St-Denis, gratuit' },
  { icon: ShieldCheck, t: 'Paiement sécurisé', d: 'Carte bancaire' },
  { icon: Dumbbell, t: 'Marques premium', d: 'Gaspari, C4, NPL…' },
]

export default async function HomePage() {
  const [products, pricing, brands] = await Promise.all([
    listProducts({ sort: 'newest' }),
    getPricingContext(),
    listBrands(),
  ])
  const bestSellers = products.slice(0, 8)
  const marquee = brands.length ? [...brands, ...brands, ...brands, ...brands] : []

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${demoImages.hero})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/82" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(225,29,42,0.5),transparent_70%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl animate-in px-4 py-24 text-center fade-in slide-in-from-bottom-6 duration-1000 sm:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Nutrition sportive · La Réunion
          </p>
          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-extrabold uppercase leading-[0.88] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-8xl">
            Dépasse tes limites.
            <br />
            <span className="bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
              Performe.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-300">
            Protéines, créatine, pre-workout — les meilleures marques, sélectionnées par Alexandre,
            ton expert à St-Denis. Livraison sur l’île ou retrait magasin.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/boutique"
              className="inline-flex h-14 items-center justify-center gap-1 rounded-md bg-gradient-to-r from-primary to-red-700 px-8 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.04]"
            >
              Découvrir la boutique
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pro"
              className="inline-flex h-14 items-center justify-center rounded-md border-2 border-white/25 px-8 text-base font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white hover:text-neutral-950"
            >
              Espace PRO
            </Link>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {REASSURANCE.map((r) => (
              <div key={r.t} className="flex items-center justify-center gap-3 px-4 py-5">
                <r.icon className="h-6 w-6 shrink-0 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-wide">{r.t}</p>
                  <p className="text-xs text-neutral-400">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OBJECTIFS ===== */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end gap-3">
            <span className="h-8 w-1.5 rounded bg-primary" />
            <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Achète par objectif
            </h2>
          </div>
          <div className="mt-8">
            <ObjectiveTiles />
          </div>
        </section>
      </Reveal>

      {/* ===== PRODUITS ===== */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-3">
              <span className="h-8 w-1.5 rounded bg-primary" />
              <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                Nos produits
              </h2>
            </div>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-primary hover:underline"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={bestSellers} pricing={pricing} />
          </div>
        </section>
      </Reveal>

      {/* ===== MARQUES (marquee) ===== */}
      {brands.length > 0 && (
        <section className="overflow-hidden bg-neutral-950 py-12">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Nos marques
          </p>
          <div className="dz-marquee-group relative flex">
            <div className="dz-marquee flex shrink-0 items-center gap-4 pr-4">
              {marquee.map((b, idx) => (
                <span
                  key={`${b.slug}-${idx}`}
                  className="flex h-16 min-w-44 items-center justify-center rounded-lg bg-white/5 px-6 text-lg font-extrabold uppercase tracking-wide text-neutral-300 ring-1 ring-white/10"
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA EXPERT ===== */}
      <Reveal>
        <section className="relative overflow-hidden bg-primary text-white">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${demoImages.cta})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-primary/85" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_100%_0%,rgba(0,0,0,0.45),transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                Besoin d’un conseil ?
              </h2>
              <p className="mt-2 max-w-xl text-white/85">
                Notre assistant connaît tout le catalogue et les stocks. Ou passe en magasin parler à
                Alexandre, expert en nutrition sportive.
              </p>
            </div>
            <Link
              href="/boutique"
              className="inline-flex h-14 shrink-0 items-center justify-center gap-1 rounded-md bg-white px-8 text-base font-bold uppercase tracking-wide text-neutral-950 shadow-lg transition-transform hover:scale-[1.04]"
            >
              Commencer
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  )
}
