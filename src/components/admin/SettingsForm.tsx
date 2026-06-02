'use client'

import { useActionState } from 'react'
import { updateSettings, type SettingsState } from '@/features/admin/settingsActions'
import type { StoreSettings } from '@/features/admin/settings'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  step,
}: {
  label: string
  name: string
  defaultValue: string | number
  type?: string
  step?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Input id={name} name={name} type={type} step={step} defaultValue={defaultValue} />
    </div>
  )
}

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(updateSettings, {})

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <Field
        label="Remise PRO (%)"
        name="pro_discount_percent"
        type="number"
        defaultValue={settings.proDiscountPercent}
      />
      <Field
        label="Seuil port offert (€)"
        name="free_shipping_threshold"
        type="number"
        step="0.01"
        defaultValue={(settings.freeShippingThresholdCents / 100).toFixed(2)}
      />
      <Field
        label="Frais de port livraison (€)"
        name="shipping_fee"
        type="number"
        step="0.01"
        defaultValue={(settings.shippingFeeCents / 100).toFixed(2)}
      />
      <Field label="Nom du magasin" name="store_name" defaultValue={settings.storeName} />
      <Field label="Adresse" name="store_address" defaultValue={settings.storeAddress} />
      <Field label="Téléphone" name="store_phone" defaultValue={settings.storePhone} />
      <Field label="Horaires" name="store_hours" defaultValue={settings.storeHours} />
      <Field
        label="Numéro WhatsApp (format international, ex. 262692…)"
        name="whatsapp_number"
        defaultValue={settings.whatsappNumber}
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-green-600">{state.message}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Enregistrement…' : 'Enregistrer les réglages'}
      </Button>
    </form>
  )
}
