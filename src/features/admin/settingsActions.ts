'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/features/account/auth'
import { eurosToCents } from '@/lib/money'

export interface SettingsState {
  error?: string
  message?: string
}

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireRole('admin')
  const proPct = Math.max(0, Math.min(90, Math.round(Number(formData.get('pro_discount_percent') ?? 0))))
  const proMinQty = Math.max(1, Math.min(1000, Math.round(Number(formData.get('pro_min_qty_per_item') ?? 1))))
  const freeShip = eurosToCents(Number(formData.get('free_shipping_threshold') ?? 0))
  const shipFee = eurosToCents(Number(formData.get('shipping_fee') ?? 0))

  const sb = await createClient()
  const { error } = await sb
    .from('settings')
    .update({
      pro_discount_percent: proPct,
      pro_min_qty_per_item: proMinQty,
      free_shipping_threshold_cents: freeShip,
      shipping_fee_cents: shipFee,
      store_name: String(formData.get('store_name') ?? '').trim(),
      store_address: String(formData.get('store_address') ?? '').trim(),
      store_phone: String(formData.get('store_phone') ?? '').trim(),
      store_hours: String(formData.get('store_hours') ?? '').trim(),
      whatsapp_number: String(formData.get('whatsapp_number') ?? '').trim(),
    })
    .eq('id', true)
  if (error) return { error: 'Échec de la mise à jour des réglages.' }

  revalidatePath('/admin/reglages')
  return { message: 'Réglages enregistrés.' }
}
