import { addVariant, updateVariant, deleteVariant } from '@/features/admin/variants'
import type { AdminVariant } from '@/features/admin/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const field = 'rounded-md border border-neutral-300 px-2 py-1 text-sm'

export function VariantManager({
  productId,
  variants,
}: {
  productId: string
  variants: AdminVariant[]
}) {
  return (
    <div className="flex flex-col gap-4">
      {variants.length === 0 && (
        <p className="text-sm text-neutral-500">Aucune variante. Ajoutez-en une ci-dessous.</p>
      )}

      {variants.map((v) => (
        <div key={v.id} className="flex flex-wrap items-end gap-2 rounded-md border border-neutral-200 p-3">
          <form
            action={updateVariant.bind(null, v.id, productId)}
            className="flex flex-wrap items-end gap-2"
          >
            <label className="flex flex-col text-xs text-neutral-500">
              Libellé
              <input name="label" defaultValue={v.label} className={field} required />
            </label>
            <label className="flex flex-col text-xs text-neutral-500">
              SKU
              <input name="sku" defaultValue={v.sku ?? ''} className={`${field} w-28`} />
            </label>
            <label className="flex flex-col text-xs text-neutral-500">
              Prix (€)
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={(v.priceCents / 100).toString()}
                className={`${field} w-24`}
              />
            </label>
            <label className="flex flex-col text-xs text-neutral-500">
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={v.stock.toString()}
                className={`${field} w-20`}
              />
            </label>
            <Button type="submit" size="sm" variant="outline">
              Enregistrer
            </Button>
          </form>
          <form action={deleteVariant.bind(null, v.id, productId)}>
            <button type="submit" className="text-sm text-neutral-400 hover:text-red-600">
              Supprimer
            </button>
          </form>
        </div>
      ))}

      <form
        action={addVariant.bind(null, productId)}
        className="flex flex-wrap items-end gap-2 rounded-md border border-dashed border-neutral-300 p-3"
      >
        <label className="flex flex-col text-xs text-neutral-500">
          Libellé *
          <Input name="label" placeholder="ex. Chocolat 2KG" className="w-40" required />
        </label>
        <label className="flex flex-col text-xs text-neutral-500">
          SKU
          <Input name="sku" className="w-28" />
        </label>
        <label className="flex flex-col text-xs text-neutral-500">
          Prix (€)
          <Input name="price" type="number" step="0.01" min="0" className="w-24" />
        </label>
        <label className="flex flex-col text-xs text-neutral-500">
          Stock
          <Input name="stock" type="number" min="0" defaultValue="0" className="w-20" />
        </label>
        <Button type="submit" size="sm">
          Ajouter
        </Button>
      </form>
    </div>
  )
}
