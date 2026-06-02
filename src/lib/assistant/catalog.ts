export interface LLMVariant {
  label: string
  priceCents: number
  stock: number
}

export interface LLMProduct {
  name: string
  brand: string | null
  category: string | null
  variants: LLMVariant[]
}

/** Formate le catalogue en texte compact pour le contexte de l'assistant IA. */
export function formatCatalog(products: LLMProduct[]): string {
  return products
    .map((p) => {
      const vs = p.variants
        .map(
          (v) =>
            `${v.label} ${(v.priceCents / 100).toFixed(2)}€ (${
              v.stock > 0 ? `stock: ${v.stock}` : 'RUPTURE'
            })`,
        )
        .join(', ')
      const brand = p.brand ? ` [${p.brand}]` : ''
      const cat = p.category ? ` · ${p.category}` : ''
      return `- ${p.name}${brand}${cat} : ${vs}`
    })
    .join('\n')
}
