import { applyProDiscount, htCentsFromTtc } from '@/lib/money'

export interface PricingContext {
  /** PRO approuvé et actif : prix remisés appliqués au paiement. */
  isPro: boolean
  proPercent: number
  /** Demande PRO en attente : voit l'offre PRO mais ne peut pas encore commander. */
  isPendingPro?: boolean
  /** PRO suspendu par l'admin : voit l'offre PRO mais commande désactivée. */
  proSuspended?: boolean
  /** Quantité minimale à commander par produit (10 par défaut pour un PRO actif, sinon 1). */
  minQtyPerItem?: number
}

export const PUBLIC_PRICING: PricingContext = {
  isPro: false,
  proPercent: 0,
  isPendingPro: false,
  proSuspended: false,
  minQtyPerItem: 1,
}

/** Quantité minimale de commande applicable (>= 1). */
export function minQty(ctx: PricingContext): number {
  return Math.max(1, ctx.minQtyPerItem ?? 1)
}

/** Prix à afficher selon le contexte : public, ou remisé pour un client PRO. */
export function displayPriceCents(publicCents: number, ctx: PricingContext): number {
  return ctx.isPro ? applyProDiscount(publicCents, ctx.proPercent) : publicCents
}

/** L'utilisateur voit-il l'offre PRO (PRO actif, en attente, ou suspendu) ? */
export function showsProOffer(ctx: PricingContext): boolean {
  return Boolean(ctx.isPro || ctx.isPendingPro || ctx.proSuspended)
}

/** Peut-il ajouter au panier ? (Bloqué si demande en attente ou compte suspendu.) */
export function canAddToCart(ctx: PricingContext): boolean {
  return !ctx.isPendingPro && !ctx.proSuspended
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
