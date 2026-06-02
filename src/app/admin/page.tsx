import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Wallet,
  ShoppingBag,
  AlertTriangle,
  Users,
  Plus,
  ListOrdered,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { getDashboardStats } from '@/features/admin/stats'
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatEuros } from '@/lib/money'

export const metadata: Metadata = { title: 'Dashboard admin' }

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tone = 'neutral',
}: {
  label: string
  value: string
  icon: LucideIcon
  href?: string
  tone?: 'neutral' | 'warn' | 'alert'
}) {
  const toneCls =
    tone === 'alert'
      ? 'bg-red-50 text-red-600'
      : tone === 'warn'
        ? 'bg-orange-50 text-orange-600'
        : 'bg-neutral-100 text-neutral-700'
  const card = (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition hover:shadow-md">
      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneCls}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-extrabold leading-none text-neutral-900">{value}</p>
        <p className="mt-1 text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  )
  return href ? <Link href={href}>{card}</Link> : card
}

const QUICK = [
  { href: '/admin/produits/new', label: 'Nouveau produit', icon: Plus },
  { href: '/admin/commandes', label: 'Commandes', icon: ListOrdered },
  { href: '/admin/reglages', label: 'Réglages', icon: Settings },
]

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CA du mois (payé)" value={formatEuros(stats.monthRevenueCents)} icon={Wallet} />
        <StatCard
          label="Commandes à traiter"
          value={String(stats.ordersToPrepare)}
          icon={ShoppingBag}
          href="/admin/commandes"
        />
        <StatCard
          label="Variantes en stock bas"
          value={String(stats.lowStockCount)}
          icon={AlertTriangle}
          href="/admin/produits"
          tone={stats.lowStockCount > 0 ? 'warn' : 'neutral'}
        />
        <StatCard
          label="Demandes PRO en attente"
          value={String(stats.pendingProCount)}
          icon={Users}
          href="/admin/demandes-pro"
          tone={stats.pendingProCount > 0 ? 'alert' : 'neutral'}
        />
      </div>

      {/* Accès rapides */}
      <div className="mt-6 flex flex-wrap gap-3">
        {QUICK.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-primary hover:text-primary"
          >
            <q.icon className="h-4 w-4" /> {q.label}
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm font-medium text-primary hover:underline">
            Toutes les commandes
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">Aucune commande pour l’instant.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">
                <th className="py-2">Date</th>
                <th className="py-2">Client</th>
                <th className="py-2">Statut</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2.5">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="py-2.5">{o.email}</td>
                  <td className="py-2.5">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="py-2.5 text-right font-semibold">{formatEuros(o.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
