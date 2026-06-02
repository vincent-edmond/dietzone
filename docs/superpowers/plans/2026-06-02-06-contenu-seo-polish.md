# Plan 6 — Contenu, SEO, design & polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development ou superpowers:executing-plans.
> **Pré-requis :** Plans 1-5 terminés. Lire `00-conventions.md`. Skills design : `ui-ux-pro-max`, `ui-styling`.

**Goal:** Finaliser la boutique pour le lancement : pages institutionnelles/légales, header/footer/accueil orientés conversion, support WhatsApp, avis produits, SEO de base, accessibilité et responsive.

**Architecture:** Composants de mise en page partagés (`Header`, `Footer`, `WhatsAppButton`) dans le layout boutique. Pages de contenu en RSC statiques. Accueil composé de sections de conversion. Métadonnées + sitemap + données structurées.

**Tech Stack:** Next.js Metadata API, Tailwind/shadcn, design tokens (rouge/bleu/clair).

---

### Task 1 : Design tokens (charte rouge/bleu premium)

**Files:**
- Modify: `src/app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Tokens couleurs** dans Tailwind/CSS vars (cf spec §8) :
```css
/* globals.css — variables de marque */
:root {
  --brand-red: 0 84% 47%;     /* rouge énergie (CTA) */
  --brand-navy: 215 60% 23%;  /* bleu marine (confiance/PRO) */
  --brand-bg: 0 0% 100%;      /* base claire */
  --brand-muted: 220 14% 96%;
}
```
Mapper sur `tailwind.config.ts` (`colors.brand.red`, `brand.navy`, etc.). Le bouton CTA par défaut (shadcn `Button` variant `default`) utilise `brand-red`. **Step 2:** Vérif : le bouton « Ajouter au panier » est rouge et bien contrasté (WCAG AA). **Step 3:** commit `style: brand design tokens (red/navy/light)`.

---

### Task 2 : Header + Footer + WhatsApp

**Files:**
- Create: `src/components/shop/Header.tsx`, `src/components/shop/Footer.tsx`, `src/components/shop/WhatsAppButton.tsx`
- Modify: layout du groupe `(shop)`

- [ ] **Step 1:** `Header` : logo DIETZONE, nav (Boutique, par Objectif, PRO, Contact), recherche, `CartButton`, lien compte/connexion. Responsive (menu mobile). **Step 2:** `Footer` : infos magasin (adresse St-Denis, horaires, tél), liens légaux, réseaux. **Step 3:** `WhatsAppButton` (flottant) → `https://wa.me/<whatsapp_number>` depuis `getSettings`. **Step 4:** Test composant : le header affiche le lien Boutique et le bouton panier. **Step 5:** commit `feat(shop): header + footer + whatsapp button`.

---

### Task 3 : Page d'accueil orientée conversion

**Files:**
- Modify: `src/app/(shop)/page.tsx` (ou `page.tsx` racine déplacée dans `(shop)`)
- Create: `src/components/shop/home/*` (Hero, ObjectiveTiles, BestSellers, BrandStrip, Reassurance)

