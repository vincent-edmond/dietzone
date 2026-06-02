import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'
import { adminBrands, adminCategories, adminObjectives } from '@/features/admin/taxonomy'

export const metadata: Metadata = { title: 'Nouveau produit' }

export default async function NewProductPage() {
  const [brands, categories, objectives] = await Promise.all([
    adminBrands(),
    adminCategories(),
    adminObjectives(),
  ])

  return (
    <div>
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/admin/produits" className="hover:underline">
          Produits
        </Link>
        <span> / Nouveau</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight">Nouveau produit</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Créez le produit, puis ajoutez ses variantes (saveurs/tailles) à l’étape suivante.
      </p>
      <div className="mt-6">
        <ProductForm brands={brands} categories={categories} objectives={objectives} />
      </div>
    </div>
  )
}
