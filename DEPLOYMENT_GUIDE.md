# 🚀 Guide de Déploiement - All-in-One Business Hub

## 📋 Prérequis

- Frontend déployé sur **Vercel** : `https://all-in-one-business-hub.vercel.app`
- Backend à déployer sur **Railway** / **Render** / **Fly.io**
- Base de données MongoDB (Atlas recommandé)

---

## 🔧 Étape 1 : Déployer le Backend

### Option A : Railway (recommandé)

1. **Créer un compte** sur [Railway.app](https://railway.app)
2. **Nouveau projet** → "Deploy from GitHub repo"
3. **Sélectionner** votre repo
4. **Root Directory** : `/server`
5. **Build Command** : `npm install && npm run build`
6. **Start Command** : `npm start`

### Option B : Render

1. **Créer un compte** sur [Render.com](https://render.com)
2. **New Web Service** → Connecter votre repo
3. **Root Directory** : `server`
4. **Build Command** : `npm install && npm run build`
5. **Start Command** : `npm start`

### Option C : Fly.io

```bash
cd server
fly launch
fly deploy
```

---

## 🔐 Étape 2 : Variables d'Environnement Backend

Une fois le backend déployé, configurez ces variables :

```env
# Port (généralement auto-configuré par la plateforme)
PORT=5000

# Environnement
NODE_ENV=production

# MongoDB Connection
MONGODB_USERNAME=votre-username
MONGODB_PASSWORD=votre-password
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE_NAME=business-hub
MONGODB_PARAMS=retryWrites=true&w=majority&appName=BusinessHub
MONGODB_APP_NAME=BusinessHub

# Better Auth Secret (générer une clé secrète forte)
BETTER_AUTH_SECRET=generer-une-cle-secrete-forte-32-caracteres-minimum

# URL du backend (l'URL que Railway/Render vous donne)
BETTER_AUTH_URL=https://votre-backend.railway.app

# CORS Origin (l'URL de votre frontend Vercel)
CORS_ORIGIN=https://all-in-one-business-hub.vercel.app
```

### 🔑 Générer une clé secrète

```bash
# Dans votre terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 Étape 3 : Variables d'Environnement Frontend (Vercel)

1. Aller sur **Vercel Dashboard**
2. Projet → **Settings** → **Environment Variables**
3. Ajouter :

```env
NEXT_PUBLIC_API_URL=https://votre-backend.railway.app
```

⚠️ **Important** : 
- Le préfixe `NEXT_PUBLIC_` est obligatoire pour exposer la variable au client
- Remplacez `votre-backend.railway.app` par l'URL réelle de votre backend

4. **Redéployer** le frontend : Settings → Deployments → Redeploy

---

## 🧪 Étape 4 : Vérification

### Backend
```bash
# Tester l'endpoint de santé
curl https://votre-backend.railway.app/api/health

# Devrait retourner :
# {"status":"ok","timestamp":"..."}
```

### Frontend
1. Ouvrir `https://all-in-one-business-hub.vercel.app`
2. Aller sur `/auth/register`
3. Créer un compte
4. Vérifier qu'il n'y a **plus d'erreurs CORS** dans la console

---

## 🐛 Dépannage

### Erreur : `ERR_FAILED` / `localhost:5000`
**Cause** : Frontend essaie de se connecter à localhost  
**Solution** : Vérifier que `NEXT_PUBLIC_API_URL` est bien configurée dans Vercel

### Erreur : `CORS policy: No 'Access-Control-Allow-Origin'`
**Cause** : Backend n'autorise pas l'origine du frontend  
**Solution** : Vérifier que `CORS_ORIGIN` dans le backend correspond à l'URL Vercel exacte

### Erreur : `MongoNetworkError`
**Cause** : Backend ne peut pas se connecter à MongoDB  
**Solution** : Vérifier les credentials MongoDB et whitelist l'IP `0.0.0.0/0` dans MongoDB Atlas

### Erreur : `401 Unauthorized`
**Cause** : Session auth non persistée (cookies)  
**Solution** : Vérifier que `credentials: 'include'` est bien présent dans `auth-client.ts`

---

## 📊 Architecture de Production

```
┌─────────────────────┐
│  Vercel (Frontend)  │
│  Next.js App        │
│  Port: 443 (HTTPS)  │
└──────────┬──────────┘
           │
           │ NEXT_PUBLIC_API_URL
           ▼
┌─────────────────────┐
│ Railway (Backend)   │
│ Express + Auth      │
│ Port: 5000          │
└──────────┬──────────┘
           │
           │ MONGODB_HOST
           ▼
┌─────────────────────┐
│ MongoDB Atlas       │
│ Database Cluster    │
└─────────────────────┘
```

---

## ✅ Checklist Finale

- [ ] Backend déployé et accessible
- [ ] MongoDB Atlas configuré et connecté
- [ ] Variables d'env backend configurées
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée sur Vercel
- [ ] Frontend redéployé après ajout de la variable
- [ ] Test inscription/connexion fonctionne
- [ ] Aucune erreur CORS dans la console
- [ ] Session persiste après rafraîchissement

---

## 🔒 Sécurité

- ✅ `BETTER_AUTH_SECRET` doit être unique et secret
- ✅ `CORS_ORIGIN` doit contenir **uniquement** l'URL du frontend (pas de wildcard `*`)
- ✅ MongoDB credentials en variables d'env (jamais dans le code)
- ✅ HTTPS activé sur frontend et backend

---

## 📚 Ressources

- [Railway Docs](https://docs.railway.app/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Better Auth Docs](https://better-auth.com/docs)
