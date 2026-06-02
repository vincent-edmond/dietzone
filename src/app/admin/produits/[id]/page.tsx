import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { VariantManager } from '@/components/admin/VariantManager'
import { getAdminProduct } from '@/features/admin/products'
import { adminBrands, adminCategories, adminObjectives } from '@/features/admin/taxonomy'

export const metadata: Metadata = { title: 'Éditer le produit' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, brands, categories, objectives] = await Promise.all([
    getAdminProduct(id),
    adminBrands(),
    adminCategories(),
    adminObjectives(),
  ])
  if (!product) notFound()

  return (
    <div>
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/admin/produits" className="hover:underline">
          Produits
        </Link>
        <span> / {product.name}</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Informations</h2>
        <ProductForm
          product={product}
          brands={brands}
          categories={categories}
          objectives={objectives}
        />
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-6">
        <h2 className="mb-3 text-lg font-semibold">Variantes &amp; stock</h2>
        <VariantManager productId={product.id} variants={product.variants} />
      </section>
    </div>
  )
}
