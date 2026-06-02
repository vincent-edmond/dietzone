import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Espace PRO',
  description:
    'Coachs, salles de sport, revendeurs : bénéficiez de tarifs professionnels chez DietZone.',
}

const AVANTAGES = [
  { t: 'Tarifs professionnels', d: 'Des prix remisés sur tout le catalogue, réservés aux partenaires.' },
  { t: 'Commande en ligne', d: 'Commandez 24/7, suivez vos commandes depuis votre compte.' },
  { t: 'Interlocuteur dédié', d: 'Alexandre, expert en nutrition sportive, vous accompagne.' },
  { t: 'Marques premium', d: 'Gaspari, Cellucor, NPL et plus, en stock à La Réunion.' },
]

export default function ProLandingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-[#0A2540] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Espace partenaires
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
          Devenez partenaire <span className="text-red-600">PRO</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
          Coach, salle de sport, revendeur ? Accédez à des tarifs professionnels et commandez en
          ligne auprès de DietZone, votre expert en nutrition sportive à La Réunion.
        </p>
        <div className="mt-8">
          <Link href="/pro/demande" className={buttonVariants({ size: 'lg' })}>
            Faire une demande
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {AVANTAGES.map((a) => (
          <div key={a.t} className="rounded-lg border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900">{a.t}</h3>
            <p className="mt-1 text-sm text-neutral-600">{a.d}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
