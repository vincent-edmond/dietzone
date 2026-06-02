'use client'

import { useState, useRef } from 'react'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { setProductImage } from '@/features/admin/products'

export function ImageUploader({
  productId,
  currentImage,
}: {
  productId: string
  currentImage: string | null
}) {
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choisissez un fichier image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop lourde (max 5 Mo).')
      return
    }
    setBusy(true)
    setError('')
    try {
      const sb = createClient()
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${productId}/${Date.now()}.${ext}`
      const { error: upErr } = await sb.storage
        .from('product-images')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr
      const { data } = sb.storage.from('product-images').getPublicUrl(path)
      await setProductImage(productId, data.publicUrl)
      setPreview(data.publicUrl)
    } catch {
      setError('Échec de l’upload. Réessayez.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function remove() {
    setBusy(true)
    setError('')
    try {
      await setProductImage(productId, null)
      setPreview(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-xs text-neutral-400">Aucune image</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={busy}
          className="hidden"
          id={`upload-${productId}`}
        />
        <label
          htmlFor={`upload-${productId}`}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 ${
            busy ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {preview ? 'Remplacer l’image' : 'Ajouter une image'}
        </label>
        {preview && !busy && (
          <button
            type="button"
            onClick={remove}
            className="inline-flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Retirer
          </button>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-neutral-400">JPG/PNG, max 5 Mo. Idéalement carré.</p>
      </div>
    </div>
  )
}
