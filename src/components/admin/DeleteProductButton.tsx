'use client'

import { deleteProduct } from '@/features/admin/products'

export function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm('Supprimer ce produit ? Cette action est irréversible.')) e.preventDefault()
      }}
    >
      <button type="submit" className="text-sm text-neutral-400 hover:text-red-600">
        Supprimer
      </button>
    </form>
  )
}
