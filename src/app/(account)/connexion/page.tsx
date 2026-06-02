import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/account/LoginForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function ConnexionPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="mb-8 block text-center text-2xl font-extrabold tracking-tight">
        DIET<span className="text-red-600">ZONE</span>
      </Link>
      <h1 className="mb-6 text-center text-xl font-bold">Connexion</h1>
      <LoginForm />
    </main>
  )
}
