import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listAdminProducts } from '@/features/admin/products'
import { buttonVariants } from '@/components/ui/button'
import { ProductRow } from '@/components/admin/ProductRow'

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

      <p className="mt-3 text-xs text-neutral-400">
        Astuce : modifiez le prix TTC et le taux de TVA directement dans le tableau, et cliquez sur
        le badge pour activer / masquer un produit. HT et TVA sont calculés automatiquement.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-right">Montant HT</th>
              <th className="px-4 py-3 text-right">TVA</th>
              <th className="px-4 py-3 text-right">Prix TTC</th>
              <th className="px-4 py-3 text-center">Taux TVA</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-center">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductRow key={p.id} product={p} />
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
