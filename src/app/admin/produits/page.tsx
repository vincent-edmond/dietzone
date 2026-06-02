import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, AlertTriangle } from 'lucide-react'
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
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight">Produits</h1>
          <p className="text-sm text-neutral-500">{products.length} produit(s)</p>
        </div>
        <Link href="/admin/produits/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" /> Nouveau produit
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Prix dès</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${p.id}`} className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </span>
                    <span>
                      <span className="block font-semibold text-neutral-900">{p.name}</span>
                      <span className="text-xs text-neutral-400">{p.brand ?? 'Sans marque'}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium">
                  {p.minPriceCents != null ? formatEuros(p.minPriceCents) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      p.totalStock < 5 ? 'text-orange-600' : 'text-neutral-700'
                    }`}
                  >
                    {p.totalStock < 5 && <AlertTriangle className="h-3.5 w-3.5" />}
                    {p.totalStock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {p.isActive ? 'Actif' : 'Masqué'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/produits/${p.id}`} className="font-medium text-primary hover:underline">
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
          <p className="px-4 py-8 text-center text-sm text-neutral-500">
            Aucun produit. Créez-en un.
          </p>
        )}
      </div>
    </div>
  )
}
