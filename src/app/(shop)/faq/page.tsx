import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Questions fréquentes : livraison, retrait magasin, paiement, retours.',
}

const FAQ = [
  {
    q: 'Livrez-vous partout à La Réunion ?',
    a: 'Oui, nous livrons sur toute l’île (974). Les frais et délais sont indiqués au moment du paiement.',
  },
  {
    q: 'Puis-je retirer ma commande en magasin ?',
    a: 'Oui. Choisissez « Retrait magasin » au paiement, puis venez récupérer votre commande à St-Denis. C’est gratuit.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'La carte bancaire (paiement sécurisé) en ligne, et le paiement sur place pour les retraits en magasin.',
  },
  {
    q: 'Dois-je créer un compte pour commander ?',
    a: 'Non, vous pouvez commander en tant qu’invité. La création de compte (optionnelle) vous permet de suivre vos commandes.',
  },
  {
    q: 'Comment obtenir les tarifs PRO ?',
    a: 'Faites une demande depuis l’espace PRO. Après validation par Alexandre, vos tarifs préférentiels s’appliquent automatiquement.',
  },
]

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Questions fréquentes</h1>
      <dl className="mt-8 space-y-6">
        {FAQ.map((item) => (
          <div key={item.q}>
            <dt className="font-semibold text-neutral-900">{item.q}</dt>
            <dd className="mt-1 text-neutral-700">{item.a}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
