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
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-extrabold uppercase tracking-tight text-white">
            DIET<span className="text-primary">ZONE</span>
          </p>
          <p className="mt-3 text-sm text-neutral-400">
            Expert en nutrition sportive à La Réunion. Les meilleures marques, en magasin et en
            ligne.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Magasin
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" /> {s.storeAddress}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" /> {s.storePhone}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-primary" /> {s.storeHours}
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Infos
          </p>
          <nav className="grid grid-cols-2 gap-2 text-sm">
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="text-neutral-400 transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-neutral-500">
        © 2026 {s.storeName} — Tous droits réservés.
      </div>
    </footer>
  )
}
