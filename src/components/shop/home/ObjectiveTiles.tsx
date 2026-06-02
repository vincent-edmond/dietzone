import Link from 'next/link'

const OBJECTIVES = [
  { slug: 'prise-de-masse', label: 'Prise de masse', desc: 'Protéines, gainers, créatine' },
  { slug: 'seche', label: 'Sèche', desc: 'Brûleurs, whey allégée' },
  { slug: 'energie', label: 'Énergie', desc: 'Pre-workout, boosters' },
  { slug: 'sante', label: 'Santé', desc: 'Vitamines, bien-être' },
]

export function ObjectiveTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {OBJECTIVES.map((o) => (
        <Link
          key={o.slug}
          href={`/boutique?objectif=${o.slug}`}
          className="group rounded-xl border border-neutral-200 p-5 transition hover:border-primary hover:shadow-md"
        >
          <span className="block font-bold text-neutral-900 group-hover:text-primary">
            {o.label}
          </span>
          <span className="mt-1 block text-sm text-neutral-500">{o.desc}</span>
        </Link>
      ))}
    </div>
  )
}
