# 🚀 Application Full-Stack - Architecture SOLID & Clean Code

Une application moderne avec authentification, architecture **SOLID**, et principes de **Clean Code**.

## 🎯 Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│   Frontend Next.js        Backend Express           │
│   (http://localhost:3000) (http://localhost:5000)   │
│                                                     │
│   ✅ Home Page       ✅ Auth Routes               │
│   ✅ Login/Register  ✅ User Services             │
│   ✅ Dashboard       ✅ Error Handling             │
│                     ✅ Logging                     │
└─────────────────────────────────────────────────────┘
        ↓ HTTPS/HTTP ↓
    SQLite Database
```

---

## 🏗️ Architecture SOLID

### Single Responsibility
Chaque fichier a **une seule raison de changer**
- Services = Logique métier
- Controllers = Gestion HTTP
- Routes = Routage
- Hooks = État et logique React

### Open/Closed
**Ouvert à l'extension, fermé à la modification**
- Ajouter des endpoints sans modifier le code existant
- Ajouter des services sans modifier les routes

### Liskov Substitution
Les implémentations sont **interchangeables**

### Interface Segregation
Interfaces **précises et spécifiques**

### Dependency Inversion
Dépendre des **abstractions, pas des implémentations**

---

## 📁 Structure du Projet

```
Application/
│
├── app/                              # Frontend Next.js
│   ├── src/
│   │   ├── types/          → Types TypeScript
│   │   ├── hooks/          → React Hooks (useAuth, useForm)
│   │   ├── lib/            → Utilitaires et API Client
│   │   ├── components/     → Composants React
│   │   ├── constants/      → Constantes
│   │   └── app/            → Pages Next.js
│   ├── package.json
│   └── tsconfig.json
│
├── server/                           # Backend Express
│   ├── src/
│   │   ├── config/         → Configuration (env, constants)
│   │   ├── types/          → Types TypeScript
│   │   ├── lib/            → Utilitaires (Prisma, Logger)
│   │   ├── services/       → Logique métier
│   │   ├── controllers/    → Handlers HTTP
│   │   ├── routes/         → Définition des routes
│   │   ├── middleware/     → Middleware (errors, auth)
│   │   └── index.ts        → Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── ARCHITECTURE.md      ← Détails architecture
│   ├── API.md              ← Documentation API
│   └── CONTRIBUTING.md     ← Guide contribution
│
├── .github/
│   └── copilot-instructions.md
│
├── QUICK_START_SOLID.md    ← Démarrage rapide
├── REFACTORING_SUMMARY.md  ← Résumé refactorisation
├── EXECUTIVE_SUMMARY_SOLID.md ← Vue d'ensemble
└── README.md               ← Ce fichier
```

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
# Backend
cd server
npm install

# Frontend
cd app
npm install
```

### 2. Configuration
Créer les fichiers `.env`:

**server/.env**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=file:./dev.db
BETTER_AUTH_SECRET=dev-secret
BETTER_AUTH_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

**app/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Lancer les serveurs

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# ✅ http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd app
npm run dev
# ✅ http://localhost:3000
```

---

## ✨ Fonctionnalités

### ✅ Authentification
- Inscription avec validation
- Connexion sécurisée
- Dashboard protégé
- Déconnexion

### ✅ Architecture
- Principes SOLID appliqués
- Clean Code standards
- Séparation des responsabilités
- Gestion d'erreurs centralisée

### ✅ Types
- TypeScript strict partout
- Interfaces précises
- Zod pour validation

### ✅ Documentation
- Architecture détaillée
- API complètement documentée
- Guide de contribution

---

## 🧪 Tester l'API

### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "SecurePass123"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "SecurePass123"
  }'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 📊 Stack Technique

### Frontend
- ✅ Next.js 15.5.6 + React 19
- ✅ TypeScript strict
- ✅ Tailwind CSS
- ✅ React Hooks personnalisés
- ✅ API Client centralisé
- ✅ Validation client-side

### Backend
- ✅ Express 5.1.0
- ✅ TypeScript strict
- ✅ Prisma ORM
- ✅ Zod validation
- ✅ Logger structuré
- ✅ Middleware centralisé

### Base de Données
- ✅ SQLite (développement)
- ✅ PostgreSQL prêt (production)

---

## 📖 Documentation

### Pour Comprendre
- 📄 `QUICK_START_SOLID.md` - Démarrage en 5 min
- 📄 `docs/ARCHITECTURE.md` - Architecture complète
- 📄 `EXECUTIVE_SUMMARY_SOLID.md` - Vue d'ensemble

### Pour Développer
- 📄 `docs/API.md` - Documentation API
- 📄 `docs/CONTRIBUTING.md` - Comment contribuer
- 📄 `.github/copilot-instructions.md` - Instructions Copilot

### Pour Déboguer
- 📄 `REFACTORING_SUMMARY.md` - Changements faits

---

## 🎯 Commandes

### Backend
```bash
npm run dev      # Mode développement
npm run build    # Build TypeScript
npm start        # Lancer build
npm test         # Tests (à ajouter)
```

### Frontend
```bash
npm run dev      # Mode développement
npm run build    # Build Next.js
npm run start    # Lancer build
npm run lint     # Linter
```

---

## 🐛 Troubleshooting

### Port occupé
```bash
# Port 5000 (Windows)
netstat -ano | findstr :5000

# Port 3000 (Windows)
netstat -ano | findstr :3000
```

### Base de données
```bash
cd server
npx prisma migrate dev --name init
```

### Dépendances
```bash
# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## � Prochaines Étapes

1. **Tests** - Ajouter tests unitaires
2. **JWT** - Implémenter tokens
3. **Better Auth** - Intégration complète
4. **Production** - Déployer sur Railway/Vercel

---

## 📝 Licences

MIT - Utilisable librement

---

## 🤝 Contribution

Consultez `docs/CONTRIBUTING.md` pour les règles de contribution.

**Principes:**
- ✅ Respecter SOLID
- ✅ Respecter Clean Code
- ✅ Types stricts
- ✅ Bien documenter

---

## 💬 Questions?

📚 Consultez la documentation dans `docs/`  
🤖 Lisez `.github/copilot-instructions.md`  
🚀 Commencez avec `QUICK_START_SOLID.md`  

---

**Happy Coding!** 💻✨

- Node.js 18+
- npm ou yarn

### Étapes d'Installation

#### Client React
```bash
cd client
npm install
npm run dev
```

#### Serveur Node.js
```bash
cd server
npm install
npm run dev
```

---

## 🔐 Authentification avec Better Auth

Better Auth gère:
- Inscription et connexion
- JWT/Cookies sessions
- Profils utilisateurs
- OAuth (optionnel)

---

## 📚 Documentation Détaillée

- `PROJECT_PROGRESS.md` - Suivi de la progression
- `.github/copilot-instructions.md` - Instructions pour Copilot

---

## 🗂️ Base de Données Recommandée

### PostgreSQL + Prisma
Gratuit via:
- **Railway:** https://railway.app/
- **Render:** https://render.com/
- **Supabase:** https://supabase.com/

---

## 💡 Prochaines Étapes

1. Initialiser le client React
2. Initialiser le serveur Node.js
3. Configurer Better Auth
4. Intégrer shadcn UI
5. Connecter à la base de données

---

## 📞 Support

Consulte le fichier `PROJECT_PROGRESS.md` pour l'état du projet et les prochaines actions.
