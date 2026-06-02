import { applyProDiscount, htCentsFromTtc } from '@/lib/money'

export interface PricingContext {
  /** PRO approuvé : prix remisés appliqués au paiement. */
  isPro: boolean
  proPercent: number
  /** Demande PRO en attente : voit l'offre PRO mais ne peut pas encore commander. */
  isPendingPro?: boolean
}

export const PUBLIC_PRICING: PricingContext = { isPro: false, proPercent: 0, isPendingPro: false }

/** Prix à afficher selon le contexte : public, ou remisé pour un client PRO. */
export function displayPriceCents(publicCents: number, ctx: PricingContext): number {
  return ctx.isPro ? applyProDiscount(publicCents, ctx.proPercent) : publicCents
}

/** L'utilisateur voit-il l'offre PRO (PRO approuvé OU demande en attente) ? */
export function showsProOffer(ctx: PricingContext): boolean {
  return Boolean(ctx.isPro || ctx.isPendingPro)
}

/** Peut-il ajouter au panier ? (Un PRO en attente ne peut pas tant qu'il n'est pas validé.) */
export function canAddToCart(ctx: PricingContext): boolean {
  return !ctx.isPendingPro
}

export interface PriceSet {
  publicTtcCents: number
  publicHtCents: number
  /** Prix PRO remisé en HT (l'offre mise en avant). */
  proHtCents: number
  /** Prix PRO remisé en TTC (ce que le PRO paie réellement). */
  proTtcCents: number
}

/** Calcule les 3 prix (public TTC, public HT, PRO HT) pour un montant TTC + taux de TVA. */
export function computePriceSet(ttcCents: number, vatRate: number, ctx: PricingContext): PriceSet {
  const proTtcCents = applyProDiscount(ttcCents, ctx.proPercent)
  return {
    publicTtcCents: ttcCents,
    publicHtCents: htCentsFromTtc(ttcCents, vatRate),
    proTtcCents,
    proHtCents: htCentsFromTtc(proTtcCents, vatRate),
  }
}
