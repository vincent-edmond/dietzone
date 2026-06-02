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
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center bg-neutral-50">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
        ) : (
          <span className="text-3xl font-bold text-neutral-300">{p.name.charAt(0)}</span>
        )}
        {!p.inStock && (
          <span className="absolute left-2 top-2 rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-white">
            En rupture
          </span>
        )}
        {discounted && (
          <span className="absolute right-2 top-2 rounded bg-[#0A2540] px-2 py-0.5 text-xs font-bold text-white">
            PRO
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {p.brand && <span className="text-xs uppercase tracking-wide text-neutral-500">{p.brand}</span>}
        <span className="line-clamp-2 text-sm font-medium text-neutral-900">{p.name}</span>
        <span className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-neutral-900">
            <span className="text-xs font-normal text-neutral-500">dès </span>
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
