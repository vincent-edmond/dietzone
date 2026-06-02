# DietZone — Spec de conception (MVP v1 : Phases 1+2)

- **Date** : 2026-06-02
- **Auteur** : Vincent Edmond (avec Claude)
- **Client** : Alexandre PAYET — DietZone, magasin de nutrition sportive, St-Denis (La Réunion)
- **Statut** : Validé pour rédaction du plan d'implémentation

---

## 1. Contexte & objectif

DietZone est aujourd'hui un **magasin physique** de nutrition sportive à St-Denis (6b rue Léopauld Rambaud), avec une seule présence en ligne (Instagram [@dietzonereunion](https://instagram.com/dietzonereunion), ~785 abonnés). Le propriétaire, **Alexandre PAYET**, se positionne comme **« Expert en nutrition sportive »**.

**Objectif** : créer une **boutique en ligne orientée vente/conversion** qui place DietZone en tête du marché réunionnais, avec trois espaces :

1. **Boutique grand public** — n'importe qui peut commander.
2. **Espace Admin** — Alexandre gère produits, stock et commandes.
3. **Espace PRO (B2B)** — les partenaires (coachs, salles, revendeurs) accèdent à des **tarifs pro** et commandent.

**Hypothèse de travail** : Alexandre gère son stock et l'ajout/retrait de produits depuis la plateforme. À terme (Phase 4), il connectera le stock du magasin physique.

### Concurrents analysés

| Concurrent | Forces | Faiblesses exploitables |
|---|---|---|
| **Discount Nutrition** (leader local) | Réassurance massive (4.9★, +20 000 clients), 40+ marques, 3000+ réfs, port offert dès 44,99€, livraison 24-48h, fidélité, navigation par objectif | Surchargé, hiérarchie visuelle confuse, **CTA d'achat noyés**, pas d'avis produit, pas de chat |
| **Nutrisport** | Conforme anti-dopage, paiement 3x/4x | Design fade/générique, zéro social proof, pas de photos lifestyle, ruptures sans alternative |
| **prohcd-nutrition.com** | — | Site no-code (Hostinger Horizons), contenu JS-only, **mauvais SEO**, fragile |
| **Elite Diet 974** | Fort réseau physique (7 magasins) | Présence en ligne perfectible |

### Axes de différenciation retenus

