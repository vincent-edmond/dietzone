import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: 'Conditions Générales de Vente de DietZone.',
}

export default function CgvPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Conditions Générales de Vente</h1>
      <p className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
        Modèle à compléter avec le contenu juridique définitif (DOM / La Réunion) avant la mise en
        production.
      </p>
      <div className="mt-6 space-y-5 text-sm text-neutral-700">
        <p>
          <strong>1. Objet :</strong> Les présentes CGV régissent les ventes de produits réalisées
          sur le site DietZone.
        </p>
        <p>
          <strong>2. Prix :</strong> Les prix sont indiqués en euros, toutes taxes comprises (TVA
          applicable à La Réunion). DietZone se réserve le droit de modifier ses prix à tout moment.
        </p>
        <p>
          <strong>3. Commande :</strong> Toute commande vaut acceptation des présentes CGV. Un email
          de confirmation est envoyé après validation.
        </p>
        <p>
          <strong>4. Paiement :</strong> Par carte bancaire (paiement sécurisé) ou sur place lors du
          retrait en magasin.
        </p>
        <p>
          <strong>5. Livraison :</strong> Voir la page « Livraison &amp; retours ».
        </p>
        <p>
          <strong>6. Rétractation :</strong> Dans les conditions prévues par la loi, hors produits
          descellés pour raisons d’hygiène.
        </p>
        <p>
          <strong>7. Coordonnées :</strong> DietZone, St-Denis, La Réunion. [SIRET, raison sociale et
          mentions légales complètes à insérer.]
        </p>
      </div>
    </main>
  )
}
