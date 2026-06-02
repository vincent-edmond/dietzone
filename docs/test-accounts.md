# Comptes de test — DietZone (projet Supabase `dietzone`)

> Comptes de démonstration sur la base de dev. Mot de passe commun : **`Test1234!`**

| Rôle | Email | Accès |
|------|-------|-------|
| 👤 Client | `client@example.com` | Boutique, panier, compte, commande invité/connecté |
| 💼 PRO | `pro@example.com` | Idem + **prix PRO remisés** affichés partout |
| 🔐 Admin | `admin@example.com` | Idem + back-office (espace `/admin` — construit au Plan 5) |

## Comment tester

1. Lancer `npm run dev` puis ouvrir http://localhost:3000
2. Se connecter via `/connexion` avec un des comptes ci-dessus
3. **Client** : navigue, ajoute au panier, voit les prix publics
4. **PRO** : voit les prix remisés (badge « PRO » + prix public barré) sur la boutique et les fiches produit
5. **Admin** : même chose ; le back-office arrivera au Plan 5

## Notes techniques

- Créés directement en base (`auth.users` + `auth.identities`, mot de passe bcrypt, email confirmé) pour éviter les emails de confirmation. Le profil (`public.profiles`) est créé par le trigger `handle_new_user`, puis le rôle est promu.
- La remise PRO globale est réglable dans `settings.pro_discount_percent` (20 % par défaut), bientôt depuis l'admin (Plan 5).
