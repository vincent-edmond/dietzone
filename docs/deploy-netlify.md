# Déploiement DietZone sur Netlify

Le site est un app Next.js 16 (App Router). La base de données reste sur **Supabase** (indépendante de l'hébergeur). Netlify ne fait tourner que le front/SSR.

## 1. Connecter le repo

Netlify → **Add new site → Import an existing project → GitHub** → sélectionner
`vincent-edmond/dietzone`, branche **`main`**.

Les réglages de build sont lus depuis `netlify.toml` (commande `npm run build`,
Node 20, plugin Next.js officiel). Rien à configurer manuellement.

## 2. Variables d'environnement (Netlify → Site settings → Environment variables)

Indispensables pour que le site fonctionne (navigation, comptes, admin) :

```
NEXT_PUBLIC_SUPABASE_URL=https://rqjuyyhwzznaihqtalod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon Supabase>   # publique, sans risque
NEXT_PUBLIC_SITE_URL=https://<domaine-netlify-ou-dietzone.re>
```

À ajouter plus tard (au fur et à mesure) :

```
SUPABASE_SERVICE_ROLE_KEY=   # Plan 3 paiement (Supabase > Settings > API)
STRIPE_SECRET_KEY=           # Plan 3
STRIPE_WEBHOOK_SECRET=       # Plan 3
RESEND_API_KEY=              # Plan 3 (emails)
ANTHROPIC_API_KEY=           # active l'assistant IA
```

> La clé `service_role` n'est PAS requise pour le premier déploiement : aucun code
> actuellement exécuté ne l'utilise (le paiement viendra au Plan 3).

## 3. Configurer Supabase Auth pour la prod

Supabase → **Authentication → URL Configuration** :
- **Site URL** : `https://<domaine-netlify-ou-dietzone.re>`
- **Redirect URLs** : ajouter la même URL (sinon connexion/inscription KO en prod).

## 4. Après le premier déploiement

- Mettre `NEXT_PUBLIC_SITE_URL` à l'URL réelle, puis **redeploy**.
- Brancher le domaine **`dietzone.re`** (Netlify → Domain management) — SSL auto.

## 5. Webhook Stripe (au Plan 3)

Dans Stripe, créer un webhook vers `https://<domaine>/api/stripe/webhook` et copier le
`STRIPE_WEBHOOK_SECRET` dans les variables Netlify.

## ⚠️ Compatibilité Next.js 16

Next 16 est très récent. Si le build Netlify échoue sur le runtime Next :
- vérifier les logs de build Netlify,
- repli possible : épingler une version de Next supportée par le plugin, ou déployer sur Vercel (support natif immédiat).
