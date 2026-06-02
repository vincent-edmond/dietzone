import type { Metadata } from 'next'
import { getSettings } from '@/features/admin/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const metadata: Metadata = { title: 'Réglages' }

export default async function ReglagesPage() {
  const settings = await getSettings()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Réglages</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Remise PRO, frais de port et coordonnées du magasin.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}
