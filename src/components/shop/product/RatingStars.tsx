import { Star } from 'lucide-react'

export function RatingStars({
  value,
  count,
  className = '',
}: {
  value: number
  count?: number
  className?: string
}) {
  const rounded = Math.round(value)
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= rounded ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        ))}
      </div>
      {value > 0 && <span className="text-sm font-bold text-neutral-900">{value.toFixed(1)}</span>}
      {count != null && (
        <span className="text-sm text-neutral-500">
          ({count} avis{count > 1 ? '' : ''})
        </span>
      )}
    </div>
  )
}
