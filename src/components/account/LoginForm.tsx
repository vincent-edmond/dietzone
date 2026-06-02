'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn, type AuthState } from '@/features/account/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, {})
  return (
    <form action={action} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>
      <p className="text-center text-sm text-neutral-500">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-red-600 hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </form>
  )
}
