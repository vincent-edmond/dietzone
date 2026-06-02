import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireRole } from '@/features/account/auth'
import { SignOutButton } from '@/components/account/SignOutButton'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('admin')

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white p-4">
        <Link href="/" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dietzone.png" alt="DietZone" className="h-10 w-auto" />
          <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-neutral-400">
            Administration
          </span>
        </Link>

        <AdminNav />

        <div className="mt-auto border-t border-neutral-200 pt-4">
          <p className="mb-2 truncate text-xs text-neutral-400">{user.email}</p>
          <Link
            href="/"
            className="mb-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="h-3 w-3" /> Retour au site
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
