import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/features/account/auth'
import { getPricingContext } from '@/features/pro/context'
import { ProfileForm } from '@/components/account/ProfileForm'
import { SignOutButton } from '@/components/account/SignOutButton'

export const metadata: Metadata = { title: 'Mon compte' }

export default async function ComptePage() {
  const user = await requireUser()
  const pricing = await getPricingContext()

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mon compte</h1>
        <SignOutButton />
      </div>
      <p className="mt-1 text-sm text-neutral-500">{user.email}</p>

      {user.role === 'pro' && (
        <p className="mt-3 inline-block rounded-full bg-[#0A2540] px-3 py-1 text-xs font-semibold text-white">
          Compte PRO · tarifs préférentiels actifs
        </p>
      )}

      {pricing.isPendingPro && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Demande PRO en cours de validation</p>
          <p className="mt-1 text-amber-700">
            Vous pouvez déjà parcourir la boutique et consulter vos tarifs PRO (HT remisés). La
            commande sera débloquée dès qu’Alexandre aura validé votre accès.
          </p>
        </div>
      )}

      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="mt-4 flex items-center justify-between rounded-xl bg-neutral-950 px-5 py-4 text-white transition hover:bg-neutral-800"
        >
          <span>
            <span className="block text-sm font-bold uppercase tracking-wide">
              Tableau de bord admin
            </span>
            <span className="text-xs text-neutral-400">
              Produits, stock, commandes, demandes PRO, réglages
            </span>
          </span>
          <span className="text-xl">→</span>
        </Link>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Mes informations</h2>
        <ProfileForm fullName={user.fullName} phone={user.phone} />
      </section>

      <nav className="mt-8 flex flex-wrap gap-4 border-t border-neutral-200 pt-6 text-sm">
        <Link href="/compte/commandes" className="text-red-600 hover:underline">
          Mes commandes
        </Link>
        {user.role !== 'pro' &&
          (pricing.isPendingPro ? (
            <span className="text-amber-700">Demande PRO en attente</span>
          ) : (
            <Link href="/pro" className="text-red-600 hover:underline">
              Devenir partenaire PRO
            </Link>
          ))}
        <Link href="/boutique" className="text-neutral-600 hover:underline">
          Continuer mes achats
        </Link>
      </nav>
    </main>
  )
}
