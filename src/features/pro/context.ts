import { getCurrentUser } from '@/features/account/auth'
import { getSettings } from '@/features/admin/settings'
import { isProPricing } from '@/features/account/roles'
import type { PricingContext } from './pricing'

/** Construit le contexte de prix pour l'utilisateur courant (serveur). */
export async function getPricingContext(): Promise<PricingContext> {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()])
  return {
    isPro: user ? isProPricing(user.role) : false,
    proPercent: settings.proDiscountPercent,
  }
}
