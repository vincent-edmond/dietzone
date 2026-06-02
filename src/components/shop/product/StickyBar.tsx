'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/money'
import type { ProductVariantView } from '@/features/catalog/queries'
import { useCart } from '@/features/cart/store'
import { displayPriceCents, PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'

export function StickyBar({
  productId,
  productName,
  image,
  variants,
  pricing = PUBLIC_PRICING,
}: {
  productId: string
  productName: string
  image?: string | null
  variants: ProductVariantView[]
  pricing?: PricingContext
}) {
  const add = useCart((s) => s.add)
  const [visible, setVisible] = useState(false)
  const v = variants.find((x) => x.stock > 0) ?? variants[0]

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!v) return null
  const unit = displayPriceCents(v.priceCents, pricing)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-10 w-10 rounded object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded bg-neutral-100 font-heading font-bold text-neutral-400">
              {productName.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{productName}</p>
            <p className="text-sm font-extrabold">{formatEuros(unit)}</p>
          </div>
        </div>
        <Button
          onClick={() =>
            add({
              variantId: v.id,
              productId,
              name: `${productName} — ${v.label}`,
              unitPriceCents: v.priceCents,
              qty: 1,
              image: image ?? undefined,
              maxStock: v.stock,
            })
          }
          disabled={v.stock <= 0}
          className="shrink-0 font-bold uppercase tracking-wide"
        >
          Ajouter
        </Button>
      </div>
    </div>
  )
}
