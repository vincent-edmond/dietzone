import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireRole } from '@/features/account/auth'
import { SignOutButton } from '@/components/account/SignOutButton'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('admin')

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-neutral-200 bg-white p-4 md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 md:block">
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dietzone.png" alt="DietZone" className="h-10 w-auto" />
            <span className="mt-1 hidden text-xs font-bold uppercase tracking-wide text-neutral-400 md:block">
              Administration
            </span>
          </Link>
          {/* Accès compacts sur mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
            >
              <ArrowLeft className="h-3 w-3" /> Site
            </Link>
            <SignOutButton />
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto hidden border-t border-neutral-200 pt-4 md:block">
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
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  )
}
