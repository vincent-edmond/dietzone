import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Livraison & retours',
  description: 'Modalités de livraison à La Réunion, retrait magasin et conditions de retour.',
}

export default function LivraisonRetoursPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Livraison &amp; retours</h1>
      <div className="mt-6 space-y-6 text-neutral-700">
        <section>
          <h2 className="font-semibold text-neutral-900">Livraison à La Réunion</h2>
          <p className="mt-1">
            Nous livrons sur toute l’île (974). Les frais de port sont calculés au paiement et
            offerts au-delà d’un certain montant. Vous recevez un email de confirmation dès votre
            commande validée.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-neutral-900">Retrait en magasin</h2>
          <p className="mt-1">
            Choisissez le retrait au moment du paiement, puis venez récupérer votre commande à
            St-Denis aux horaires d’ouverture. Le retrait est gratuit.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-neutral-900">Retours</h2>
          <p className="mt-1">
            Conformément à la réglementation, vous disposez d’un délai de rétractation pour les
            produits non ouverts et non descellés. Contactez-nous pour organiser un retour.
          </p>
        </section>
      </div>
    </main>
  )
}
