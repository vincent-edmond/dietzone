import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOrder, changeOrderStatus } from '@/features/admin/orders'
import { nextStatuses } from '@/features/admin/orderStatus'
import { ORDER_STATUS_LABELS } from '@/features/account/orders'
import { formatEuros } from '@/lib/money'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Détail commande' }

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  const transitions = nextStatuses(order.status)

  return (
    <div className="max-w-2xl">
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/admin/commandes" className="hover:underline">
          Commandes
        </Link>
        <span> / {order.email}</span>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight">Commande</h1>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <dt className="text-neutral-500">Date</dt>
        <dd>{new Date(order.createdAt).toLocaleString('fr-FR')}</dd>
        <dt className="text-neutral-500">Client</dt>
        <dd>
          {order.email}
          {order.isProOrder && <span className="ml-2 text-[#0A2540]">(PRO)</span>}
        </dd>
        <dt className="text-neutral-500">Mode</dt>
        <dd>{order.fulfillment === 'pickup' ? 'Retrait magasin' : 'Livraison'}</dd>
        <dt className="text-neutral-500">Paiement</dt>
        <dd>{order.paymentMethod === 'card' ? 'Carte' : 'Au retrait'}</dd>
        <dt className="text-neutral-500">Statut</dt>
        <dd className="font-medium">{ORDER_STATUS_LABELS[order.status]}</dd>
      </dl>

      <h2 className="mt-8 text-lg font-semibold">Articles</h2>
      <table className="mt-2 w-full text-sm">
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i} className="border-b border-neutral-100">
              <td className="py-2">{it.name}</td>
              <td className="py-2 text-center text-neutral-500">×{it.qty}</td>
              <td className="py-2 text-right">{formatEuros(it.unitPriceCents * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-col items-end gap-1 text-sm">
        <span className="text-neutral-500">Sous-total : {formatEuros(order.subtotalCents)}</span>
        <span className="text-neutral-500">Livraison : {formatEuros(order.shippingCents)}</span>
        <span className="text-lg font-bold">Total : {formatEuros(order.totalCents)}</span>
      </div>

      {transitions.length > 0 && (
        <form action={changeOrderStatus.bind(null, order.id)} className="mt-8 flex items-end gap-2">
          <label className="flex flex-col text-sm">
            Changer le statut
            <select
              name="status"
              defaultValue={transitions[0]}
              className="mt-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              {transitions.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Mettre à jour</Button>
        </form>
      )}
    </div>
  )
}
