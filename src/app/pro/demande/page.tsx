import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/features/account/auth'
import { ProApplicationForm } from '@/components/pro/ProApplicationForm'

export const metadata: Metadata = { title: 'Demande PRO' }

export default async function ProDemandePage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Demande d’accès PRO</h1>

      {!user ? (
        <div className="mt-6 rounded-lg border border-neutral-200 p-5 text-sm">
          <p className="text-neutral-700">
            Pour faire une demande PRO, vous devez d’abord avoir un compte.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/connexion" className="text-red-600 hover:underline">
              Se connecter
            </Link>
            <Link href="/inscription" className="text-red-600 hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>
      ) : user.role === 'pro' ? (
        <p className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Vous êtes déjà partenaire PRO. Vos tarifs préférentiels sont actifs.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-neutral-500">
            Remplissez ce formulaire ; Alexandre validera votre accès.
          </p>
          <div className="mt-6">
            <ProApplicationForm defaultContactName={user.fullName ?? ''} />
          </div>
        </>
      )}
    </main>
  )
}
