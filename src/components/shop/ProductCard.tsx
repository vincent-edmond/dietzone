import Link from 'next/link'
import type { ProductCard as ProductCardData } from '@/features/catalog/queries'
import { formatEuros } from '@/lib/money'
import { displayPriceCents, PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'

export function ProductCard({
  p,
  pricing = PUBLIC_PRICING,
}: {
  p: ProductCardData
  pricing?: PricingContext
}) {
  const shown = displayPriceCents(p.fromPriceCents, pricing)
  const discounted = pricing.isPro && shown < p.fromPriceCents

  return (
    <Link
      href={`/produit/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
    >
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
        ) : (
          <span className="font-heading text-6xl font-extrabold text-neutral-300">
            {p.name.charAt(0)}
          </span>
        )}
        {!p.inStock && (
          <span className="absolute left-2 top-2 rounded bg-neutral-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Rupture
          </span>
        )}
        {discounted && (
          <span className="absolute right-2 top-2 rounded bg-[#0A2540] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Prix PRO
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {p.brand && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {p.brand}
          </span>
        )}
        <span className="line-clamp-2 text-sm font-semibold text-neutral-900">{p.name}</span>
        <span className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-xl font-extrabold text-neutral-900">
            <span className="text-xs font-medium text-neutral-400">dès </span>
            {formatEuros(shown)}
          </span>
          {discounted && (
            <span className="text-xs text-neutral-400 line-through">
              {formatEuros(p.fromPriceCents)}
            </span>
          )}
        </span>
      </div>
    </Link>
  )
}
