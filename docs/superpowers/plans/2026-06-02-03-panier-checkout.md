# Plan 3 — Panier & Checkout invité — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development ou superpowers:executing-plans.
> **Pré-requis :** Plans 1-2 terminés, `.env.local` avec clés Stripe (mode test) + Resend. Lire `00-conventions.md`.

**Goal:** Permettre à un visiteur (sans compte) d'ajouter au panier et de commander, en payant par carte (Stripe Checkout) ou en choisissant le retrait magasin (paiement sur place), avec création de commande, décrément de stock et email de confirmation.

**Architecture:** Panier en état client (Zustand + persistance localStorage). Checkout = formulaire → Server Action qui crée la commande (statut initial selon le mode) puis, pour CB, ouvre une session Stripe Checkout. Confirmation de paiement par **webhook Stripe** (source de vérité). Stock décrémenté de façon atomique via fonction Postgres.

**Tech Stack:** Zustand, Stripe Checkout + webhooks, Supabase (service role côté serveur), Resend.

---

### Task 1 : Schéma commandes + RLS

**Files:**
- Create: `supabase/migrations/0003_orders.sql`, `supabase/migrations/0004_orders_rls.sql`

- [ ] **Step 1: Migration commandes**

Create `supabase/migrations/0003_orders.sql`:
```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,  -- null si invité
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','to_pay_pickup','preparing','ready','shipped','picked_up','cancelled')),
  fulfillment text not null check (fulfillment in ('delivery','pickup')),
  payment_method text not null check (payment_method in ('card','pickup')),
  subtotal_cents int not null,
  shipping_cents int not null default 0,
  total_cents int not null,
  shipping_address jsonb,
  is_pro_order boolean not null default false,
  stripe_session_id text,
  created_at timestamptz not null default now()
);
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  name_snapshot text not null,
  unit_price_cents int not null,
  qty int not null check (qty > 0)
);
create index on orders (user_id);
create index on orders (created_at desc);
create index on order_items (order_id);

-- Décrément de stock atomique (évite la survente)
create or replace function decrement_stock(p_variant_id uuid, p_qty int)
returns void language plpgsql as $$
begin
  update product_variants
    set stock_qty = stock_qty - p_qty
    where id = p_variant_id and stock_qty >= p_qty;
  if not found then
    raise exception 'STOCK_INSUFFISANT pour la variante %', p_variant_id;
  end if;
end; $$;
```

- [ ] **Step 2: RLS commandes**

Create `supabase/migrations/0004_orders_rls.sql`:
```sql
alter table orders enable row level security;
alter table order_items enable row level security;
-- Le client connecté voit ses commandes ; les commandes invité ne sont pas lisibles via l'API publique.
create policy "user reads own orders" on orders for select using (auth.uid() = user_id);
create policy "user reads own order items" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
-- Écriture commandes : SERVICE ROLE uniquement (Server Actions / webhook). Pas de policy insert publique.
```

- [ ] **Step 3:** Appliquer les 2 migrations (MCP `apply_migration`), vérifier `get_advisors` security. **Step 4:** commit `feat(db): orders + order_items + decrement_stock + RLS`.

---

### Task 2 : Store panier (Zustand, TDD)

**Files:**
- Create: `src/features/cart/store.ts`, `src/features/cart/totals.ts`
- Test: `tests/unit/cart-totals.test.ts`, `tests/unit/cart-store.test.ts`

- [ ] **Step 1: Test des totaux (rouge)**

Create `tests/unit/cart-totals.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { computeTotals } from '@/features/cart/totals'
import type { CartLine } from '@/types/domain'

const line = (priceCents: number, qty: number): CartLine =>
  ({ variantId:'v', productId:'p', name:'x', unitPriceCents:priceCents, qty, maxStock:99 })

describe('computeTotals', () => {
  it('somme le sous-total prix public', () => {
    const t = computeTotals([line(4900,2), line(6500,1)], { fulfillment:'pickup', isPro:false, proPercent:0, shippingFeeCents:500, freeShipThresholdCents:4499 })
    expect(t.subtotalCents).toBe(4900*2+6500)
  })
  it('applique la remise pro au sous-total', () => {
    const t = computeTotals([line(10000,1)], { fulfillment:'pickup', isPro:true, proPercent:20, shippingFeeCents:500, freeShipThresholdCents:99999 })
    expect(t.subtotalCents).toBe(8000)
  })
  it('frais de port nuls en retrait', () => {
    const t = computeTotals([line(1000,1)], { fulfillment:'pickup', isPro:false, proPercent:0, shippingFeeCents:500, freeShipThresholdCents:99999 })
    expect(t.shippingCents).toBe(0)
  })
  it('port offert au-delà du seuil en livraison', () => {
    const t = computeTotals([line(5000,1)], { fulfillment:'delivery', isPro:false, proPercent:0, shippingFeeCents:500, freeShipThresholdCents:4499 })
    expect(t.shippingCents).toBe(0)
  })
  it('port facturé sous le seuil en livraison', () => {
    const t = computeTotals([line(3000,1)], { fulfillment:'delivery', isPro:false, proPercent:0, shippingFeeCents:500, freeShipThresholdCents:4499 })
    expect(t.shippingCents).toBe(500)
    expect(t.totalCents).toBe(3500)
  })
})
```

