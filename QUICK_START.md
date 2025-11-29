# 🚀 Démarrage Rapide - Architecture Unifiée

## 📌 Qu'est-ce qui a changé ?

**AVANT** : Frontend (port 3000) + Backend Express (port 5000) = 2 serveurs séparés  
**MAINTENANT** : Frontend + Backend Next.js = **1 seul serveur** (port 3000)

✅ Plus de problèmes CORS  
✅ Plus besoin de déployer le backend séparément  
✅ Tout tourne sur Vercel  

---

## 🏁 Démarrage Local (5 minutes)

### 1. Installer les dépendances

```bash
cd app
npm install
```

### 2. Variables d'environnement (déjà configurées dans `.env.local`)

Le fichier `.env.local` contient déjà vos credentials MongoDB.

### 3. Lancer le serveur

```bash
npm run dev
```

### 4. Tester

- 🏥 Health check : http://localhost:3000/api/health
- 📝 Inscription : http://localhost:3000/auth/register
- 🔐 Connexion : http://localhost:3000/auth/login
- 📊 Dashboard : http://localhost:3000/dashboard

---

## 🌐 Déploiement sur Vercel

### Option A : Via Dashboard Vercel (recommandé)

1. **Aller sur [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Settings → Environment Variables** - Ajouter :

```env
MONGODB_USERNAME=databaseApp
MONGODB_PASSWORD=Jumarin49
MONGODB_HOST=vintedatabase.laep9wk.mongodb.net
MONGODB_DATABASE_NAME=Vintedatabase
MONGODB_PARAMS=retryWrites=true&w=majority
MONGODB_APP_NAME=Vintedatabase

BETTER_AUTH_SECRET=<générer-avec-commande-ci-dessous>
BETTER_AUTH_URL=https://all-in-one-business-hub.vercel.app
NEXTAUTH_URL=https://all-in-one-business-hub.vercel.app
```

**Générer `BETTER_AUTH_SECRET`** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Settings → General** :
   - **Framework Preset** : Next.js
   - **Root Directory** : `app`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

4. **Redéployer** : Settings → Deployments → Redeploy

### Option B : Via CLI

```bash
# Depuis la racine du projet
./deploy-vercel.sh
```

---

## 🧪 Tests Post-Déploiement

### En local
```bash
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"..."}
```

### En production
```bash
curl https://all-in-one-business-hub.vercel.app/api/health
# → {"status":"ok","timestamp":"..."}
```

### Dans le navigateur
1. Ouvrir https://all-in-one-business-hub.vercel.app
2. S'inscrire sur `/auth/register`
3. Se connecter sur `/auth/login`
4. Accéder au `/dashboard`
5. **Console** : Aucune erreur CORS ✅

---

## 📂 Structure du Projet

```
app/
├── app/
│   ├── api/                    ← Backend (API Routes)
│   │   ├── auth/[...all]/      ← Better Auth
│   │   ├── health/             ← Health check
│   │   ├── sales/              ← Ventes CRUD
│   │   └── supplier-orders/    ← Commandes
│   ├── (protected)/            ← Routes protégées
│   │   └── dashboard/
│   └── auth/                   ← Pages auth
│       ├── login/
│       └── register/
├── lib/                        ← Backend logic
│   ├── auth.ts                 ← Better Auth config
│   ├── db/                     ← MongoDB connection
│   │   ├── index.ts
│   │   └── models/             ← Mongoose models
│   └── services/               ← Business logic
└── src/                        ← Frontend
    ├── components/
    ├── hooks/
    └── lib/
        └── auth-client.ts      ← Client auth
```

---

## 🔧 Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Port 3000)              │
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Frontend   │──→│  /api routes  │  │
│  │   Next.js    │   │   (Backend)   │  │
│  └──────────────┘   └───────┬───────┘  │
│                              │          │
└──────────────────────────────┼──────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │  MongoDB Atlas   │
                     │  vintedatabase   │
                     └──────────────────┘
```

**Un seul domaine. Zéro CORS. Tout sur Vercel. 🚀**

---

## ❓ FAQ

### Q : Dois-je déployer le dossier `server/` ?
**R :** Non ! Le backend a été migré dans `app/app/api/`. Le dossier `server/` n'est plus utilisé.

### Q : Dois-je configurer `NEXT_PUBLIC_API_URL` ?
**R :** Non ! L'application utilise maintenant le même domaine (`window.location.origin`).

### Q : Comment gérer les erreurs CORS ?
**R :** Il n'y a plus d'erreurs CORS car frontend et backend sont sur le même domaine.

### Q : Puis-je encore utiliser Railway/Render ?
**R :** Non, tout tourne maintenant sur Vercel. C'est plus simple et plus performant.

---

## 📚 Documentation Complète

- **Migration** : [MIGRATION_TO_NEXTJS_API.md](./MIGRATION_TO_NEXTJS_API.md)
- **Architecture** : [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **API** : [docs/API.md](./docs/API.md)

---

## 🆘 Besoin d'Aide ?

En cas de problème :
1. Vérifier les logs Vercel : Dashboard → Deployments → Logs
2. Vérifier la console navigateur (F12)
3. Consulter [MIGRATION_TO_NEXTJS_API.md](./MIGRATION_TO_NEXTJS_API.md) section Dépannage
