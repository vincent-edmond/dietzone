'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, type AuthState } from '@/features/account/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {})
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nom complet
        </label>
        <Input id="full_name" name="full_name" type="text" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-green-600">{state.message}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Création…' : 'Créer mon compte'}
      </Button>
      <p className="text-center text-sm text-neutral-500">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-red-600 hover:underline">
          Connectez-vous
        </Link>
      </p>
    </form>
  )
}
