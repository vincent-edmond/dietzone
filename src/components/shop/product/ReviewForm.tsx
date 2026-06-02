'use client'

import { useActionState, useState } from 'react'
import { Star } from 'lucide-react'
import { submitReview, type ReviewState } from '@/features/catalog/reviewActions'
import { Button } from '@/components/ui/button'

export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, {})
  const [rating, setRating] = useState(5)

  if (state.message) {
    return (
      <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="rounded-xl border-2 border-neutral-200 p-5">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <p className="text-sm font-bold uppercase tracking-wide">Votre note</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-7 w-7 ${
                i <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        placeholder="Partagez votre expérience (optionnel)"
        className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="mt-3">
        {pending ? 'Envoi…' : 'Publier mon avis'}
      </Button>
    </form>
  )
}
