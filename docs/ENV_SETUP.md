# 📋 Configuration des Variables d'Environnement

## 🏠 Développement Local

### 1. Créer le fichier `.env.local`

```bash
cd app
cp .env.local.example .env.local
```

### 2. Remplir avec vos vraies valeurs

Éditer `app/.env.local` :

```env
# MongoDB (vos credentials Atlas)
MONGODB_USERNAME=databaseApp
MONGODB_PASSWORD=Jumarin49
MONGODB_HOST=vintedatabase.laep9wk.mongodb.net
MONGODB_DATABASE_NAME=Vintedatabase
MONGODB_PARAMS=retryWrites=true&w=majority
MONGODB_APP_NAME=Vintedatabase

# Better Auth
BETTER_AUTH_SECRET=generer-avec-commande-ci-dessous
BETTER_AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

### 3. Générer la clé secrète

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans `BETTER_AUTH_SECRET`.

---

## 🌐 Production Vercel

### Configuration dans Vercel Dashboard

**Settings → Environment Variables** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGODB_USERNAME` | `databaseApp` | Username MongoDB Atlas |
| `MONGODB_PASSWORD` | `Jumarin49` | Password MongoDB Atlas |
| `MONGODB_HOST` | `vintedatabase.laep9wk.mongodb.net` | Host MongoDB |
| `MONGODB_DATABASE_NAME` | `Vintedatabase` | Nom de la database |
| `MONGODB_PARAMS` | `retryWrites=true&w=majority` | Paramètres de connexion |
| `MONGODB_APP_NAME` | `Vintedatabase` | Nom de l'app |
| `BETTER_AUTH_SECRET` | `<générer>` | Clé secrète 32+ caractères |
| `BETTER_AUTH_URL` | `https://all-in-one-business-hub.vercel.app` | URL de production |
| `NEXTAUTH_URL` | `https://all-in-one-business-hub.vercel.app` | URL de production |

⚠️ **Important** :
- ✅ Toutes les variables sont définies pour **tous les environnements** (Production, Preview, Development)
- ❌ **NE PAS** définir `NEXT_PUBLIC_API_URL` (on utilise le même domaine maintenant)
- ✅ Générer une **nouvelle clé secrète** pour la production (différente du dev)

---

## 📝 Notes

### Fichier `.env.local`
- ✅ **Utilisé pour le développement local** uniquement
- ❌ **Ne jamais commiter** ce fichier (déjà dans `.gitignore`)
- ✅ Contient vos vraies credentials

### Fichier `.env.local.example`
- ✅ **Template** pour les autres développeurs
- ✅ **Commité** dans le repo
- ❌ Ne contient **pas** de vraies credentials

### Vercel
- ✅ Variables configurées via le **Dashboard**
- ✅ Séparées par environnement si besoin
- ✅ Chiffrées et sécurisées
