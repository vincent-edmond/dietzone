'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { AlertTriangle, Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { AdminProductRow } from '@/features/admin/products'
import {
  toggleProductActive,
  setProductVatRate,
  setSingleVariantPrice,
} from '@/features/admin/products'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { formatEuros, htCentsFromTtc, vatCentsFromTtc } from '@/lib/money'

const VAT_RATES = [8.5, 2.1, 0]

export function ProductRow({ product }: { product: AdminProductRow }) {
  const mono = product.variantCount === 1 && product.minPriceCents != null
  const baseCents = product.minPriceCents ?? 0

  const [isActive, setIsActive] = useState(product.isActive)
  const [vatRate, setVatRate] = useState(product.vatRate)
  const [priceStr, setPriceStr] = useState((baseCents / 100).toFixed(2))
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const parsed = parseFloat(priceStr.replace(',', '.'))
  const ttcCents = mono && Number.isFinite(parsed) ? Math.round(parsed * 100) : baseCents
  const htCents = htCentsFromTtc(ttcCents, vatRate)
  const tvaCents = vatCentsFromTtc(ttcCents, vatRate)

  function savePrice() {
    if (!mono) return
    const cents = Math.round(parseFloat(priceStr.replace(',', '.')) * 100)
    if (!Number.isInteger(cents) || cents <= 0) {
      setErr('Prix invalide')
      return
    }
    if (cents === baseCents) return
    setErr(null)
    start(async () => {
      const res = await setSingleVariantPrice(product.id, cents)
      if (res.error) setErr(res.error)
    })
  }

  function changeVat(rate: number) {
    setVatRate(rate)
    start(() => setProductVatRate(product.id, rate))
  }

  function toggleActive() {
    const next = !isActive
    setIsActive(next)
    start(() => toggleProductActive(product.id, next))
  }

  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
      {/* Produit */}
      <td className="px-4 py-3">
        <Link href={`/admin/produits/${product.id}`} className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-neutral-300">—</span>
            )}
          </span>
          <span>
            <span className="block font-semibold text-neutral-900">{product.name}</span>
            <span className="text-xs text-neutral-400">
              {product.brand ?? 'Sans marque'}
              {product.variantCount > 1 && ` · ${product.variantCount} variantes`}
            </span>
          </span>
        </Link>
      </td>

      {/* HT */}
      <td className="px-4 py-3 text-right tabular-nums text-neutral-600">
        {formatEuros(htCents)}
      </td>

      {/* TVA (montant) */}
      <td className="px-4 py-3 text-right tabular-nums text-neutral-500">
        {formatEuros(tvaCents)}
      </td>

      {/* TTC — éditable si mono-variante */}
      <td className="px-4 py-3 text-right">
        {mono ? (
          <span className="inline-flex items-center gap-1">
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              onBlur={savePrice}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              inputMode="decimal"
              className="w-20 rounded-md border border-neutral-200 px-2 py-1 text-right text-sm font-semibold tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-neutral-400">€</span>
          </span>
        ) : (
          <span className="font-semibold tabular-nums">
            dès {formatEuros(baseCents)}
          </span>
        )}
        {err && <p className="mt-1 text-[11px] text-red-600">{err}</p>}
      </td>

      {/* Taux TVA */}
      <td className="px-4 py-3 text-center">
        <select
          value={vatRate}
          onChange={(e) => changeVat(Number(e.target.value))}
          className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm focus:border-primary focus:outline-none"
        >
          {VAT_RATES.map((r) => (
            <option key={r} value={r}>
              {r.toLocaleString('fr-FR')} %
            </option>
          ))}
        </select>
      </td>

      {/* Stock */}
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            product.totalStock < 5 ? 'text-orange-600' : 'text-neutral-700'
          }`}
        >
          {product.totalStock < 5 && <AlertTriangle className="h-3.5 w-3.5" />}
          {product.totalStock}
        </span>
      </td>

      {/* Actif — toggle 1 clic */}
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={toggleActive}
          disabled={pending}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
          }`}
          title={isActive ? 'Cliquer pour masquer' : 'Cliquer pour activer'}
        >
          {isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {isActive ? 'Actif' : 'Masqué'}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-300" />
          ) : (
            <Check className="h-4 w-4 text-transparent" />
          )}
          <Link
            href={`/admin/produits/${product.id}`}
            className="font-medium text-primary hover:underline"
          >
            Éditer
          </Link>
          <DeleteProductButton id={product.id} />
        </div>
      </td>
    </tr>
  )
}
