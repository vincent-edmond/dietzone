import { Award, BadgeCheck, MessageCircle, ShieldCheck } from 'lucide-react'

const BENEFITS = [
  { icon: Award, t: 'Qualité premium', d: 'Marques officielles sélectionnées' },
  { icon: BadgeCheck, t: 'Produits authentiques', d: '100 % traçables' },
  { icon: ShieldCheck, t: 'Conforme', d: 'Normes de sécurité respectées' },
  { icon: MessageCircle, t: 'Conseils d’expert', d: 'Assistant & magasin' },
]

export function Benefits() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-4 sm:grid-cols-4">
      {BENEFITS.map((b) => (
        <div key={b.t} className="flex flex-col items-center gap-1 text-center">
          <b.icon className="h-6 w-6 text-primary" />
          <p className="text-sm font-bold">{b.t}</p>
          <p className="text-xs text-neutral-500">{b.d}</p>
        </div>
      ))}
    </div>
  )
}
