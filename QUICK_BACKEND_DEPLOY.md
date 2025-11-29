# 🚀 Déploiement Backend Express sur Railway (5 minutes)

## ⚡ Étapes rapides

### 1. Créer un compte Railway
👉 [railway.app](https://railway.app) → Sign up with GitHub

### 2. Nouveau projet
- **New Project** → **Deploy from GitHub repo**
- Sélectionner votre repo `all-in-one-business-hub-master`
- **Root Directory** : `/server` ⚠️ IMPORTANT

### 3. Configuration Railway

Dans **Settings** → **Build & Deploy** :
- **Root Directory** : `server`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`

### 4. Variables d'environnement Railway


### 5. Générer une clé secrète

```bash
# Dans votre terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans `BETTER_AUTH_SECRET`

### 6. Déployer

Railway déploie automatiquement. Une fois terminé, vous aurez une URL type :
```
https://votre-app.up.railway.app
```

### 7. Mettre à jour Vercel

**Vercel** → Environment Variables → **Ajouter/Modifier** :
```
NEXT_PUBLIC_API_URL=https://votre-app.up.railway.app
```

**Railway** → Variables → **Modifier** :
```
BETTER_AUTH_URL=https://votre-app.up.railway.app
```

### 8. Redéployer

- **Railway** : Redéploie automatiquement
- **Vercel** : Settings → Deployments → Redeploy (ou push un commit)

---

## ✅ Vérification

```bash
# Tester le backend
curl https://votre-app.up.railway.app/api/health

# Devrait retourner :
# {"status":"ok","timestamp":"..."}
```

---

## 🎯 Résultat final

```
Frontend (Vercel) → https://all-in-one-business-hub.vercel.app
                    ↓ (NEXT_PUBLIC_API_URL)
Backend (Railway) → https://votre-app.up.railway.app
                    ↓ (MONGODB_HOST)
Database (Atlas)  → vintedatabase.laep9wk.mongodb.net
```

---

## ⚠️ Important

- Le frontend **NE PEUT PAS** se connecter à `localhost:5000` en production
- Railway offre un plan gratuit avec 500h/mois (largement suffisant pour débuter)
- Les logs Railway sont en temps réel pour debugger
