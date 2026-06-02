import type { Metadata } from 'next'
import { getSettings } from '@/features/admin/settings'
import { getPricingContext } from '@/features/pro/context'
import { listProducts } from '@/features/catalog/queries'
import { CartView } from '@/components/shop/cart/CartView'

export const metadata: Metadata = { title: 'Mon panier' }

export default async function PanierPage() {
  const [settings, pricing, products] = await Promise.all([
    getSettings(),
    getPricingContext(),
    listProducts({ sort: 'newest' }),
  ])

  return (
    <CartView
      freeShipThresholdCents={settings.freeShippingThresholdCents}
      pricing={pricing}
      suggestions={products}
    />
  )
}
