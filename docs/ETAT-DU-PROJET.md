# DietZone — État du projet (handoff / mémoire)

> **À LIRE EN PREMIER au début de chaque session.** Ce document est la source de vérité du
> projet : il survit à toute compaction de contexte. Tenir à jour après chaque avancée majeure.
> Dernière mise à jour : 2026-06-02 (ajouts : upload image admin, refresh UI admin, redirection admin au login,
> actions rapides produits + TVA).
>
> **TVA** : colonne `products.vat_rate` (numeric %, défaut **8,5 %** = taux normal Réunion ; aussi 2,1 % et 0 %).
> Les prix variantes restent stockés **TTC** en centimes. HT/TVA dérivés à l'affichage via
> `htCentsFromTtc` / `vatCentsFromTtc` (src/lib/money.ts). Migration `0008_product_vat.sql`.
> **Actions rapides admin** (`/admin/produits`, composant `ProductRow.tsx`) : toggle actif 1 clic, prix TTC
> éditable inline (mono-variante uniquement ; multi-variante → éditer la fiche), select taux TVA, colonnes
> HT / TVA / TTC recalculées en direct. Actions serveur dans `features/admin/products.ts`.

---

## 1. Le projet en bref

**DietZone** = boutique e-commerce de **nutrition sportive** pour le magasin physique d'**Alexandre
PAYET** à **St-Denis (La Réunion)**. Objectif : un site orienté **vente/conversion** qui met DietZone
en tête du marché réunionnais.

**3 espaces** : boutique grand public · espace **Admin** (Alexandre gère stock/produits/commandes) ·
espace **PRO** (partenaires B2B avec tarifs remisés). Hypothèse : Alexandre gère son stock depuis la
plateforme ; à terme (Phase 4) il connectera le stock du magasin physique.

**Concurrents** (à dépasser) : discount-nutrition.re (leader, chargé), prohcd-nutrition.com (site
no-code thin), nutrisport.re (fade), elitediet974.re (fort en physique).
**Axes de différenciation** : design premium/sport bold · achat par objectif · ancrage local +
**assistant IA** (remplace WhatsApp) · avis produits · **espace PRO B2B en ligne** (aucun concurrent) ·
site rapide + SEO.

