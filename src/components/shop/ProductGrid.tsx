import type { ProductCard as ProductCardData } from '@/features/catalog/queries'
import { ProductCard } from './ProductCard'
import { PUBLIC_PRICING, type PricingContext } from '@/features/pro/pricing'

export function ProductGrid({
  products,
  pricing = PUBLIC_PRICING,
}: {
  products: ProductCardData[]
  pricing?: PricingContext
}) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-neutral-500">Aucun produit trouvé.</p>
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} pricing={pricing} />
      ))}
    </div>
  )
}
