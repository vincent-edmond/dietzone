'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, type LucideIcon } from 'lucide-react'

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/demandes-pro', label: 'Demandes PRO', icon: Users },
  { href: '/admin/reglages', label: 'Réglages', icon: Settings },
]

export function AdminNav() {
  const path = usePathname()
  return (
    <nav className="mt-6 flex flex-col gap-1">
      {NAV.map((n) => {
        const active = n.href === '/admin' ? path === '/admin' : path.startsWith(n.href)
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
              active ? 'bg-primary text-white shadow-sm' : 'text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <n.icon className="h-4 w-4 shrink-0" />
            {n.label}
          </Link>
        )
      })}
    </nav>
  )
}
