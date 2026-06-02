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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Boutique</h1>
      <p className="mt-1 text-sm text-neutral-500">{products.length} produit(s)</p>

      <div className="mt-6">
        <Suspense>
          <Filters categories={categories} brands={brands} objectives={objectives} />
        </Suspense>
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  )
}
