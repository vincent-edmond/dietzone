import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardStats } from '@/features/admin/stats'
import { ORDER_STATUS_LABELS } from '@/features/account/orders'
import { formatEuros } from '@/lib/money'

export const metadata: Metadata = { title: 'Dashboard admin' }

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-red-600' : 'text-neutral-900'}`}>
        {value}
      </p>
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CA du mois (payé)" value={formatEuros(stats.monthRevenueCents)} />
        <StatCard label="Commandes à traiter" value={String(stats.ordersToPrepare)} />
        <StatCard label="Variantes en stock bas" value={String(stats.lowStockCount)} accent={stats.lowStockCount > 0} />
        <StatCard label="Demandes PRO en attente" value={String(stats.pendingProCount)} accent={stats.pendingProCount > 0} />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-red-600 hover:underline">
            Toutes les commandes
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">Aucune commande pour l’instant.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-2">Date</th>
                <th className="py-2">Client</th>
                <th className="py-2">Statut</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-100">
                  <td className="py-2">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="py-2">{o.email}</td>
                  <td className="py-2">{ORDER_STATUS_LABELS[o.status]}</td>
                  <td className="py-2 text-right font-semibold">{formatEuros(o.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
