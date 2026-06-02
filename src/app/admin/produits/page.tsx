import type { Metadata } from 'next'
import Link from 'next/link'
import { listAdminProducts } from '@/features/admin/products'
import { formatEuros } from '@/lib/money'
import { buttonVariants } from '@/components/ui/button'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export const metadata: Metadata = { title: 'Produits' }

export default async function AdminProduitsPage() {
  const products = await listAdminProducts()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
        <Link href="/admin/produits/new" className={buttonVariants({ size: 'sm' })}>
          Nouveau produit
        </Link>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2">Nom</th>
            <th className="py-2">Marque</th>
            <th className="py-2">Prix dès</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Statut</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-neutral-100">
              <td className="py-2 font-medium">{p.name}</td>
              <td className="py-2 text-neutral-600">{p.brand ?? '—'}</td>
              <td className="py-2">{p.minPriceCents != null ? formatEuros(p.minPriceCents) : '—'}</td>
              <td className="py-2">{p.totalStock}</td>
              <td className="py-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {p.isActive ? 'Actif' : 'Masqué'}
                </span>
              </td>
              <td className="py-2">
                <div className="flex items-center justify-end gap-4">
                  <Link href={`/admin/produits/${p.id}`} className="text-red-600 hover:underline">
                    Éditer
                  </Link>
                  <DeleteProductButton id={p.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="mt-6 text-sm text-neutral-500">Aucun produit. Créez-en un.</p>
      )}
    </div>
  )
}
