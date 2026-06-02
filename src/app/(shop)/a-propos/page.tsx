import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'DietZone, magasin expert en nutrition sportive à St-Denis (La Réunion), dirigé par Alexandre Payet.',
}

export default function AProposPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">À propos de DietZone</h1>
      <div className="mt-6 space-y-4 text-neutral-700">
        <p>
          DietZone est un magasin spécialisé en <strong>nutrition sportive</strong> situé à
          St-Denis, à La Réunion. Dirigé par <strong>Alexandre Payet</strong>, expert passionné,
          DietZone sélectionne les meilleures marques (Gaspari, Cellucor, NPL…) pour accompagner
          les sportifs de l’île, du débutant au pratiquant confirmé.
        </p>
        <p>
          Notre objectif : vous proposer des produits authentiques et efficaces, avec de vrais
          conseils d’expert — en magasin comme en ligne. Commandez sur le site pour une livraison
          rapide sur toute l’île, ou récupérez votre commande directement en boutique.
        </p>
        <p>
          Vous êtes coach, salle de sport ou revendeur ? Découvrez notre{' '}
          <a href="/pro" className="text-primary hover:underline">
            espace PRO
          </a>{' '}
          et ses tarifs dédiés.
        </p>
      </div>
    </main>
  )
}
