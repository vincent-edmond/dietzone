import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VariantPicker } from '@/components/shop/VariantPicker'

const variants = [
  { id: 'v1', label: 'Chocolat 2KG', priceCents: 4900, stock: 5 },
  { id: 'v2', label: 'Chocolat 5KG', priceCents: 9900, stock: 3 },
]

describe('VariantPicker', () => {
  it('affiche le prix de la première variante par défaut', () => {
    render(<VariantPicker productName="Whey Core" variants={variants} />)
    expect(screen.getByText('49,00 €')).toBeInTheDocument()
  })

  it('met à jour le prix quand on change de variante', () => {
    render(<VariantPicker productName="Whey Core" variants={variants} />)
    fireEvent.click(screen.getByRole('button', { name: /5KG/ }))
    expect(screen.getByText('99,00 €')).toBeInTheDocument()
  })

  it('désactive l’ajout au panier si la variante est en rupture', () => {
    render(
      <VariantPicker
        productName="X"
        variants={[{ id: 'v1', label: 'Unique', priceCents: 1000, stock: 0 }]}
      />,
    )
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeDisabled()
  })
})
