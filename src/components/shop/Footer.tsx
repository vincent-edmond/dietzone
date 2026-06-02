import Link from 'next/link'
import { MapPin, Phone, Clock } from 'lucide-react'
import { getSettings } from '@/features/admin/settings'

const LEGAL = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/livraison-retours', label: 'Livraison & retours' },
  { href: '/cgv', label: 'CGV' },
  { href: '/mentions-legales', label: 'Mentions légales' },
]

export async function Footer() {
  const s = await getSettings()
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold tracking-tight">
            DIET<span className="text-primary">ZONE</span>
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Expert en nutrition sportive à La Réunion.
          </p>
        </div>

        <div className="text-sm text-neutral-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" /> {s.storeAddress}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" /> {s.storePhone}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" /> {s.storeHours}
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-2 text-sm">
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="text-neutral-600 hover:text-neutral-900">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        © 2026 {s.storeName} — Tous droits réservés.
      </div>
    </footer>
  )
}
