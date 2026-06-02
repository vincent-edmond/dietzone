import type { Metadata } from 'next'
import { SignupForm } from '@/components/account/SignupForm'

export const metadata: Metadata = { title: 'Inscription' }

export default function InscriptionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-extrabold uppercase tracking-tight">
        Créer un compte
      </h1>
      <SignupForm />
    </main>
  )
}
