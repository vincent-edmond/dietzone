import type { Metadata } from 'next'
import { MapPin, Phone, Clock } from 'lucide-react'
import { getSettings } from '@/features/admin/settings'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez DietZone à St-Denis, La Réunion : adresse, téléphone et horaires.',
}

export default async function ContactPage() {
  const s = await getSettings()
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.storeAddress)}`
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <div className="mt-6 space-y-4 text-neutral-700">
        <p className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {s.storeAddress}
          </a>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <a href={`tel:${s.storePhone.replace(/\s/g, '')}`} className="hover:underline">
            {s.storePhone}
          </a>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {s.storeHours}
        </p>
        <p className="pt-4 text-sm text-neutral-500">
          Besoin d’un conseil produit ? Utilisez l’assistant en bas à droite de l’écran : il connaît
          notre catalogue et nos disponibilités.
        </p>
      </div>
    </main>
  )
}
