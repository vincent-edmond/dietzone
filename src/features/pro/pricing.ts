import { applyProDiscount } from '@/lib/money'

export interface PricingContext {
  isPro: boolean
  proPercent: number
}

export const PUBLIC_PRICING: PricingContext = { isPro: false, proPercent: 0 }

/** Prix à afficher selon le contexte : public, ou remisé pour un client PRO. */
export function displayPriceCents(publicCents: number, ctx: PricingContext): number {
  return ctx.isPro ? applyProDiscount(publicCents, ctx.proPercent) : publicCents
}
