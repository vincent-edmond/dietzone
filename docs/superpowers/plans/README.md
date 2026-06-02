# DietZone — Plans d'implémentation (v1 : Phases 1+2)

Spec source : [`../specs/2026-06-02-dietzone-mvp-design.md`](../specs/2026-06-02-dietzone-mvp-design.md)

> **Lire en premier :** [`2026-06-02-00-conventions.md`](2026-06-02-00-conventions.md) — contrat technique partagé (stack, money en centimes, types, enums, env). Réutilisé par tous les plans.

## Ordre d'exécution

| # | Plan | Livrable | Spec couvert |
|---|------|----------|--------------|
| 1 | [Fondation](2026-06-02-01-fondation.md) | App Next.js+Supabase qui build/test/lint vert | §7 |
| 2 | [Catalogue & BDD](2026-06-02-02-catalogue.md) | Schéma + RLS + seed, boutique + filtres + fiche produit | §5, §4.1 |
| 3 | [Panier & Checkout](2026-06-02-03-panier-checkout.md) | Panier, checkout invité, Stripe + webhook, retrait, emails | §4.1, §6 |
| 4 | [Comptes & PRO](2026-06-02-04-comptes-pro.md) | Auth, compte, demande PRO, prix pro partout | §3, §4.2 |
| 5 | [Admin](2026-06-02-05-admin.md) | Back-office complet d'Alexandre | §4.3 |
| 6 | [Contenu, SEO & polish](2026-06-02-06-contenu-seo-polish.md) | Pages légales, accueil conversion, WhatsApp, avis, SEO | §8, §1, §2 |

Chaque plan produit un logiciel fonctionnel et testable, et s'appuie sur le précédent.

## Méthode d'exécution

Pour chaque plan, utiliser le skill **`subagent-driven-development`** (recommandé) ou **`executing-plans`**. TDD, commits fréquents, qualité verte avant de clore chaque tâche.

## Actions humaines requises (avant/pendant le build)

- **Avant Plan 2** : créer projet **Supabase**, compte **Stripe** (mode test), compte **Resend** ; remplir `.env.local`.
- **Plan 5** : promouvoir le compte d'Alexandre en `admin` (SQL `update profiles set role='admin' where email=...`).
- **Plan 6** : fournir le **contenu juridique** (CGV, mentions légales — spécificités DOM) et le **logo DIETZONE** en HD/vectoriel.
- **Avant prod** : passer Stripe en mode live, définir le **domaine** (ex. `dietzone.re`), créer le compte Stripe au nom de DietZone (IBAN).
