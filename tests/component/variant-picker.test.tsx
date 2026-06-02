import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VariantPicker } from '@/components/shop/VariantPicker'
import { useCart } from '@/features/cart/store'

const variants = [
  { id: 'v1', label: 'Chocolat 2KG', priceCents: 4900, stock: 5 },
  { id: 'v2', label: 'Chocolat 5KG', priceCents: 9900, stock: 3 },
]

describe('VariantPicker', () => {
  beforeEach(() => useCart.getState().clear())

  it('affiche le prix de la première variante par défaut', () => {
    render(<VariantPicker productId="p1" productName="Whey Core" variants={variants} />)
    expect(screen.getByText('49,00 €')).toBeInTheDocument()
  })

  it('met à jour le prix quand on change de variante', () => {
    render(<VariantPicker productId="p1" productName="Whey Core" variants={variants} />)
    fireEvent.click(screen.getByRole('button', { name: /5KG/ }))
    expect(screen.getByText('99,00 €')).toBeInTheDocument()
  })

  it('ajoute la variante sélectionnée au panier', () => {
    render(<VariantPicker productId="p1" productName="Whey Core" variants={variants} />)
    fireEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }))
    const lines = useCart.getState().lines
    expect(lines).toHaveLength(1)
    expect(lines[0].variantId).toBe('v1')
    expect(lines[0].unitPriceCents).toBe(4900)
  })

  it('désactive l’ajout au panier si la variante est en rupture', () => {
    render(
      <VariantPicker
        productId="p2"
        productName="X"
        variants={[{ id: 'v1', label: 'Unique', priceCents: 1000, stock: 0 }]}
      />,
    )
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeDisabled()
  })
})