- [ ] **Step 2: Implémenter `totals.ts`**

Create `src/features/cart/totals.ts`:
```typescript
import type { CartLine } from '@/types/domain'
import { applyProDiscount } from '@/lib/money'

export interface TotalsCtx {
  fulfillment: 'delivery' | 'pickup'
  isPro: boolean
  proPercent: number
  shippingFeeCents: number
  freeShipThresholdCents: number
}
export interface Totals { subtotalCents: number; shippingCents: number; totalCents: number }

export function computeTotals(lines: CartLine[], ctx: TotalsCtx): Totals {
  const gross = lines.reduce((s, l) => s + l.unitPriceCents * l.qty, 0)
  const subtotalCents = ctx.isPro ? applyProDiscount(gross, ctx.proPercent) : gross
  let shippingCents = 0
  if (ctx.fulfillment === 'delivery' && subtotalCents < ctx.freeShipThresholdCents) {
    shippingCents = ctx.shippingFeeCents
  }
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents }
}
```

- [ ] **Step 3:** test vert (`npm test -- cart-totals`).
- [ ] **Step 4: Store Zustand** — `npm i zustand`. Implémenter `store.ts` : `lines`, `add(line)`, `remove(variantId)`, `setQty(variantId, qty)` (borné à `maxStock`), `clear()`, persistance `localStorage`. **Step 5:** test `cart-store.test.ts` (add fusionne par `variantId`, `setQty` borne au stock). **Step 6:** test vert. **Step 7:** commit `feat(cart): zustand store + totals (TDD)`.

---

### Task 3 : Câbler « Ajouter au panier » + mini-panier

**Files:**
- Modify: `src/components/shop/VariantPicker.tsx`
- Create: `src/components/shop/CartButton.tsx`, `src/app/(shop)/panier/page.tsx`

