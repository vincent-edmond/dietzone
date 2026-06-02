import type { Metadata } from 'next'
import { LoginForm } from '@/components/account/LoginForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function ConnexionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-extrabold uppercase tracking-tight">
        Connexion
      </h1>
      <LoginForm />
    </main>
  )
}
