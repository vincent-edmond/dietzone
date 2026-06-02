import Link from 'next/link'
import type { ProductCard as ProductCardData } from '@/features/catalog/queries'
import { formatEuros } from '@/lib/money'
import {
  computePriceSet,
  showsProOffer,
  PUBLIC_PRICING,
  type PricingContext,
} from '@/features/pro/pricing'

export function ProductCard({
  p,
  pricing = PUBLIC_PRICING,
}: {
  p: ProductCardData
  pricing?: PricingContext
}) {
  const showPro = showsProOffer(pricing)
  const prices = computePriceSet(p.fromPriceCents, p.vatRate, pricing)

  return (
    <Link
      href={`/produit/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
    >
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
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
        {showPro && (
          <span className="absolute right-2 top-2 rounded bg-navy px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
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
        {showPro ? (
          <span className="mt-auto flex flex-col pt-2">
            <span className="text-[11px] text-neutral-400">
              dès {formatEuros(prices.publicTtcCents)} TTC
            </span>
            <span className="text-lg font-extrabold text-navy">
              {formatEuros(prices.proHtCents)}
              <span className="ml-1 text-[11px] font-bold">HT PRO</span>
            </span>
          </span>
        ) : (
          <span className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="text-xl font-extrabold text-neutral-900">
              <span className="text-xs font-medium text-neutral-400">dès </span>
              {formatEuros(prices.publicTtcCents)}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
