# 📁 Structure des Fichiers de Configuration

## ✅ Fichiers à garder

### `app/.env.local.example`
- **Rôle** : Template pour les variables d'environnement
- **Contient** : Exemples de variables avec placeholders
- **Commité** : ✅ Oui (dans Git)
- **Usage** : `cp app/.env.local.example app/.env.local`

### `app/.env.local`
- **Rôle** : Variables d'environnement locales (développement)
- **Contient** : Vraies credentials MongoDB, clés secrètes
- **Commité** : ❌ Non (ignoré par Git)
- **Usage** : Développement local uniquement

---

## ❌ Fichiers supprimés (inutiles)

- ~~`app/.env.example`~~ → Doublon de `.env.local.example`
- ~~`server/.env.example`~~ → Backend migré dans Next.js
- ~~Tout le dossier `server/`~~ → Plus utilisé (backend = Next.js API routes)

---

## 🎯 Workflow

### Pour un nouveau développeur

1. **Cloner le repo**
   ```bash
   git clone https://github.com/votre-repo/all-in-one-business-hub.git
   cd all-in-one-business-hub
   ```

2. **Créer `.env.local`**
   ```bash
   cd app
   cp .env.local.example .env.local
   ```

3. **Remplir les vraies valeurs**
   ```bash
   nano .env.local  # ou votre éditeur
   ```

4. **Lancer l'app**
   ```bash
   npm install
   npm run dev
   ```

### Pour déployer sur Vercel

1. **Dashboard Vercel → Settings → Environment Variables**
2. **Ajouter toutes les variables** (voir [docs/ENV_SETUP.md](./ENV_SETUP.md))
3. **Redéployer**

---

## 🔒 Sécurité

### ✅ Bonnes pratiques
- `.env.local` est ignoré par Git (`.gitignore`)
- Credentials MongoDB en variables d'env uniquement
- Clé secrète différente dev/prod
- Variables Vercel chiffrées

### ❌ À ne jamais faire
- Commiter `.env.local`
- Mettre des credentials dans le code
- Utiliser la même clé secrète en dev et prod
- Exposer les variables avec `NEXT_PUBLIC_` (sauf si nécessaire côté client)

---

## 📚 Documentation

- **Configuration complète** : [docs/ENV_SETUP.md](./docs/ENV_SETUP.md)
- **Migration** : [MIGRATION_TO_NEXTJS_API.md](./MIGRATION_TO_NEXTJS_API.md)
- **Démarrage rapide** : [QUICK_START.md](./QUICK_START.md)
