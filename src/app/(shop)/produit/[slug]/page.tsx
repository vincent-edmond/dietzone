import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductBySlug } from '@/features/catalog/queries'
import { VariantPicker } from '@/components/shop/VariantPicker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) return { title: 'Produit introuvable' }
  return {
    title: p.name,
    description: p.description?.slice(0, 160) || `${p.name} — nutrition sportive chez DietZone.`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/boutique" className="hover:underline">
          Boutique
        </Link>
        <span> / {p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
          {p.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain p-6" />
          ) : (
            <span className="text-6xl font-bold text-neutral-300">{p.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {p.brand && (
            <span className="text-sm uppercase tracking-wide text-neutral-500">{p.brand}</span>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{p.name}</h1>

          {p.objectives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.objectives.map((o) => (
                <span
                  key={o}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  {o}
                </span>
              ))}
            </div>
          )}

          <VariantPicker
            productId={p.id}
            productName={p.name}
            image={p.images[0]}
            variants={p.variants}
          />

          {p.description && (
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <h2 className="text-sm font-semibold text-neutral-900">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
