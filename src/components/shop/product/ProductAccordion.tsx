import { ChevronDown } from 'lucide-react'

function Item({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-neutral-200 py-2">
      <summary className="flex cursor-pointer items-center justify-between py-3 text-base font-bold uppercase tracking-tight">
        {title}
        <ChevronDown className="h-5 w-5 text-neutral-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-neutral-600">{children}</div>
    </details>
  )
}

export function ProductAccordion({ description }: { description: string }) {
  return (
    <div>
      <Item title="Description" open>
        {description || 'Produit de nutrition sportive de qualité, sélectionné par DietZone.'}
      </Item>
      <Item title="Conseils d’utilisation">
        Respectez les doses recommandées sur l’emballage. Pour un conseil personnalisé selon votre
        objectif, utilisez notre assistant ou passez en magasin à St-Denis.
      </Item>
      <Item title="Livraison & retours">
        Livraison sur toute La Réunion (offerte dès 44,99 €) ou retrait gratuit en magasin. Retours
        possibles sur les produits non ouverts, dans les conditions prévues par la loi.
      </Item>
    </div>
  )
}
