import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductBySlug, listProducts } from '@/features/catalog/queries'
import { getPricingContext } from '@/features/pro/context'
import { getSettings } from '@/features/admin/settings'
import { getRating, listReviews } from '@/features/catalog/reviews'
import { getCurrentUser } from '@/features/account/auth'
import { BuyBox } from '@/components/shop/product/BuyBox'
import { Benefits } from '@/components/shop/product/Benefits'
import { ProductAccordion } from '@/components/shop/product/ProductAccordion'
import { ReviewsSection } from '@/components/shop/product/ReviewsSection'
import { RatingStars } from '@/components/shop/product/RatingStars'
import { StickyBar } from '@/components/shop/product/StickyBar'
import { BundleTogether, type BundleItem } from '@/components/shop/product/BundleTogether'
import { ProductGrid } from '@/components/shop/ProductGrid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) return { title: 'Produit introuvable' }
  return {
    title: p.name,
    description: p.description?.slice(0, 160) || `${p.name} — nutrition sportive chez DietZone.`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) notFound()

  const [pricing, settings, rating, reviews, user, allProducts] = await Promise.all([
    getPricingContext(),
    getSettings(),
    getRating(p.id),
    listReviews(p.id),
    getCurrentUser(),
    listProducts({ sort: 'newest' }),
  ])
  const related = allProducts.filter((x) => x.slug !== p.slug).slice(0, 4)

  // « Fréquemment achetés ensemble » : ce produit + 2 compléments en stock
  const mainVariant = p.variants[0]
  const bundleItems: BundleItem[] = mainVariant
    ? [
        {
          variantId: mainVariant.id,
          productId: p.id,
          name: p.name,
          brand: p.brand,
          image: p.images[0],
          priceCents: mainVariant.priceCents,
          stock: mainVariant.stock,
          slug: p.slug,
          isMain: true,
        },
        ...related
          .filter((r) => r.variantId && r.inStock)
          .slice(0, 2)
          .map((r) => ({
            variantId: r.variantId as string,
            productId: r.id,
            name: r.name,
            brand: r.brand,
            image: r.image,
            priceCents: r.fromPriceCents,
            stock: r.stock,
            slug: r.slug,
          })),
      ]
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description || undefined,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (p.fromPriceCents / 100).toFixed(2),
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(rating.count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.avg,
            reviewCount: rating.count,
          },
        }
      : {}),
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/boutique" className="hover:underline">
          Boutique
        </Link>
        <span> / {p.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Galerie */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200">
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain p-8" />
            ) : (
              <span className="font-heading text-8xl font-extrabold text-neutral-300">
                {p.name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Buy box */}
        <div className="flex flex-col gap-5">
          {p.brand && (
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              {p.brand}
            </span>
          )}
          <h1 className="text-4xl font-extrabold uppercase leading-none tracking-tight">{p.name}</h1>

          {rating.count > 0 && (
            <a href="#avis" className="w-fit">
              <RatingStars value={rating.avg} count={rating.count} />
            </a>
          )}

          {p.objectives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.objectives.map((o) => (
                <span
                  key={o}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700"
                >
                  {o}
                </span>
              ))}
            </div>
          )}

          <BuyBox
            productId={p.id}
            productName={p.name}
            image={p.images[0]}
            variants={p.variants}
            pricing={pricing}
            freeShipThresholdCents={settings.freeShippingThresholdCents}
          />

          <Benefits />
        </div>
      </div>

      {/* Fréquemment achetés ensemble */}
      {bundleItems.length >= 2 && (
        <div className="max-w-4xl">
          <BundleTogether items={bundleItems} pricing={pricing} />
        </div>
      )}

      {/* Détails */}
      <div className="mt-12 max-w-3xl">
        <ProductAccordion description={p.description} />
      </div>

      {/* Avis */}
      <div id="avis" className="mt-14 scroll-mt-24">
        <ReviewsSection
          productId={p.id}
          slug={p.slug}
          rating={rating}
          reviews={reviews}
          canReview={!!user}
        />
      </div>

      {/* Cross-sell */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1.5 rounded bg-primary" />
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">
              Complétez votre routine
            </h2>
          </div>
          <div className="mt-6">
            <ProductGrid products={related} pricing={pricing} />
          </div>
        </section>
      )}

      <StickyBar
        productId={p.id}
        productName={p.name}
        image={p.images[0]}
        variants={p.variants}
        pricing={pricing}
      />
    </main>
  )
}
