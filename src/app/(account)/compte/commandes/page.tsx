import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/features/account/auth'
import { listMyOrders, ORDER_STATUS_LABELS } from '@/features/account/orders'
import { formatEuros } from '@/lib/money'

export const metadata: Metadata = { title: 'Mes commandes' }

export default async function MesCommandesPage() {
  await requireUser()
  const orders = await listMyOrders()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/compte" className="hover:underline">
          Mon compte
        </Link>
        <span> / Mes commandes</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight">Mes commandes</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-neutral-500">Vous n’avez pas encore de commande.</p>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2">Date</th>
              <th className="py-2">Mode</th>
              <th className="py-2">Statut</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100">
                <td className="py-2">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="py-2">{o.fulfillment === 'pickup' ? 'Retrait' : 'Livraison'}</td>
                <td className="py-2">{ORDER_STATUS_LABELS[o.status]}</td>
                <td className="py-2 text-right font-semibold">{formatEuros(o.totalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