- [ ] **Step 1:** `Hero` : accroche forte (« Expert en nutrition sportive à La Réunion »), CTA « Découvrir la boutique », visuel produit. **Step 2:** `ObjectiveTiles` : 4 tuiles (Prise de masse / Sèche / Énergie / Santé) → `/boutique?objectif=...`. **Step 3:** `BestSellers` : grille de produits (requête catalogue, ex. 8 produits actifs). **Step 4:** `BrandStrip` : logos marques premium (Gaspari, Cellucor, NPL…). **Step 5:** `Reassurance` : bandeau (livraison île, retrait magasin, paiement sécurisé, conseils d'expert). **Step 6:** Vérif : accueil responsive, CTA visibles, LCP correct. **Step 7:** commit `feat(shop): high-conversion homepage`.

> Utiliser le skill `ui-ux-pro-max` pour le parti pris visuel (hiérarchie, espacements, typographie) — démarcation nette vs concurrents chargés.

---

### Task 4 : Pages institutionnelles & légales

**Files:**
- Create sous `src/app/(shop)/` : `a-propos/page.tsx`, `contact/page.tsx`, `faq/page.tsx`, `cgv/page.tsx`, `mentions-legales/page.tsx`, `livraison-retours/page.tsx`, `confidentialite/page.tsx`

- [ ] **Step 1:** Modèle de page de contenu commun (titre + corps MDX/JSX + `generateMetadata`). **Step 2:** Remplir : **À propos** (Alexandre, expertise, magasin), **Contact** (carte/adresse St-Denis, tél, WhatsApp, horaires, formulaire ou mailto), **FAQ** (livraison, retrait, paiement, retours), **CGV / Mentions légales / Confidentialité / Livraison & retours** (gabarits FR à compléter avec le contenu juridique fourni par le client — cf §10 du spec). **Step 3:** Lier toutes ces pages dans le `Footer`. **Step 4:** `npm run build` vert (toutes les routes rendues). **Step 5:** commit `feat(content): institutional + legal pages`.

> ⚠️ **Action humaine** : fournir/valider le contenu juridique réel (CGV, mentions légales — spécificités DOM/Réunion).

---

### Task 5 : Avis produits

**Files:**
- Create: `supabase/migrations/0008_reviews.sql`, `src/features/catalog/reviews.ts`, `src/components/shop/Reviews.tsx`

- [ ] **Step 1: Migration reviews**
```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz not null default now()
);
alter table reviews enable row level security;
create policy "public read approved reviews" on reviews for select using (status = 'approved');
create policy "user creates review" on reviews for insert with check (auth.uid() = user_id);
create policy "admin moderates reviews" on reviews for all using (is_admin()) with check (is_admin());
```
- [ ] **Step 2:** `reviews.ts` : `listApproved(productId)`, `averageRating(productId)`, `submitReview(...)`. **Step 3:** `Reviews` sur la fiche produit (note moyenne + avis + formulaire si connecté). **Step 4:** Modération dans l'admin (réutiliser le pattern Plan 5). **Step 5:** Test `averageRating` (arrondi à 0,1). **Step 6:** commit `feat(reviews): product reviews + moderation`.

---

### Task 6 : SEO de base

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: pages produit/catégorie (`generateMetadata`)

- [ ] **Step 1:** `sitemap.ts` : URLs statiques + produits actifs + catégories (depuis Supabase). **Step 2:** `robots.ts` : autorise tout sauf `/admin` et `/api`. **Step 3:** Métadonnées par page (title/description uniques, Open Graph), données structurées `Product` (JSON-LD) sur la fiche produit. **Step 4:** `npm run build` vert ; vérifier `/sitemap.xml` et `/robots.txt`. **Step 5:** commit `feat(seo): sitemap + robots + product metadata + JSON-LD`.

---

### Task 7 : Accessibilité, responsive & passe finale

**Files:**
- Create: `tests/e2e/smoke.spec.ts` (Playwright)

- [ ] **Step 1: Parcours e2e** Playwright : accueil → boutique → fiche produit → ajout panier → checkout retrait → page de confirmation. **Step 2:** Lancer `npx playwright test` (Plan suppose Playwright dispo). **Step 3:** Passe responsive (mobile/tablette/desktop) sur accueil, boutique, fiche, panier, checkout. **Step 4:** Passe accessibilité : labels de formulaire, contrastes AA, navigation clavier (composants Radix OK), `alt` sur images. **Step 5:** `npm run build && npm test && npm run typecheck && npm run lint` tous verts. **Step 6:** commit `test(e2e): purchase smoke flow + a11y/responsive polish`.

---

## Self-Review (Plan 6)

- **Couverture §8 (visuel)** : tokens rouge/navy/clair, CTA rouge proéminents, hiérarchie premium ✓.
- **Couverture §1 (différenciation)** : accueil par objectif, WhatsApp local, avis produits, ancrage St-Denis, site rapide ✓.
- **Couverture §2 (pages info/légales)** + SEO de base ✓.
- **Qualité** : e2e smoke + a11y/responsive ✓.

**Sortie de Plan 6 :** boutique prête à lancer. ✅ Fin du v1 (Phases 1+2).

---

## Reste hors v1 (rappel)
Phase 3 (codes promo, fidélité, relance panier, blog SEO/GEO), Phase 4 (sync stock magasin), puis Métropole / paiement en plusieurs fois / virement B2B / multi-langue.
