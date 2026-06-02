# DietZone

Boutique en ligne de nutrition sportive — DietZone, St-Denis (La Réunion).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS · shadcn/ui · Supabase (Postgres, Auth, Storage) · Stripe · Vitest.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis remplir les clés (Supabase, Stripe, Resend)
npm run dev                  # http://localhost:3000
```

## Scripts

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm test` | Tests (Vitest) |
| `npm run typecheck` | Vérification des types (tsc) |
| `npm run lint` | Lint (ESLint) |

## Documentation

- Spec : [`docs/superpowers/specs/`](docs/superpowers/specs/)
- Plans d'implémentation : [`docs/superpowers/plans/`](docs/superpowers/plans/)
