import type { Metadata } from 'next'
import {
  listPendingApplications,
  approveApplication,
  rejectApplication,
} from '@/features/admin/proApplications'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Demandes PRO' }

export default async function DemandesProPage() {
  const apps = await listPendingApplications()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Demandes PRO</h1>
      <p className="mt-1 text-sm text-neutral-500">{apps.length} demande(s) en attente</p>

      {apps.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">Aucune demande en attente.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {apps.map((a) => (
            <li key={a.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="text-base font-semibold">{a.companyName}</p>
                  {a.activityType && (
                    <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
                      {a.activityType}
                    </span>
                  )}
                  <dl className="mt-2 grid gap-x-6 gap-y-1 text-neutral-600 sm:grid-cols-2">
                    {a.contactName && (
                      <p>
                        <span className="text-neutral-400">Contact :</span> {a.contactName}
                      </p>
                    )}
                    <p>
                      <span className="text-neutral-400">Email :</span> {a.email}
                    </p>
                    {a.phone && (
                      <p>
                        <span className="text-neutral-400">Tél :</span>{' '}
                        <a href={`tel:${a.phone}`} className="text-primary hover:underline">
                          {a.phone}
                        </a>
                      </p>
                    )}
                    {a.siret && (
                      <p>
                        <span className="text-neutral-400">SIRET :</span> {a.siret}
                      </p>
                    )}
                    {a.website && (
                      <p className="sm:col-span-2">
                        <span className="text-neutral-400">Web :</span> {a.website}
                      </p>
                    )}
                  </dl>
                  {a.message && <p className="mt-2 text-neutral-700">{a.message}</p>}
                </div>
                <div className="flex gap-2">
                  <form action={approveApplication.bind(null, a.id)}>
                    <Button type="submit" size="sm">
                      Approuver
                    </Button>
                  </form>
                  <form action={rejectApplication.bind(null, a.id)}>
                    <Button type="submit" size="sm" variant="outline">
                      Refuser
                    </Button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
