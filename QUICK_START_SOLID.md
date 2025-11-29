# 🚀 Démarrage Rapide - Architecture SOLID

## Prérequis
- Node.js v20+
- npm ou yarn
- git

---

## ⚡ Installation

```bash
# 1. Dépendances du serveur
cd server
npm install
cd ..

# 2. Dépendances du frontend
cd app
npm install
cd ..
```

---

## 🏃 Lancer l'Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
✅ Serveur sur http://localhost:5000

### Terminal 2 - Frontend  
```bash
cd app
npm run dev
```
✅ Appli sur http://localhost:3000

---

## 🧪 Tester l'API

### 1. Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 📂 Structure Rapide

### Backend
```
server/src/
├── config/     → Configuration
├── types/      → Types
├── lib/        → Utilitaires
├── services/   → Logique métier
├── controllers → Handlers
├── routes/     → Routes API
├── middleware/ → Middleware
└── index.ts    → Entry point
```

### Frontend
```
app/src/
├── types/      → Types
├── hooks/      → Hooks React
├── lib/        → Utilitaires
├── components/ → Composants
├── constants/  → Constantes
└── app/        → Pages
```

---

## 🎯 Flux d'Authentification

```
User Input
    ↓
Form Component (useForm hook)
    ↓
useAuth.register() / login()
    ↓
POST /api/auth/register | login
    ↓
Controller → Service → Prisma
    ↓
Response
    ↓
localStorage + Redirect
```

---

## 📖 Documentation

- `docs/ARCHITECTURE.md` - Architecture détaillée
- `docs/API.md` - Documentation API
- `docs/CONTRIBUTING.md` - Guide de contribution
- `.github/copilot-instructions.md` - Instructions Copilot

---

## 🔧 Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=file:./dev.db
BETTER_AUTH_SECRET=dev-secret
BETTER_AUTH_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Port 5000 occupé
```bash
# Trouver le process
lsof -i :5000

# Tuer le process
kill -9 <PID>

# Ou utiliser un autre port
PORT=5001 npm run dev
```

### Port 3000 occupé
```bash
# Trouver le process
lsof -i :3000

# Tuer le process
kill -9 <PID>
```

### Erreur Prisma
```bash
# Réinitialiser la base de données
cd server
npx prisma migrate dev --name init
```

---

## ✨ Commandes Utiles

### Backend
```bash
npm run dev        # Mode développement
npm run build      # Build
npm start          # Lancer build
npm test           # Tests
```

### Frontend
```bash
npm run dev        # Mode développement
npm run build      # Build
npm run start      # Lancer build
npm run lint       # Linter
```

---

## 🎓 Architecture SOLID

✅ **S** - Single Responsibility  
✅ **O** - Open/Closed  
✅ **L** - Liskov Substitution  
✅ **I** - Interface Segregation  
✅ **D** - Dependency Inversion  

---

## 🚀 Prochaines Étapes

1. Tester l'inscription/connexion
2. Explorer la structure du code
3. Ajouter vos features
4. Écrire des tests
5. Déployer

**Bon développement!** 💪
