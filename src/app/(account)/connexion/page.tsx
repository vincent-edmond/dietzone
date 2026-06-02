import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/account/LoginForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function ConnexionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dietzone.png" alt="DietZone" className="h-14 w-auto" />
      </Link>
      <h1 className="mb-6 text-center text-xl font-bold">Connexion</h1>
      <LoginForm />
    </main>
  )
}
