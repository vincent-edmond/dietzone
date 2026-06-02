'use client'

import { useActionState } from 'react'
import { submitProApplication, type ProFormState } from '@/features/pro/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ACTIVITIES = [
  'Coach sportif / Personal trainer',
  'Salle de sport / Box',
  'Revendeur / Boutique',
  'Diététicien(ne) / Nutritionniste',
  'Club / Association sportive',
  'Autre',
]

export function ProApplicationForm({ defaultContactName = '' }: { defaultContactName?: string }) {
  const [state, action, pending] = useActionState<ProFormState, FormData>(
    submitProApplication,
    {},
  )

  if (state.message) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        {state.message}
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <p className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
        Le compte PRO donne accès à des tarifs remisés réservés aux professionnels. Ces informations
        permettent à Alexandre de valider votre activité. (* champs obligatoires)
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="company_name" className="text-sm font-medium">
            Raison sociale / Entreprise *
          </label>
          <Input id="company_name" name="company_name" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_name" className="text-sm font-medium">
            Nom du contact *
          </label>
          <Input id="contact_name" name="contact_name" defaultValue={defaultContactName} required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="activity_type" className="text-sm font-medium">
          Type d’activité *
        </label>
        <select
          id="activity_type"
          name="activity_type"
          required
          defaultValue=""
          className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {ACTIVITIES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="siret" className="text-sm font-medium">
            N° SIRET / SIREN *
          </label>
          <Input id="siret" name="siret" inputMode="numeric" required placeholder="000 000 000 00000" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Téléphone mobile *
          </label>
          <Input id="phone" name="phone" type="tel" required placeholder="0692 …" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="website" className="text-sm font-medium">
          Site web / réseau social (facultatif)
        </label>
        <Input id="website" name="website" placeholder="https:// ou @instagram" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          Présentez votre activité (facultatif)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Ex. salle de 200 adhérents à Ste-Marie, besoin de protéines et créatine en volume…"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Envoi…' : 'Envoyer ma demande PRO'}
      </Button>
    </form>
  )
}
