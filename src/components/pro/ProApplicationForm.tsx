'use client'

import { useActionState } from 'react'
import { submitProApplication, type ProFormState } from '@/features/pro/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ProApplicationForm() {
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
      <div className="flex flex-col gap-1">
        <label htmlFor="company_name" className="text-sm font-medium">
          Nom de l’entreprise *
        </label>
        <Input id="company_name" name="company_name" required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="siret" className="text-sm font-medium">
          SIRET
        </label>
        <Input id="siret" name="siret" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium">
          Téléphone
        </label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          Votre activité (coach, salle, revendeur…)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Envoi…' : 'Envoyer ma demande'}
      </Button>
    </form>
  )
}
