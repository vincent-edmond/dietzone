import Link from 'next/link'
import { requireRole } from '@/features/account/auth'
import { SignOutButton } from '@/components/account/SignOutButton'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/produits', label: 'Produits' },
  { href: '/admin/commandes', label: 'Commandes' },
  { href: '/admin/demandes-pro', label: 'Demandes PRO' },
  { href: '/admin/reglages', label: 'Réglages' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('admin')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-neutral-200 bg-neutral-50 p-4">
        <Link href="/" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dietzone.png" alt="DietZone" className="h-10 w-auto" />
          <span className="mt-1 block text-xs font-normal text-neutral-500">Administration</span>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-neutral-200 pt-4">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
