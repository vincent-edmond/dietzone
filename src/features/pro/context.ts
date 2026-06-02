import { getCurrentUser } from '@/features/account/auth'
import { getSettings } from '@/features/admin/settings'
import { isProPricing } from '@/features/account/roles'
import { createClient } from '@/lib/supabase/server'
import type { PricingContext } from './pricing'

/** Construit le contexte de prix pour l'utilisateur courant (serveur). */
export async function getPricingContext(): Promise<PricingContext> {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()])
  if (!user) {
    return { isPro: false, proPercent: settings.proDiscountPercent, isPendingPro: false }
  }
  const isPro = isProPricing(user.role) && !user.proDisabled
  // PRO suspendu par l'admin : conserve le rôle 'pro' mais accès commande coupé.
  const proSuspended = isProPricing(user.role) && user.proDisabled
  let isPendingPro = false
  if (!isPro && !proSuspended && user.role === 'customer') {
    const sb = await createClient()
    const { data } = await sb
      .from('pro_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .limit(1)
      .maybeSingle()
    isPendingPro = Boolean(data)
  }
  return { isPro, proPercent: settings.proDiscountPercent, isPendingPro, proSuspended }
}
