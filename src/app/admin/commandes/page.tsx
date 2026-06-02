import type { Metadata } from 'next'
import Link from 'next/link'
import { listOrders } from '@/features/admin/orders'
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatEuros } from '@/lib/money'

export const metadata: Metadata = { title: 'Commandes' }

export default async function AdminCommandesPage() {
  const orders = await listOrders()

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight">Commandes</h1>
      <p className="text-sm text-neutral-500">{orders.length} commande(s)</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-neutral-500">
            Aucune commande pour l’instant.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/commandes/${o.id}`} className="font-medium text-primary hover:underline">
                      {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">{o.fulfillment === 'pickup' ? 'Retrait' : 'Livraison'}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatEuros(o.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
