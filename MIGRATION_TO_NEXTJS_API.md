# 🚀 Migration Backend → Frontend Next.js (Vercel)

## ✅ CE QUI A ÉTÉ FAIT

### 1. Migration de l'Architecture
Le backend Express a été complètement intégré dans Next.js en utilisant les **API Routes**.

```
AVANT:
├── app/ (Frontend Next.js - Port 3000)
└── server/ (Backend Express - Port 5000)

APRÈS:
└── app/ (Frontend + Backend Next.js - Port 3000)
    ├── app/api/ (API Routes = Backend)
    ├── lib/ (Services, DB, Auth)
    └── src/ (Components, Hooks)
```

### 2. Fichiers Créés/Modifiés

#### API Routes (Backend dans Next.js)
- ✅ `app/app/api/auth/[...all]/route.ts` - Authentification Better Auth
- ✅ `app/app/api/health/route.ts` - Health check
- ✅ `app/app/api/sales/route.ts` - CRUD produits
- ✅ `app/app/api/sales/[id]/route.ts` - Opérations sur produit unique
- ✅ `app/app/api/supplier-orders/route.ts` - Commandes fournisseurs

#### Infrastructure
- ✅ `app/lib/auth.ts` - Configuration Better Auth
- ✅ `app/lib/db/index.ts` - Connexion MongoDB (optimisée serverless)
- ✅ `app/lib/db/models/` - Modèles Mongoose (copiés depuis server/)
- ✅ `app/lib/services/` - Services métier (copiés depuis server/)

#### Configuration
- ✅ `app/package.json` - Ajout dépendances: mongodb, mongoose, zod, dotenv
- ✅ `app/src/lib/auth-client.ts` - Utilise `window.location.origin` (même domaine)
- ✅ `app/.env.local.example` - Variables d'environnement
- ✅ `vercel.json` - Configuration Vercel

---

## 📝 ÉTAPES POUR DÉPLOYER

### 1️⃣ Installer les nouvelles dépendances

```bash
cd app
npm install
```

### 2️⃣ Créer le fichier `.env.local`

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` :
```env
MONGODB_USERNAME=databaseApp
MONGODB_PASSWORD=Jumarin49
MONGODB_HOST=vintedatabase.laep9wk.mongodb.net
MONGODB_DATABASE_NAME=Vintedatabase
MONGODB_PARAMS=retryWrites=true&w=majority
MONGODB_APP_NAME=Vintedatabase

# Générer une nouvelle clé secrète
BETTER_AUTH_SECRET=<générer-avec-commande-ci-dessous>
BETTER_AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

**Générer la clé secrète** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3️⃣ Tester localement

```bash
cd app
npm run dev
```

Tester :
- ✅ `http://localhost:3000/api/health` → `{"status":"ok"}`
- ✅ `http://localhost:3000/auth/register` → Inscription
- ✅ `http://localhost:3000/auth/login` → Connexion
- ✅ `http://localhost:3000/dashboard` → Dashboard

### 4️⃣ Configurer Vercel

#### Variables d'environnement Vercel :

Aller sur **Vercel Dashboard** → Projet → **Settings** → **Environment Variables**

```env
MONGODB_USERNAME=databaseApp
MONGODB_PASSWORD=Jumarin49
MONGODB_HOST=vintedatabase.laep9wk.mongodb.net
MONGODB_DATABASE_NAME=Vintedatabase
MONGODB_PARAMS=retryWrites=true&w=majority
MONGODB_APP_NAME=Vintedatabase

BETTER_AUTH_SECRET=<votre-cle-generee>
BETTER_AUTH_URL=https://all-in-one-business-hub.vercel.app
NEXTAUTH_URL=https://all-in-one-business-hub.vercel.app
```

⚠️ **IMPORTANT** : 
- `BETTER_AUTH_URL` et `NEXTAUTH_URL` doivent pointer vers l'URL de production Vercel
- **NE PLUS DÉFINIR** `NEXT_PUBLIC_API_URL` (on utilise le même domaine maintenant)

#### Configuration Build Vercel :

- **Framework Preset** : Next.js
- **Root Directory** : `app`
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### 5️⃣ Déployer

```bash
# Commit et push
git add .
git commit -m "Migrate backend to Next.js API routes"
git push origin main
```

Vercel déploiera automatiquement.

---

## 🎯 AVANTAGES DE CETTE ARCHITECTURE

### ✅ Un seul déploiement
- Frontend + Backend sur **le même domaine**
- Plus besoin de CORS
- Plus besoin de gérer deux URLs différentes

### ✅ Pas de problème de CORS
```javascript
// AVANT: Deux domaines différents = CORS obligatoire
Frontend (vercel.app) → Backend (railway.app) ❌

// APRÈS: Même domaine = pas de CORS
Frontend (vercel.app) → /api routes (vercel.app) ✅
```

### ✅ Simplicité
- Une seule plateforme à gérer (Vercel)
- Un seul set de variables d'environnement
- Un seul domaine pour tout

### ✅ Performance
- Latence réduite (même datacenter)
- Pas de requêtes cross-domain
- Optimisations Vercel Edge

---

## 🔄 COMPARAISON AVANT/APRÈS

### Authentification
```typescript
// AVANT
authClient.baseURL = "http://localhost:5000" // Backend séparé

// APRÈS  
authClient.baseURL = window.location.origin // Même domaine ✅
```

### API Calls
```typescript
// AVANT
fetch('http://localhost:5000/api/sales') // Backend séparé

// APRÈS
fetch('/api/sales') // Route relative ✅
```

---

## 🧪 TESTS À FAIRE

### Local (http://localhost:3000)
- [ ] Health check : `curl http://localhost:3000/api/health`
- [ ] Inscription : Page `/auth/register`
- [ ] Connexion : Page `/auth/login`
- [ ] Dashboard : Page `/dashboard` (après login)
- [ ] Créer une vente : Dashboard → Ventes
- [ ] Créer une commande : Dashboard → Commandes

### Production (https://all-in-one-business-hub.vercel.app)
- [ ] Health check : `curl https://all-in-one-business-hub.vercel.app/api/health`
- [ ] Inscription : Page `/auth/register`
- [ ] Connexion : Page `/auth/login`
- [ ] Dashboard : Page `/dashboard` (après login)
- [ ] Console navigateur : **aucune erreur CORS** ✅
- [ ] Session persistante après rafraîchissement

---

## 🐛 DÉPANNAGE

### Erreur : `Module not found: mongodb`
```bash
cd app
npm install mongodb mongoose dotenv zod
```

### Erreur : `Cannot find module '@/lib/auth'`
Vérifier que `tsconfig.json` a bien :
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*", "./lib/*", "./app/*"]
    }
  }
}
```

### Erreur : `MongoServerError: bad auth`
Vérifier que les credentials MongoDB dans `.env.local` ou Vercel sont corrects.

### Les API routes ne fonctionnent pas en local
Redémarrer le serveur de développement :
```bash
cd app
npm run dev
```

---

## 📊 RÉSULTAT FINAL

```
┌───────────────────────────────────────┐
│  Vercel (all-in-one-business-hub)    │
│                                       │
│  ┌─────────────┐   ┌──────────────┐ │
│  │  Frontend   │   │  API Routes  │ │
│  │  Next.js    │──→│  (Backend)   │ │
│  │  /dashboard │   │  /api/*      │ │
│  └─────────────┘   └──────┬───────┘ │
└───────────────────────────┼──────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  MongoDB Atlas   │
                  │  vintedatabase   │
                  └──────────────────┘
```

**Tout tourne sur Vercel. Un seul domaine. Zéro CORS. 🚀**
