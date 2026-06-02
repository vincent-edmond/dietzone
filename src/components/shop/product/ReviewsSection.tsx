import Link from 'next/link'
import type { Rating, ReviewRow } from '@/features/catalog/reviews'
import { RatingStars } from './RatingStars'
import { ReviewForm } from './ReviewForm'

export function ReviewsSection({
  productId,
  slug,
  rating,
  reviews,
  canReview,
}: {
  productId: string
  slug: string
  rating: Rating
  reviews: ReviewRow[]
  canReview: boolean
}) {
  return (
    <section className="border-t border-neutral-200 pt-10">
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded bg-primary" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">Avis clients</h2>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-4xl font-extrabold">{rating.count ? rating.avg.toFixed(1) : '—'}</span>
        <div>
          <RatingStars value={rating.avg} />
          <p className="mt-1 text-sm text-neutral-500">{rating.count} avis vérifié(s)</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-5">
          {reviews.length === 0 && (
            <li className="text-sm text-neutral-500">
              Aucun avis pour l’instant. Soyez le premier !
            </li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-neutral-100 pb-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">{r.authorName}</span>
                <RatingStars value={r.rating} />
              </div>
              {r.comment && <p className="mt-2 text-sm text-neutral-600">{r.comment}</p>}
              <p className="mt-1 text-xs text-neutral-400">
                {new Date(r.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </li>
          ))}
        </ul>

        <div>
          <h3 className="mb-3 text-lg font-bold">Laisser un avis</h3>
          {canReview ? (
            <ReviewForm productId={productId} slug={slug} />
          ) : (
            <p className="rounded-xl border-2 border-dashed border-neutral-200 p-5 text-sm text-neutral-600">
              <Link href="/connexion" className="font-semibold text-primary hover:underline">
                Connectez-vous
              </Link>{' '}
              pour laisser un avis.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
