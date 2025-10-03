# collector1 — Démo locale **opérationnelle** (Mac M3, 8 Go)

Fonctionnalités incluses :
- Vendeur : **création de compte**, **connexion**, **publication d’articles**.
- Acheteur : **création de compte**, **connexion**, **ajout au panier**, **paiement** (Stripe test), **confirmation**.
- Design **propre** (Tailwind) sur toutes les pages (auth, listing, détail, panier, checkout).

## 1) Prérequis
- **Node.js 20** (recommandé via `brew install node@20`)
- **pnpm** (`corepack enable && corepack prepare pnpm@9 --activate`) ou `npm`
- **Stripe CLI** (pour activer le webhook) : `brew install stripe/stripe-cli/stripe`

## 2) Installation
```bash
cd collector1
cp .env.example .env         # remplacez les clés Stripe test
pnpm install                 # ou npm install
pnpm db:push                 # crée la base SQLite (dev.db)
pnpm db:seed                 # crée des comptes et produits de démonstration
```

## 3) Lancer l’app
### A) Sans paiement réel (UI seulement)
Vous pouvez naviguer, publier, ajouter au panier. Le paiement redirige vers Stripe, mais l'état de commande sera mis à jour uniquement si le webhook est branché.

### B) Avec Stripe test **opérationnel** (recommandé)
1. Renseignez dans `.env` :
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (récupérée à l'étape 3 ci-dessous)
2. Démarrer l'app :
   ```bash
   pnpm dev
   # http://localhost:3000
   ```
3. Ouvrez un second terminal et démarrez le **webhook** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   # Copiez la valeur "Signing secret" et remplacez STRIPE_WEBHOOK_SECRET dans .env
   ```

## 4) Comptes de démo
- **Vendeur** : seller@example.com / **password123**
- **Acheteur** : buyer@example.com / **password123**
*(créés par `pnpm db:seed`)*

## 5) Parcours
- **Vendeur** : se connecter → onglet **Vendre** → formulaire **Publier un article** (image via URL).
- **Acheteur** : se connecter → page d'accueil → **sélection d'un produit** → **Ajouter au panier** → **Panier** → **Procéder au paiement** (saisir cartes tests Stripe, ex. `4242 4242 4242 4242`).

## 6) Scripts utiles
```bash
pnpm dev        # mode développement
pnpm build      # build prod
pnpm start      # démarrage prod
pnpm db:push    # appliquer le schéma Prisma
pnpm db:seed    # données de démo
```

## 7) Personnalisation rapide du design
- Tailwind : `src/app/globals.css`, `tailwind.config.ts`
- Composants : `src/components/*` (navbar, cards, formulaires)
- Couleurs marque : `brand` (cyan/sky) modifiables dans `tailwind.config.ts`

## 8) Notes
- Images : fournissez des URL (hébergement externe). Pour un vrai upload local, on peut ajouter un endpoint `multipart/form-data` écrivant dans `public/uploads`.
- Auth : NextAuth **Credentials** (email/mot de passe hashé `bcrypt`).

Bon run ✨
