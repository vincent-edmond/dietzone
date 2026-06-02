# DietZone — Contrat technique partagé (conventions)

> Référence commune à TOUS les plans (1 à 6). Toute décision transverse (nommage, types, money, outils) est figée ici pour garantir la cohérence. Les plans s'y réfèrent au lieu de redéfinir.

## Stack & outils

- **Node** ≥ 20, **gestionnaire de paquets : `npm`**.
- **Next.js 15** (App Router, TypeScript strict), structure `src/`.
- **Tailwind CSS** + **shadcn/ui** (composants Radix).
- **Supabase** : `@supabase/supabase-js` + `@supabase/ssr` (auth SSR Next.js), Postgres + Storage + RLS.
- **Stripe** : `stripe` (SDK serveur) + Stripe Checkout hébergé + webhooks.
- **Tests** : **Vitest** + **@testing-library/react** (unit/composant) ; **Playwright** (e2e, déjà installé globalement). TDD.
- **Lint/format** : ESLint (config Next) + Prettier. **Typecheck** : `tsc --noEmit`.
- **Emails** : **Resend** (`resend` SDK) — transactionnels.
- **Déploiement** : Vercel (front + route handlers) ; Supabase managé.

## Arborescence cible

```
src/
  app/                      # routes (App Router)
    (shop)/                 # boutique publique
    (account)/              # compte client
    pro/                    # espace PRO
    admin/                  # back-office
    api/                    # route handlers (stripe webhook, etc.)
  components/
    ui/                     # composants shadcn
    shop/ account/ pro/ admin/  # composants par domaine
  features/                 # logique métier par domaine
    catalog/ cart/ checkout/ account/ pro/ admin/ content/
  lib/
    supabase/               # clients (browser, server, admin)
    stripe/                 # client stripe
    money.ts                # helpers prix (cents <-> €)
    utils.ts
  types/                    # types partagés (db.ts généré, domain.ts)
tests/
  unit/ component/ e2e/
supabase/
  migrations/               # SQL versionné
  seed.sql                  # données de démo
```

**Principe** : fichiers petits et focalisés (une responsabilité). Ce qui change ensemble vit ensemble (découpage par domaine, pas par couche technique).

## Conventions de données (CRITIQUE — réutilisé partout)

- **Identifiants** : `uuid` (Postgres `gen_random_uuid()`).
- **Argent** : **stocké en CENTIMES (entier)**. Champ `price_cents int`. Jamais de float pour l'argent. Helpers dans `lib/money.ts` : `formatEuros(cents) => "65,00 €"`, `eurosToCents(€) => cents`.
- **Prix affichés** : TTC (TVA Réunion 8,5 % déjà incluse dans le prix saisi).
- **Prix PRO** : jamais stocké — **dérivé** : `proCents = Math.round(price_cents * (100 - pro_discount_percent) / 100)`. Helper `lib/money.ts:applyProDiscount(cents, percent)`.
- **Slugs** : minuscules, sans accents, tirets (`slugify`).
- **Horodatage** : `created_at timestamptz default now()`.
- **Enums** (texte contraint par `check`) :
  - `profiles.role` : `'customer' | 'pro' | 'admin'`
  - `pro_applications.status` : `'pending' | 'approved' | 'rejected'`
  - `orders.status` : `'pending' | 'paid' | 'to_pay_pickup' | 'preparing' | 'ready' | 'shipped' | 'picked_up' | 'cancelled'`
  - `orders.fulfillment` : `'delivery' | 'pickup'`
  - `orders.payment_method` : `'card' | 'pickup'`
  - `reviews.status` : `'pending' | 'approved'`

## Types de domaine (source de vérité — `src/types/domain.ts`)

Définis en Plan 1, réutilisés tels quels ensuite :

```typescript
export type Role = 'customer' | 'pro' | 'admin'
export type OrderStatus = 'pending' | 'paid' | 'to_pay_pickup' | 'preparing' | 'ready' | 'shipped' | 'picked_up' | 'cancelled'
export type Fulfillment = 'delivery' | 'pickup'
export type PaymentMethod = 'card' | 'pickup'
export type ProStatus = 'pending' | 'approved' | 'rejected'

export interface Money { cents: number } // toujours en centimes

export interface CartLine {
  variantId: string
  productId: string
  name: string        // snapshot "Ripped Whey — Chocolat 2KG"
  unitPriceCents: number // prix PUBLIC unitaire (la remise pro est appliquée au calcul du total)
  qty: number
  image?: string
  maxStock: number
}
```

## Variables d'environnement (`.env.local`, jamais commité)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # serveur uniquement
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=
```

## Conventions de commit

`type: sujet court` (`feat:`, `fix:`, `test:`, `chore:`, `docs:`). Commits fréquents (un par étape verte). Finir les messages par :

```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

## Définition de « terminé » pour chaque tâche

1. Le test écrit échoue d'abord (rouge).
2. Implémentation minimale → test vert.
3. `npm run typecheck` + `npm run lint` verts.
4. Commit.

## Ordre d'exécution des plans

1 (Fondation) → 2 (Catalogue) → 3 (Panier/Checkout) → 4 (Comptes/PRO) → 5 (Admin) → 6 (Contenu/SEO/polish). Chaque plan produit un logiciel fonctionnel et testable.
