'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Truck, Zap, Store } from 'lucide-react'

const MESSAGES = [
  { icon: Truck, text: 'Livraison offerte dès 44,99 € sur toute l’île', cta: 'J’en profite', href: '/boutique' },
  { icon: Zap, text: 'Coachs & salles : -20 % avec l’Espace PRO', cta: 'Devenir PRO', href: '/pro' },
  { icon: Store, text: 'Retrait gratuit en magasin à St-Denis', cta: 'Voir la boutique', href: '/boutique' },
]

export function HelloBar() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 4500)
    return () => clearInterval(t)
  }, [])

  const m = MESSAGES[i]
  const Icon = m.icon

  return (
    <div className="relative z-50 overflow-hidden bg-gradient-to-r from-primary via-red-600 to-red-700 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        <span key={i} className="flex animate-in items-center gap-2 fade-in slide-in-from-bottom-1 duration-500">
          <Icon className="h-4 w-4 shrink-0" />
          <span>{m.text}</span>
          <Link
            href={m.href}
            className="ml-1 hidden whitespace-nowrap rounded-full bg-white/20 px-3 py-0.5 font-bold uppercase tracking-wide backdrop-blur transition hover:bg-white hover:text-primary sm:inline-block"
          >
            {m.cta}
          </Link>
        </span>
      </div>
    </div>
  )
}
