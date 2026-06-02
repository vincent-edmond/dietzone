import Link from 'next/link'
import { TrendingUp, Flame, Zap, HeartPulse, type LucideIcon } from 'lucide-react'

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
          className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-primary group-hover:text-white">
            <o.icon className="h-6 w-6" />
          </span>
          <div>
            <span className="block text-lg font-extrabold uppercase tracking-tight text-neutral-900">
              {o.label}
            </span>
            <span className="mt-1 block text-sm text-neutral-500">{o.desc}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
