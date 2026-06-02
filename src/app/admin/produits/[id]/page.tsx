import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { VariantManager } from '@/components/admin/VariantManager'
import { ImageUploader } from '@/components/admin/ImageUploader'
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
    <div className="max-w-3xl">
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/admin/produits" className="hover:underline">
          Produits
        </Link>
        <span> / {product.name}</span>
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">{product.name}</h1>
        <Link
          href={`/produit/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary"
        >
          Voir sur le site <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">Photo</h2>
          <ImageUploader productId={product.id} currentImage={product.image} />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
            Informations
          </h2>
          <ProductForm
            product={product}
            brands={brands}
            categories={categories}
            objectives={objectives}
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
            Variantes &amp; stock
          </h2>
          <VariantManager productId={product.id} variants={product.variants} />
        </section>
      </div>
    </div>
  )
}
