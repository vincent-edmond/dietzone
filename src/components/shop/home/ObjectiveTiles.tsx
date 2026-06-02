import Link from 'next/link'
import { TrendingUp, Flame, Zap, HeartPulse, type LucideIcon } from 'lucide-react'
import { demoImages } from '@/lib/demoImages'

const OBJECTIVES: { slug: string; label: string; desc: string; icon: LucideIcon }[] = [
  { slug: 'prise-de-masse', label: 'Prise de masse', desc: 'Protéines, gainers, créatine', icon: TrendingUp },
  { slug: 'seche', label: 'Sèche', desc: 'Brûleurs, whey allégée', icon: Flame },
  { slug: 'energie', label: 'Énergie', desc: 'Pre-workout, boosters', icon: Zap },
  { slug: 'sante', label: 'Santé', desc: 'Vitamines, bien-être', icon: HeartPulse },
]

export function ObjectiveTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {OBJECTIVES.map((o) => (
        <Link
          key={o.slug}
          href={`/boutique?objectif=${o.slug}`}
          className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${demoImages.objectives[o.slug]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent transition-colors group-hover:from-primary/90" />
          <div className="relative p-5">
            <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur">
              <o.icon className="h-5 w-5" />
            </span>
            <span className="block text-lg font-extrabold uppercase tracking-tight text-white">
              {o.label}
            </span>
            <span className="mt-0.5 block text-xs text-neutral-300">{o.desc}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
