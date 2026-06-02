'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '@/features/cart/store'
import { useHydrated } from '@/features/cart/useHydrated'

const LINKS = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/boutique?objectif=prise-de-masse', label: 'Prise de masse' },
  { href: '/boutique?objectif=seche', label: 'Sèche' },
  { href: '/pro', label: 'Espace PRO' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const count = useCart((s) => s.count())
  const hydrated = useHydrated()

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight" aria-label="Accueil DietZone">
          DIET<span className="text-primary">ZONE</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/compte"
            className="flex h-11 w-11 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
            aria-label="Mon compte"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/panier"
            className="relative flex h-11 w-11 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
            aria-label="Panier"
          >
            <ShoppingCart className="h-5 w-5" />
            {hydrated && count > 0 && (
              <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-neutral-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
