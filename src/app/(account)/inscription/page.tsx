import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/account/SignupForm'

export const metadata: Metadata = { title: 'Inscription' }

export default function InscriptionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="mb-8 block text-center text-2xl font-extrabold tracking-tight">
        DIET<span className="text-red-600">ZONE</span>
      </Link>
      <h1 className="mb-6 text-center text-xl font-bold">Créer un compte</h1>
      <SignupForm />
    </main>
  )
}
