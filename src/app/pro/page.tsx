import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { demoImages } from '@/lib/demoImages'

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
    <main>
      {/* Hero PRO — sombre avec image */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${demoImages.cta})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/85" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
            Espace partenaires
          </span>
          <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-tight sm:text-6xl">
            Devenez partenaire <span className="text-primary">PRO</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
            Coach, salle de sport, revendeur ? Accédez à des tarifs professionnels et commandez en
            ligne auprès de DietZone, votre expert en nutrition sportive à La Réunion.
          </p>
          <div className="mt-8">
            <Link
              href="/pro/demande"
              className={`${buttonVariants({ size: 'lg' })} h-14 px-8 text-base font-bold uppercase tracking-wide`}
            >
              Faire une demande
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {AVANTAGES.map((a) => (
            <div
              key={a.t}
              className="rounded-xl border-2 border-neutral-200 p-6 transition hover:border-primary"
            >
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-neutral-900">
                {a.t}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{a.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
