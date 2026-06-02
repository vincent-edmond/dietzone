import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site DietZone.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Mentions légales</h1>
      <p className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
        Modèle à compléter avec les informations légales définitives avant la mise en production.
      </p>
      <div className="mt-6 space-y-5 text-sm text-neutral-700">
        <p>
          <strong>Éditeur —</strong> DietZone — [Raison sociale, statut juridique]. Adresse :
          St-Denis, La Réunion. SIRET : [à compléter].
        </p>
        <p>
          <strong>Directeur de la publication —</strong> Alexandre Payet.
        </p>
        <p>
          <strong>Hébergement —</strong> Vercel Inc. / Supabase. [Coordonnées complètes à insérer.]
        </p>
        <p>
          <strong>Propriété intellectuelle —</strong> L’ensemble des contenus du site est protégé.
          Toute reproduction non autorisée est interdite.
        </p>
        <p>
          <strong>Données personnelles —</strong> Les données collectées sont utilisées uniquement
          pour le traitement des commandes, conformément au RGPD.
        </p>
      </div>
    </main>
  )
}