1. **Design premium & épuré** (l'inverse du fouillis de Discount) avec **CTA d'achat ultra-visibles**.
2. **Achat guidé par objectif**, version élégante (Prise de masse / Sèche / Énergie / Santé).
3. **Confiance locale & humaine** : Alexandre en avant, **retrait magasin St-Denis**, livraison express île, **support WhatsApp**.
4. **Avis produits réels** + badges (authenticité, traçabilité, conforme anti-dopage).
5. **Espace PRO B2B en ligne** — qu'aucun concurrent n'offre.
6. **Site rapide (Next.js)** + base SEO solide (blog SEO/GEO en Phase 3).

> Note social proof : le compte Instagram étant modeste (~785 abonnés), **on ne met pas en avant le nombre d'abonnés**. La confiance se construit via avis Google, expertise d'Alexandre, marques premium et ancrage local.

---

## 2. Périmètre

### Dans le v1 (Phases 1+2)
- Catalogue produits (catégories, marques, objectifs, variantes saveur/taille, stock).
- Recherche, filtres et tri.
- Panier + **checkout invité** (sans compte obligatoire).
- Paiements : **CB via Stripe Checkout** + **paiement au retrait** (click & collect).
- Livraison **La Réunion** + **retrait magasin** (click & collect).
- Comptes clients (optionnels) + historique de commandes.
- **Espace PRO** : demande en ligne → validation par Alexandre → **remise globale en %** appliquée.
- **Espace Admin** : produits, stock, commandes, demandes PRO, réglages.
- Pages légales/info (CGV, mentions légales, livraison & retours, contact, à propos, FAQ).
- Responsive + SEO de base.

### Hors v1 (phases ultérieures)
- **Phase 3** : codes promo, programme fidélité, relance panier abandonné, cross-sell/upsell, analytics avancée, blog SEO/GEO.
- **Phase 4** : synchronisation du stock magasin physique (POS/import, temps réel).
- **Plus tard** : livraison Métropole, paiement en plusieurs fois (Alma/Klarna), virement bancaire B2B, plusieurs niveaux de prix pro, multi-langue.

### YAGNI (volontairement exclu pour l'instant)
- Plusieurs niveaux de tarifs pro (un seul % global suffit).
- Multi-entrepôt, multi-devise (Réunion = EUR uniquement).
- App mobile native (web responsive d'abord).

---

## 3. Rôles & accès

| Rôle | Description | Accès |
|---|---|---|
| **Visiteur** | Non connecté | Boutique, prix public, **checkout invité** |
| **Client** | Compte créé (optionnel) | + historique de commandes, adresses |
| **Pro** | Client dont la demande PRO est validée | + **prix pro** (remise globale %) partout, **connexion obligatoire** |
| **Admin** | Alexandre | Back-office complet |

- **Checkout invité** activé pour le grand public ; création de compte **proposée après** la commande (1 clic, mot de passe à définir).
- **Espace PRO** : compte **obligatoire** ; un invité voit toujours le **prix public**.

---

## 4. Parcours & flux

### 4.1 Achat (grand public)
1. Parcours catalogue → fiche produit → **Ajouter au panier**.
2. Panier → **Checkout** : email, mode (**livraison Réunion** ou **retrait magasin**), adresse si livraison, **paiement**.
3. Paiement :
   - **CB** → redirection **Stripe Checkout** → retour + **webhook Stripe** confirme le paiement → commande `payée`.
   - **Retrait magasin** → commande `à payer au retrait` (payée sur place).
4. **Email de confirmation** au client.
5. Décrément du stock sur commande payée (CB) ou à la validation (retrait — voir §6).
6. Alexandre traite la commande depuis l'admin (statuts).
7. Proposition optionnelle de création de compte.

### 4.2 Devenir PRO
1. Page `/pro` (avantages) → **formulaire** : nom entreprise, SIRET, téléphone, message.
2. Création d'une **demande PRO** (`pending`) + compte client.
3. Alexandre **valide/refuse** depuis l'admin.
4. Si validé → rôle `pro` → **prix pro = prix public × (1 − remise%)** appliqué partout (catalogue, fiche, panier, checkout).

### 4.3 Gestion admin (Alexandre)
- **Produits** : créer/éditer, variantes (saveur/taille, stock, prix), photos, catégorie/marque/objectif, publier/dépublier.
- **Commandes** : liste + détail, changement de **statut**, marquer payé (retrait).
- **Demandes PRO** : valider/refuser.
- **Réglages** : **% remise PRO**, frais de port, seuil port offert, infos magasin.

---

## 5. Modèle de données (Supabase / Postgres)

> Tous les montants en **euros, TTC**. Sécurité par **RLS** (Row Level Security) : lecture publique des produits actifs ; écriture réservée admin ; commandes accessibles à leur propriétaire ou admin.

- **profiles** : `id` (→ `auth.users`), `email`, `full_name`, `phone`, `role` (`customer` | `pro` | `admin`), `created_at`.
- **pro_applications** : `id`, `user_id`, `company_name`, `siret`, `phone`, `message`, `status` (`pending` | `approved` | `rejected`), `created_at`, `reviewed_at`.
- **categories** : `id`, `name`, `slug`, `parent_id?`, `position`.
- **brands** : `id`, `name`, `slug`, `logo_url?`.
- **objectives** : `id`, `name`, `slug` (Prise de masse, Sèche, Énergie, Santé) — taggable sur produit.
- **products** : `id`, `name`, `slug`, `description`, `brand_id`, `category_id`, `is_active`, `images[]`, `created_at`. (Liens objectifs via table de jonction `product_objectives`.)
- **product_variants** : `id`, `product_id`, `label` (ex. « Chocolat 2KG »), `sku`, `price` (prix public TTC), `stock_qty`, `is_active`.
- **product_objectives** : `product_id`, `objective_id` (jonction n-n).
- **orders** : `id`, `user_id?` (null si invité), `email`, `status` (`pending` | `paid` | `to_pay_pickup` | `preparing` | `ready` | `shipped` | `picked_up` | `cancelled`), `fulfillment` (`delivery` | `pickup`), `payment_method` (`card` | `pickup`), `subtotal`, `shipping_fee`, `total`, `shipping_address?` (jsonb), `is_pro_order` (bool), `created_at`.
- **order_items** : `id`, `order_id`, `product_id`, `variant_id`, `name_snapshot`, `unit_price`, `qty`. (Snapshot du nom/prix au moment de l'achat.)
- **reviews** : `id`, `product_id`, `user_id`, `rating` (1-5), `comment`, `status` (`pending` | `approved`), `created_at`.
- **settings** (singleton) : `pro_discount_percent`, `free_shipping_threshold`, `shipping_fee`, `store_name`, `store_address`, `store_phone`, `store_hours`, `whatsapp_number`.

**Panier** : géré côté client (état local / cookie) ; matérialisé en `order` seulement au checkout.

**Calcul prix pro** : à l'affichage et au checkout, si `role = pro` → `prix_affiché = round(variant.price × (1 − settings.pro_discount_percent/100))`. Le prix pro n'est jamais stocké en dur (toujours dérivé du % global).

---

## 6. Règles métier

- **Stock** : décrément à la **commande payée** (CB confirmée par webhook). Pour le **retrait** (paiement sur place), le stock est réservé/décrémenté à la **création de la commande** pour éviter la survente, puis libéré si la commande est `cancelled`.
- **Frais de port** : `shipping_fee` fixe pour livraison Réunion, **offerts au-delà de `free_shipping_threshold`** ; **0€** pour le retrait magasin.
- **TVA** : prix saisis et affichés **TTC** (TVA Réunion 8,5 %). Pas de calcul de TVA dynamique au v1 (le prix saisi est le prix final).
- **Disponibilité** : un produit dont toutes les variantes sont à `stock_qty = 0` est affiché « En rupture » (pas d'ajout panier), mais reste visible (proposer alternative en Phase 3).
- **PRO** : la remise s'applique à tout le catalogue ; pas d'exclusions au v1.

---

## 7. Architecture technique

- **Framework** : **Next.js** (App Router, TypeScript), rendu hybride (SSR/SSG) pour SEO + perf.
- **Hébergement** : **Vercel** (front + routes API/serverless).
- **UI** : **Tailwind CSS** + **shadcn/ui** (composants accessibles Radix). Skills `ui-ux-pro-max` / `ui-styling` pour le design.
- **Backend / Données** : **Supabase** — Postgres, **Auth** (email/mot de passe), **Storage** (images produits), **RLS** pour la sécurité.
- **Paiement** : **Stripe Checkout** (hébergé, conforme PCI) + **webhooks** pour confirmer le paiement et déclencher la fulfillment. Devise EUR.
- **Emails transactionnels** : service type **Resend** (confirmation de commande, notification demande PRO). À confirmer au moment du plan.
- **Sécurité** : RLS Supabase, rôles vérifiés côté serveur pour l'admin et les prix pro, secrets Stripe côté serveur uniquement.

### Découpage en modules (responsabilités isolées)
- `catalog` — produits, catégories, marques, objectifs, variantes, recherche/filtres.
- `cart` — état panier client, calcul des totaux (avec prix pro).
- `checkout` — formulaire, modes de livraison, intégration Stripe, création de commande.
- `account` — auth, profil, commandes, adresses.
- `pro` — landing, formulaire de demande, logique de tarification pro.
- `admin` — CRUD produits/stock, gestion commandes, demandes PRO, réglages.
- `content` — pages statiques (à propos, contact, légal, FAQ).

Chaque module expose une interface claire (composants + fonctions data) et est testable indépendamment.

---

## 8. Direction visuelle

Calée sur la marque (enseigne DIETZONE **rouge / blanc / bleu**, vibe strongman/performance) et la stratégie anti-concurrents :

- **Base** : claire et aérée (blanc / gris très clair) → tranche avec les concurrents sombres/chargés, inspire le premium et la confiance.
- **Accent primaire** : **rouge vif** (énergie) — réservé aux **CTA** (« Ajouter au panier », boutons d'action) pour une visibilité maximale.
- **Secondaire** : **bleu marine** (sérieux, confiance, badges PRO).
- **Typographie** : titres bold/sportifs, corps de texte très lisible.
- **Imagerie** : grandes photos produits sur fond clair ; univers « objectif ».
- **Accessibilité** : contrastes WCAG AA, navigation clavier (composants shadcn/Radix).

---

## 9. Critères de succès (v1)

- Un visiteur peut trouver un produit, l'ajouter au panier et **payer en CB sans créer de compte**, en quelques clics.
- Un visiteur peut choisir le **retrait magasin** et payer sur place.
- Un partenaire peut **demander un accès PRO**, être validé, et voir les **prix pro** partout.
- Alexandre peut **ajouter/éditer un produit**, gérer son **stock**, et **traiter les commandes** sans aide technique.
- Le site est **responsive**, rapide, et propre côté SEO de base (titres, métas, URLs slugifiées).
- Design nettement plus **premium et lisible** que les concurrents, avec CTA évidents.

---

## 10. Risques & points à valider

- **Emails transactionnels** : choix du fournisseur (Resend vs autre) — à trancher au plan.
- **Données catalogue** : au lancement, partir d'un **petit catalogue de démonstration** (quelques produits réels saisis), Alexandre complète ensuite via l'admin. (À confirmer.)
- **Logo/charte exacte** : récupérer le logo DIETZONE en vectoriel/HD auprès d'Alexandre.
- **Mentions légales / CGV** : contenu juridique à fournir/valider (spécificités DOM).
- **Compte Stripe** : à créer au nom de DietZone (IBAN, vérifications).
- **Domaine** : à définir (ex. `dietzone.re`).
