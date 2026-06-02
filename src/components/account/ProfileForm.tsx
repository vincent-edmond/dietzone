'use client'

import { useActionState } from 'react'
import { updateProfile, type AuthState } from '@/features/account/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ProfileForm({
  fullName,
  phone,
}: {
  fullName: string | null
  phone: string | null
}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(updateProfile, {})
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nom complet
        </label>
        <Input id="full_name" name="full_name" type="text" defaultValue={fullName ?? ''} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium">
          Téléphone
        </label>
        <Input id="phone" name="phone" type="tel" defaultValue={phone ?? ''} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-green-600">{state.message}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
