'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, BadgeCheck, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/features/cart/store'
import { useHydrated } from '@/features/cart/useHydrated'
import type { Role } from '@/types/domain'

type NavUser = { role: Role; email: string } | null

const BASE_LINKS = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/boutique?objectif=prise-de-masse', label: 'Prise de masse' },
  { href: '/boutique?objectif=seche', label: 'Sèche' },
]

export function Header({ user = null }: { user?: NavUser }) {
  const [open, setOpen] = useState(false)
  const count = useCart((s) => s.count())
  const hydrated = useHydrated()

  const isPro = user?.role === 'pro'
  const isAdmin = user?.role === 'admin'

  // Lien PRO contextuel : un PRO connecté va vers son espace, sinon vers la landing.
  const links = [
    ...BASE_LINKS,
    isPro
      ? { href: '/compte', label: 'Mon espace PRO' }
      : { href: '/pro', label: 'Espace PRO' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:py-2.5">
        <Link href="/" aria-label="Accueil DietZone" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dietzone.png" alt="DietZone" className="h-10 w-auto sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Badge de rôle : un acheteur PRO/Admin est clairement identifié */}
          {isPro && (
            <Link
              href="/compte"
              className="hidden items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-90 sm:inline-flex"
              title={`Connecté en PRO (${user?.email})`}
            >
              <BadgeCheck className="h-3.5 w-3.5" /> PRO
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-90 sm:inline-flex"
              title="Espace administration"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Admin
            </Link>
          )}

          <Link
            href="/compte"
            className={`flex h-11 w-11 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 ${
              isPro ? 'ring-2 ring-navy ring-offset-1' : ''
            }`}
            aria-label={user ? `Mon compte (${user.email})` : 'Mon compte'}
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
          {isPro && (
            <p className="flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wide text-navy">
              <BadgeCheck className="h-4 w-4" /> Connecté en PRO
            </p>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wide text-neutral-900"
            >
              <LayoutDashboard className="h-4 w-4" /> Espace admin
            </Link>
          )}
          {links.map((l) => (
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
