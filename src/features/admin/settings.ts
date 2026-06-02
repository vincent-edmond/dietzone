import { createClient } from '@/lib/supabase/server'

export interface StoreSettings {
  proDiscountPercent: number
  proMinQtyPerItem: number
  freeShippingThresholdCents: number
  shippingFeeCents: number
  storeName: string
  storeAddress: string
  storePhone: string
  storeHours: string
  whatsappNumber: string
}

const DEFAULTS: StoreSettings = {
  proDiscountPercent: 20,
  proMinQtyPerItem: 10,
  freeShippingThresholdCents: 4499,
  shippingFeeCents: 500,
  storeName: 'DietZone',
  storeAddress: '6b rue Léopauld Rambaud, St-Denis, La Réunion',
  storePhone: '0692 78 35 08',
  storeHours: '11H - 18H, Lundi au Vendredi',
  whatsappNumber: '',
}

export async function getSettings(): Promise<StoreSettings> {
  const sb = await createClient()
  const { data } = await sb
    .from('settings')
    .select(
      'pro_discount_percent, pro_min_qty_per_item, free_shipping_threshold_cents, shipping_fee_cents, store_name, store_address, store_phone, store_hours, whatsapp_number',
    )
    .eq('id', true)
    .maybeSingle()
  if (!data) return DEFAULTS
  return {
    proDiscountPercent: data.pro_discount_percent,
    proMinQtyPerItem: data.pro_min_qty_per_item ?? 10,
    freeShippingThresholdCents: data.free_shipping_threshold_cents,
    shippingFeeCents: data.shipping_fee_cents,
    storeName: data.store_name,
    storeAddress: data.store_address,
    storePhone: data.store_phone,
    storeHours: data.store_hours,
    whatsappNumber: data.whatsapp_number,
  }
}