- [ ] **Step 1:** Brancher le bouton « Ajouter au panier » du `VariantPicker` sur `store.add(...)` (désactivé si stock 0). **Step 2:** `CartButton` dans le header (compteur d'articles). **Step 3:** Page `/panier` : lignes éditables (qty, suppression), récap totaux (mode retrait par défaut → port 0), bouton « Passer la commande » → `/checkout`. **Step 4:** test composant : ajouter au panier incrémente le compteur. **Step 5:** commit `feat(cart): add-to-cart wiring + cart page`.

---

### Task 4 : Réglages boutique (settings) — lecture

**Files:**
- Create: `supabase/migrations/0005_settings.sql`, `src/features/admin/settings.ts`

- [ ] **Step 1: Migration settings (singleton)**

Create `supabase/migrations/0005_settings.sql`:
```sql
create table settings (
  id boolean primary key default true check (id),  -- singleton
  pro_discount_percent int not null default 20 check (pro_discount_percent between 0 and 90),
  free_shipping_threshold_cents int not null default 4499,
  shipping_fee_cents int not null default 500,
  store_name text not null default 'DietZone',
  store_address text not null default '6b rue Léopauld Rambaud, St-Denis, La Réunion',
  store_phone text not null default '0692 78 35 08',
  store_hours text not null default '11H - 18H, Lundi au Vendredi',
  whatsapp_number text not null default ''
);
insert into settings (id) values (true) on conflict do nothing;
alter table settings enable row level security;
create policy "public read settings" on settings for select using (true);
```
- [ ] **Step 2:** `getSettings()` dans `src/features/admin/settings.ts` (lecture serveur). **Step 3:** appliquer migration, commit `feat(db): settings singleton + public read`.

---

### Task 5 : Création de commande (Server Action)

**Files:**
- Create: `src/features/checkout/createOrder.ts`, `src/features/checkout/schema.ts`
- Test: `tests/unit/checkout-schema.test.ts`

- [ ] **Step 1: Schéma de validation (Zod)** — `npm i zod`. `schema.ts` : `email` valide, `fulfillment`, `payment_method`, `shipping_address` requis si `delivery`. **Step 2:** test `checkout-schema.test.ts` (rejette email invalide ; exige adresse si livraison ; accepte retrait sans adresse). **Step 3:** test vert.

- [ ] **Step 4: Server Action `createOrder`**

Create `src/features/checkout/createOrder.ts` (`'use server'`). Logique :
1. Valider l'input (Zod).
2. **Recharger les variantes depuis la BDD** (prix/stock — ne jamais faire confiance au client).
3. Recalculer les totaux serveur via `computeTotals` (avec `getSettings`, statut pro via session si connecté).
4. Insérer `orders` + `order_items` (client **service role**), `status` = `pending` (card) ou `to_pay_pickup` (pickup), `payment_method` correspondant.
5. **Réserver le stock** pour le retrait : appeler `decrement_stock` par ligne (pickup). Pour la carte, le décrément se fait au webhook (paiement confirmé).
6. Retourner `{ orderId, total_cents, payment_method }`.

Code clé (insertion) :
```typescript
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { computeTotals } from '@/features/cart/totals'
import { getSettings } from '@/features/admin/settings'
import { checkoutSchema } from './schema'

export async function createOrder(input: unknown) {
  const data = checkoutSchema.parse(input)
  const sb = createAdminClient()
  const variantIds = data.lines.map(l => l.variantId)
  const { data: variants } = await sb.from('product_variants')
    .select('id, label, price_cents, stock_qty, product_id, products(name)')
    .in('id', variantIds)
  // ... reconstruire les CartLine depuis la BDD, computeTotals, insert orders+items, decrement si pickup
  // (voir étapes ci-dessus). Lève si stock insuffisant.
}
```

- [ ] **Step 5:** test d'intégration léger (mock service role) sur le recalcul serveur du total. **Step 6:** commit `feat(checkout): server-side order creation (server-trusted totals)`.

---

### Task 6 : Stripe Checkout + webhook

**Files:**
- Create: `src/lib/stripe/server.ts`, `src/features/checkout/stripe.ts`, `src/app/api/stripe/webhook/route.ts`

- [ ] **Step 1:** `npm i stripe`. `lib/stripe/server.ts` : `new Stripe(requireEnv('STRIPE_SECRET_KEY'))`.
- [ ] **Step 2:** `stripe.ts` : `createCheckoutSession(orderId, lines, totals, email)` → session Stripe (mode `payment`, devise `eur`, `line_items` en centimes, `success_url`/`cancel_url` avec `NEXT_PUBLIC_SITE_URL`, `metadata.orderId`, `customer_email`). Stocke `stripe_session_id` sur la commande.
- [ ] **Step 3: Webhook (source de vérité du paiement)**

Create `src/app/api/stripe/webhook/route.ts`:
```typescript
import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireEnv } from '@/lib/supabase/env'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, requireEnv('STRIPE_WEBHOOK_SECRET'))
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const orderId = session.metadata.orderId
    const sb = createAdminClient()
    // Idempotence : ne traiter que si encore 'pending'
    const { data: order } = await sb.from('orders').select('status').eq('id', orderId).single()
    if (order?.status === 'pending') {
      await sb.from('orders').update({ status: 'paid' }).eq('id', orderId)
      const { data: items } = await sb.from('order_items').select('variant_id, qty').eq('order_id', orderId)
      for (const it of items ?? []) {
        await sb.rpc('decrement_stock', { p_variant_id: it.variant_id, p_qty: it.qty })
      }
      // envoyer l'email de confirmation (Task 7)
    }
  }
  return new Response('ok', { status: 200 })
}
```
> Le webhook doit lire le **corps brut** (pas de parsing JSON automatique) pour vérifier la signature.

- [ ] **Step 4:** Test unitaire de l'idempotence (mock : un 2ᵉ événement ne re-décrémente pas). **Step 5:** Test manuel avec `stripe listen --forward-to localhost:3000/api/stripe/webhook` + carte test `4242…`. **Step 6:** commit `feat(checkout): stripe checkout session + webhook (idempotent, stock decrement)`.

---

### Task 7 : Page Checkout + emails + confirmation

**Files:**
- Create: `src/app/(shop)/checkout/page.tsx`, `src/app/(shop)/commande/[id]/page.tsx`, `src/lib/email/send.ts`, `src/features/checkout/emails.ts`

- [ ] **Step 1:** Page `/checkout` (client) : formulaire (email, choix **livraison/retrait**, adresse conditionnelle, choix **CB/retrait**), récap totaux live (`computeTotals`), bouton « Payer ». Soumet → `createOrder` → si `card`, redirige vers la session Stripe ; si `pickup`, redirige vers `/commande/[id]`.
- [ ] **Step 2:** `lib/email/send.ts` (`npm i resend`) + `emails.ts` : email de confirmation (récap commande, mode, total, adresse magasin pour retrait). Appelé au webhook (card) et à `createOrder` (pickup).
- [ ] **Step 3:** Page `/commande/[id]` : confirmation, récap, et **proposition de création de compte** (optionnel, post-commande). Réinitialise le panier (`store.clear()`).
- [ ] **Step 4:** Test composant : le formulaire exige une adresse seulement en mode livraison. **Step 5:** `npm test && npm run build` verts. **Step 6:** commit `feat(checkout): checkout page + confirmation + transactional emails`.

---

## Self-Review (Plan 3)

- **Couverture §4.1 / §6** : panier, checkout invité, CB Stripe + webhook, retrait/paiement sur place, décrément stock atomique, port (offert au seuil, 0 en retrait), emails ✓.
- **Sécurité argent** : totaux **recalculés côté serveur** depuis la BDD, jamais le client ✓. Webhook = source de vérité, idempotent ✓.
- **Cohérence types** : `CartLine`/`computeTotals` réutilisés ; `orders` enums conformes à `00-conventions.md`.
- **Dépendance Plan 4** : `is_pro_order`/remise pro câblés ici mais effectifs quand l'auth/PRO existe (Plan 4) ; par défaut `isPro=false`.

**Sortie de Plan 3 :** on peut acheter (CB ou retrait). ➡️ Plan 4.