Contact client : Alexandre PAYET, 6b rue Léopauld Rambaud, St-Denis · 0692 78 35 08 · 11H-18H Lun-Ven.
Instagram : @dietzonereunion (~785 abonnés — NE PAS mettre en avant le nb d'abonnés).

---

## 2. Liens & accès (CRITIQUE)

| Élément | Valeur |
|---|---|
| **Repo GitHub** | `github.com/vincent-edmond/dietzone` (branche `main`) |
| **Local** | `~/Desktop/DietZone` (chemin réel : `/Users/vincentedmond/Dropbox (Compte personnel)/Mac (2)/Desktop/DietZone`) |
| **Site live** | **https://dietzone.netlify.app** |
| **Netlify** | site `dietzone`, siteId `871e921e-fbac-4eaa-8628-e9bd05ba4e5e`, team `vincent-edmond` (Free). **Auto-deploy connecté au repo : un `git push` sur main déploie automatiquement.** |
| **Supabase** | projet `dietzone`, ref/id `rqjuyyhwzznaihqtalod`, région eu-west-3 (Paris), org `eujxkxpvczlmwzxlqqgu`. URL `https://rqjuyyhwzznaihqtalod.supabase.co` |
| **Supabase clé publishable (publique)** | `sb_publishable_F4dv9YKeluiQCq4l_s-Nsg_uDkwaCDD` (= NEXT_PUBLIC_SUPABASE_ANON_KEY) |
| **MCP Supabase** | connecté (server id `995debb1-2163-4d06-b38f-ad0536658aa4`) — apply_migration, execute_sql, etc. |
| **MCP Netlify** | connecté (server id `9f5feae3-6023-49ff-b629-da645ff1df39`) — souvent instable en écriture (réessayer ; les writes finissent par passer) |

### Comptes de test (mot de passe commun : `Test1234!`)
- `client@example.com` (rôle customer) · `pro@example.com` (rôle pro, prix remisés) · `admin@example.com` (rôle admin)
- Créés directement en base (auth.users + identities, bcrypt, email confirmé) car les API de logos/emails sont limitées. Voir `docs/test-accounts.md`.

### Variables d'environnement
Local `.env.local` (NON commité) et Netlify (dashboard). **Déjà en place** : `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (= clé publishable), `NEXT_PUBLIC_SITE_URL`.
**À fournir plus tard** : `SUPABASE_SERVICE_ROLE_KEY` (dashboard Supabase > Settings > API), `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY` (active l'assistant IA).

---

## 3. Stack technique

Next.js **16** (App Router, TypeScript strict, dossier `src/`) · **Tailwind v4** · **shadcn/ui** (Radix) ·
**Supabase** (Postgres + Auth + Storage + RLS) · **Vitest** + testing-library (TDD) · **lucide-react** (icônes,
PAS d'emoji) · **zustand** (panier) · déploiement **Netlify** (runtime Next.js).

**Conventions clés** :
- **Argent en CENTIMES (int)** partout. `price_cents`. Helpers `src/lib/money.ts` (`formatEuros`, `eurosToCents`, `applyProDiscount`). Prix affichés TTC (TVA Réunion 8,5 % incluse dans le prix saisi).
- **Prix PRO** jamais stocké : dérivé via `settings.pro_discount_percent` (20 % par défaut) → `displayPriceCents` / `applyProDiscount`.
- Slugs minuscules sans accents. uuid. `created_at timestamptz default now()`.
- Scripts : `npm run dev|build|test|typecheck|lint`. Toujours valider build+test+lint avant push.

---

## 4. Structure du site (routes)

- **Groupe `(shop)`** (layout = `SiteChrome`) : `/` (accueil), `/boutique`, `/produit/[slug]`, `/panier`, + pages contenu `/a-propos` `/contact` `/faq` `/cgv` `/mentions-legales` `/livraison-retours`.
- **Groupe `(account)`** (layout = `SiteChrome`) : `/connexion`, `/inscription`, `/compte`, `/compte/commandes`.
- **`/pro`** (layout = `SiteChrome`) : `/pro` (landing), `/pro/demande`.
- **`/admin`** (layout propre, protégé `requireRole('admin')`) : dashboard, `/admin/produits` (+`/new`, +`/[id]`), `/admin/commandes` (+`/[id]`), `/admin/demandes-pro`, `/admin/reglages`.
- **API** : `/api/assistant` (assistant IA, route handler). `/api/stripe/webhook` (PRÉVU, pas encore codé).
- `SiteChrome` = `src/components/shop/SiteChrome.tsx` = HelloBar + Header + children + Footer + AssistantLauncher. Wrappe shop/account/pro. **Admin a son propre layout** (sidebar).

### Arborescence code (`src/`)
`app/` (routes) · `components/{ui,shop,shop/home,shop/product,account,pro,admin,assistant}` ·
`features/{catalog,cart,checkout,account,pro,admin}` · `lib/{supabase,money,slugify,assistant,demoImages}` ·
`types/{domain,db}`. Tests : `tests/{unit,component}`. SQL : `supabase/migrations/`.

---

## 5. Base de données (Supabase Postgres)

Tables : `profiles` (rôle customer|pro|admin, trigger `handle_new_user` à l'inscription) · `pro_applications`
(pending|approved|rejected ; champs pro : company_name, contact_name, activity_type, siret, phone, website,
message — **siret + phone obligatoires**, migration 0009) · `categories` · `brands` · `objectives` · `products` · `product_variants`
(prix_cents, stock_qty) · `product_objectives` (n-n) · `orders` (statuts pending|paid|to_pay_pickup|preparing|
ready|shipped|picked_up|cancelled, fulfillment delivery|pickup, payment_method card|pickup) · `order_items` ·
`settings` (singleton : pro_discount_percent, free_shipping_threshold_cents=4499, shipping_fee_cents=500, infos
magasin) · `reviews` (note 1-5, status approved par défaut).
Fonctions : `decrement_stock(variant,qty)`, `is_admin()`, `handle_new_user()`. **RLS activée partout** (lecture
publique catalogue/avis approuvés ; écriture admin via `is_admin()` ; commandes via service role/Server Actions).
Migrations versionnées dans `supabase/migrations/` (0001→0008).

### Catalogue actuel (10 produits)
Avec photo (`public/produits/<slug>.jpg`, **800×800**) : `proven-creatine` (Gaspari 35€), `c4-original`
(Cellucor 39,90€), `whey-core-protein` (NPL 49€/99€), `ripped-whey` (NPL 65€), `myofusion` (Gaspari 59,90€),
`hydrade` (NPL 24,90€), `moons-truck` (Zoomad Labs 39,90€), `mass-extreme-2500` (Mutant 59,90€).
**Sans photo** (placeholder lettre) : `superpump-max` (Gaspari 49€), `shilajit` (Pro HCD 29€).
Marques : Gaspari Nutrition, Cellucor, NPL, Pro HCD, Zoomad Labs, Mutant.
Chaque produit a ~3 avis de démo (note ~4,7★) — à remplacer par de vrais avis.

---

## 6. Design & charte

- **Polices** : titres **Barlow Condensed** (athlétique, var `--font-heading`, appliqué à h1-h6 via globals.css),
  corps **Inter** (var `--font-sans`). ⚠️ Bug historique : si les titres reviennent en serif, c'est que la
  variable de police ne matche pas le thème Tailwind — vérifier `layout.tsx` + `globals.css @theme`.
- **Couleurs** : primaire **rouge** `--primary: oklch(0.55 0.22 27)` (CTA, défini dans globals.css), secondaire
  **bleu marine `#0A2540`** (badges PRO), base claire + sections **sombres** (`bg-neutral-950`).
- **Direction** : "bold sport" — hero sombre + halo rouge + image, titres CAPITALES condensées, gradients,
  animations. Footer noir.
- **Logo** : `public/logo-dietzone.png` (badge DIETZONE rouge/bleu/argent, fond transparent, 600px). Dans header
  (h-12), footer (h-20), connexion/inscription/admin.
- **Animations** : `src/components/ui/Reveal.tsx` (apparition au scroll, IntersectionObserver) · HelloBar rotative ·
  marquee marques (CSS `dz-marquee` dans globals.css) · hover scale CTA · entrée hero (`animate-in` tw-animate-css).
- **Images de démo** (à remplacer) : `src/lib/demoImages.ts` (hero, cta, tuiles objectif — photos Unsplash fitness
  hotlinkées). Centralisé : éditer ce fichier pour changer.

---

## 7. Ce qui est FAIT ✅

- Catalogue complet (boutique + filtres/tri/recherche, fiche produit), seed.
- **Panier** (zustand persistant, totaux testés) + page `/panier` (checkout invité prévu).
- **Comptes** : auth (connexion/inscription/déconnexion), mon compte + commandes, **checkout invité** (compte optionnel).
- **Espace PRO** : landing, formulaire de demande, validation admin → rôle pro, **prix pro appliqués partout**.
- **Back-office Admin complet** : dashboard, CRUD produits/variantes/stock, gestion commandes + statuts,
  validation demandes PRO, réglages (remise %, port, infos magasin).
- **Assistant IA** (`/api/assistant` + widget flottant) qui connaît produits/stocks — **nécessite `ANTHROPIC_API_KEY`**
  (sinon message de repli). `src/lib/assistant/`.
- **Fiche produit conversion** (équiv. apps Shopify, natif) : avis (note/étoiles/liste/formulaire), buy box
  (quantité, urgence stock, prix pro, **barre livraison offerte**, réassurance), **CTA sticky** au scroll,
  bénéfices, accordéons, **cross-sell** « Complétez votre routine ». Composants dans `src/components/shop/product/`.
- **SEO** : sitemap, robots, metadata par page, JSON-LD produit (+ AggregateRating).
- **Design** bold sport + logo + photos produit (800×800 uniformes) + animations + hello bar.
- **Déployé** sur Netlify, auto-deploy actif. ~40 tests verts, build/lint/typecheck OK, 0 alerte sécurité Supabase.

---

## 8. Ce qui RESTE À FAIRE 🚧

1. **PAIEMENT (Plan 3 — priorité business)** : `createOrder` (Server Action, recalcul serveur des totaux),
   **Stripe Checkout** + webhook `/api/stripe/webhook` (idempotent, décrément stock), page `/checkout`, **emails**
   transactionnels (Resend). Le bouton « Passer la commande » du panier est **désactivé** en attendant.
   Nécessite : `SUPABASE_SERVICE_ROLE_KEY` + compte **Stripe** (test) + compte **Resend**. Détaillé dans
   `docs/superpowers/plans/2026-06-02-03-panier-checkout.md`.
2. ~~Upload d'images produit depuis l'admin~~ ✅ FAIT : `ImageUploader` (upload Supabase Storage bucket
   `product-images` → `setProductImage`), section Photo dans `/admin/produits/[id]`. (Les anciennes photos
   seedées restent en `public/produits/`; les nouvelles vont dans Storage.)
3. **Logos de marques** : remplacer les plaques texte (bande marquee accueil) par les vrais logos → demander les
   FICHIERS au client (les API de logos sont HS sans clé : Clearbit déprécié, logo.dev/Brandfetch = clé requise).
4. **Galerie multi-images** par produit (actuellement 1 image).
5. **Photos** pour `superpump-max` et `shilajit` (placeholder en attendant).
6. **Notification email** à Alexandre lors d'une demande PRO + email d'approbation (Resend, avec Plan 3).
7. **Rattachement commande invité → compte** (claim) — nécessite service role.
8. **Config Supabase Auth prod** : Site URL + Redirect URLs = `https://dietzone.netlify.app` (utile pour emails ;
   le login mot de passe marche déjà sans).
9. Confirmer **marques/prix** des 2 derniers produits (Moons Truck→Zoomad Labs 39,90€, Mass Extreme 2500→Mutant
   59,90€ : déduits, à valider par le client).
10. **Phases futures** : codes promo, fidélité, relance panier abandonné, blog SEO/GEO ; sync stock magasin (POS) ;
    livraison Métropole, paiement en plusieurs fois, multi-niveaux PRO, multi-langue.

---

## 9. Comment faire les tâches courantes (recettes)

- **Ajouter une photo produit** : `sips -s format jpeg -s formatOptions 78 --resampleWidth 800 SOURCE --out public/produits/<slug>.jpg`
  puis `sips -c 800 800 public/produits/<slug>.jpg --out public/produits/<slug>.jpg` (carré 800×800). Puis
  `update products set images = array['/produits/<slug>.jpg'] where slug='<slug>';` via MCP `execute_sql`. Commit+push.
- **Créer un produit** : insert dans `products` (avec brand_id, category_id, images) + `product_variants` (price_cents,
  stock) + `product_objectives`, via MCP `execute_sql`. Créer la marque si besoin (`brands`).
- **Déployer** : `git push origin main` → Netlify build auto (~40-90 s). Vérifier en live par `curl`.
  ⚠️ Les pages dynamiques (boutique/fiche) montrent les changements BDD **instantanément** (SSR lit Supabase),
  mais les **fichiers statiques** (images public/) n'apparaissent qu'une fois le **build Netlify terminé**.
- **Modifier une migration** : `apply_migration` via MCP + écrire le fichier dans `supabase/migrations/`. Puis
  `get_advisors` (security) pour vérifier (0 alerte attendu ; figer `search_path` sur les fonctions).

### Pièges environnement (IMPORTANT)
- Shell = **zsh** : pas de `declare -A` (tableaux assoc bash), pas de word-splitting auto sur `$var` non quoté
  (utiliser des listes littérales dans les boucles `for`).
- **`git push`** : `http.postBuffer` réglé à 524288000 (sinon HTTP 400 sur push d'images). Déjà configuré localement.
- **MCP Netlify** instable en écriture (timeouts) — réessayer, les writes finissent par passer ; vérifier l'état
  réel par une lecture avant de re-tenter (éviter les doublons). Le deploy passe par une commande
  `npx @netlify/mcp@latest --site-id ... --proxy-path ...` retournée par l'outil `deploy-site` (mais l'auto-deploy
  GitHub rend ça inutile maintenant).
- **Ne jamais retaper de longues clés à la main** (risque de corruption — un Ф cyrillique s'était glissé dans la
  clé Supabase). Copier-coller exact ou utiliser des valeurs courtes.

---

## 10. Méthodologie & docs

- **Superpowers** (skills) : flux brainstorming → writing-plans → executing-plans → finishing-a-development-branch.
  Worktrees via EnterWorktree (le projet a été mergé sur main, plus de worktree actif).
- **ui-ux-pro-max** (skill design) : CLI réparé dans `~/.claude/skills/ui-ux-pro-max` (symlinks data/scripts
  remplacés par de vrais dossiers). Reco retenue : Barlow Condensed (sport), rouge/sombre, blocs contrastés.
- **Spec** : `docs/superpowers/specs/2026-06-02-dietzone-mvp-design.md`.
- **Plans** (6 + conventions) : `docs/superpowers/plans/` — voir `README.md` et `2026-06-02-00-conventions.md`.
- **Déploiement** : `docs/deploy-netlify.md`. **Comptes test** : `docs/test-accounts.md`.

---

## 11. Idées & décisions notables

- WhatsApp remplacé par un **assistant IA** connaissant produits/stocks (demande du client).
- **Hello bar** rotative avec CTA incitatif (port offert / -20 % PRO / retrait gratuit).
- Direction design **sombre + bold + rouge** (pas le "premium clair" initial) — demande explicite du client pour
  coller à l'univers nutrition sportive.
- Photos produit **carrées 800×800** uniformes + cartes `object-cover` (demande du client : tailles homogènes).
- Fiche produit = features "apps Shopify payantes" recodées nativement (zéro abonnement).
- Le client fournit les vrais visuels (logo, photos produit) en local → on optimise et on intègre.
