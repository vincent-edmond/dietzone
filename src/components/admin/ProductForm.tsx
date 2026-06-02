'use client'

import { useActionState } from 'react'
import { saveProduct, type ProductFormState, type AdminProductDetail } from '@/features/admin/products'
import type { IdName } from '@/features/admin/taxonomy'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const selectClass = 'rounded-md border border-neutral-300 px-3 py-2 text-sm'

export function ProductForm({
  product,
  brands,
  categories,
  objectives,
}: {
  product?: AdminProductDetail | null
  brands: IdName[]
  categories: IdName[]
  objectives: IdName[]
}) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, {})

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nom *
        </label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug (laisser vide = auto)
        </label>
        <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="auto depuis le nom" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className={selectClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="brand_id" className="text-sm font-medium">
            Marque
          </label>
          <select id="brand_id" name="brand_id" defaultValue={product?.brandId ?? ''} className={selectClass}>
            <option value="">Aucune</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category_id" className="text-sm font-medium">
            Catégorie
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.categoryId ?? ''}
            className={selectClass}
          >
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Objectifs</legend>
        <div className="flex flex-wrap gap-3">
          {objectives.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="objectives"
                value={o.id}
                defaultChecked={product?.objectiveIds.includes(o.id)}
              />
              {o.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={product?.isActive ?? true} />
        Produit actif (visible en boutique)
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
