import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/account/SignupForm'

export const metadata: Metadata = { title: 'Inscription' }

export default function InscriptionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dietzone.png" alt="DietZone" className="h-14 w-auto" />
      </Link>
      <h1 className="mb-6 text-center text-xl font-bold">Créer un compte</h1>
      <SignupForm />
    </main>
  )
}
