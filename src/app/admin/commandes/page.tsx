import type { Metadata } from 'next'
import Link from 'next/link'
import { listOrders } from '@/features/admin/orders'
import { ORDER_STATUS_LABELS } from '@/features/account/orders'
import { formatEuros } from '@/lib/money'

export const metadata: Metadata = { title: 'Commandes' }

export default async function AdminCommandesPage() {
  const orders = await listOrders()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">Aucune commande pour l’instant.</p>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2">Date</th>
              <th className="py-2">Client</th>
              <th className="py-2">Mode</th>
              <th className="py-2">Statut</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-2">
                  <Link href={`/admin/commandes/${o.id}`} className="text-red-600 hover:underline">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                  </Link>
                </td>
                <td className="py-2">{o.email}</td>
                <td className="py-2">{o.fulfillment === 'pickup' ? 'Retrait' : 'Livraison'}</td>
                <td className="py-2">{ORDER_STATUS_LABELS[o.status]}</td>
                <td className="py-2 text-right font-semibold">{formatEuros(o.totalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
