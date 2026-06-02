import { Suspense } from 'react'
import type { Metadata } from 'next'
import { listProducts, type CatalogSort } from '@/features/catalog/queries'
import { listCategories, listBrands, listObjectives } from '@/features/catalog/taxonomy'
import { getPricingContext } from '@/features/pro/context'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Filters } from '@/components/shop/Filters'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Tous nos produits de nutrition sportive : protéines, créatine, pre-workout, acides aminés.',
}

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const get = (k: string): string | undefined => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }
  const [products, categories, brands, objectives, pricing] = await Promise.all([
    listProducts({
      categorySlug: get('categorie'),
      brandSlug: get('marque'),
      objectiveSlug: get('objectif'),
      search: get('q'),
      sort: (get('tri') as CatalogSort) ?? 'newest',
    }),
    listCategories(),
    listBrands(),
    listObjectives(),
    getPricingContext(),
  ])

  return (
    <main>
      {/* Bannière */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_0%_0%,rgba(225,29,42,0.4),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">Boutique</h1>
          <p className="mt-1 text-sm text-neutral-400">{products.length} produit(s) disponibles</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Suspense>
          <Filters categories={categories} brands={brands} objectives={objectives} />
        </Suspense>

        <div className="mt-8">
          <ProductGrid products={products} pricing={pricing} />
        </div>
      </div>
    </main>
  )
}
