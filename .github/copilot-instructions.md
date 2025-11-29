# Copilot Instructions - Projet Full-Stack SOLID & Clean Code

## 🎯 Principes Fondamentaux

### Architecture SOLID
- **S**ingle Responsibility: Chaque classe/fonction fait UNE SEULE chose
- **O**pen/Closed: Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution: Les implémentations sont interchangeables
- **I**nterface Segregation: Interfaces spécifiques plutôt que génériques
- **D**ependency Inversion: Dépendre des abstractions, pas des implémentations

### Clean Code Standards
- Noms explicites et parlants (pas `x`, `temp`, `data`)
- Fonctions courtes et focalisées (< 20 lignes)
- Pas de duplication (DRY principle)
- Gestion d'erreurs explicite
- Types stricts (TypeScript strict mode)
- Pas de side effects non intentionnels

## 📁 Architecture du Projet

```
Application/
├── app/                              # Frontend Next.js
│   ├── app/
│   │   ├── (auth)/                   # Routes d'authentification groupées
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/              # Routes protégées (layout guard)
│   │   │   └── dashboard/
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── forms/                # Formulaires
│   │   │   ├── common/               # Composants communs
│   │   │   └── auth/                 # Composants auth
│   │   ├── hooks/                    # React hooks personnalisés
│   │   │   ├── useAuth.ts
│   │   │   └── useForm.ts
│   │   ├── lib/
│   │   │   ├── auth-client.ts        # Client Better Auth
│   │   │   ├── api.ts                # API client centralisé
│   │   │   └── utils/
│   │   ├── types/                    # Types TypeScript
│   │   │   ├── auth.ts
│   │   │   └── api.ts
│   │   └── constants/                # Constantes d'app
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── server/                           # Backend Express
│   ├── src/
│   │   ├── routes/                   # Routes/Endpoints
│   │   │   ├── auth.routes.ts
│   │   │   └── health.routes.ts
│   │   ├── services/                 # Logique métier
│   │   │   ├── auth.service.ts
│   │   │   └── user.service.ts
│   │   ├── controllers/              # Contrôleurs (requête → service → réponse)
│   │   │   ├── auth.controller.ts
│   │   │   └── health.controller.ts
│   │   ├── middleware/               # Middleware personnalisé
│   │   │   ├── error-handler.ts
│   │   │   └── auth-guard.ts
│   │   ├── lib/
│   │   │   ├── auth.ts               # Configuration Better Auth
│   │   │   ├── prisma.ts             # Client Prisma singleton
│   │   │   └── logger.ts
│   │   ├── types/                    # Types TypeScript
│   │   │   ├── auth.ts
│   │   │   └── api.ts
│   │   ├── config/                   # Configuration
│   │   │   ├── env.ts                # Variables d'environnement validées
│   │   │   └── constants.ts
│   │   └── index.ts                  # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    ├── ARCHITECTURE.md               # Explication de l'architecture
    ├── API.md                        # Documentation API
    └── CONTRIBUTING.md               # Guide de contribution
```

## 🏗️ Principes par Couche

### Frontend (Next.js)
- **Composants**: Stateless, props-driven, testables
- **Hooks**: Logique métier isolée (useAuth, useForm)
- **Types**: Strictement typés, réutilisables
- **API Client**: Centralisé, avec gestion d'erreurs

### Backend (Express)
- **Routes**: Juste le routing, zéro logique
- **Controllers**: Requête → validation → service → réponse
- **Services**: Toute la logique métier
- **Middleware**: Cross-cutting concerns (auth, logging, erreurs)
- **Config**: Variables d'env validées au startup

## 🔧 Règles de Codage

### TypeScript
```typescript
// ❌ Mauvais
function handle(data: any): void {
  const x = data.user;
  // ...
}

// ✅ Bon
interface UserData {
  id: string;
  email: string;
  name: string;
}

function handleUserData(userData: UserData): void {
  const userId = userData.id;
  // ...
}
```

### Gestion d'Erreurs
```typescript
// ❌ Mauvais
app.post('/login', (req, res) => {
  const user = db.findUser(req.body.email);
  res.json(user);
});

// ✅ Bon
app.post('/login', async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    next(error); // Passe au middleware d'erreur
  }
});
```

### Noms Explicites
```typescript
// ❌ Mauvais
const d = new Date();
const u = await getUser(id);
const p = u.password === pwd;

// ✅ Bon
const currentDate = new Date();
const user = await userService.getUserById(userId);
const isPasswordValid = await user.verifyPassword(providedPassword);
```

## 📋 Status du Projet (17 Nov 2025)

### ✅ Complété
- Frontend Next.js configuré
- Backend Express configuré
- Base de données SQLite + Prisma
- Tailwind CSS intégré
- Better Auth installé

### 🚧 En cours
- Refactorisation architecture SOLID
- Séparation des responsabilités
- Types stricts partout

### ⏳ À faire
- Services layer complet
- Middleware centralisé
- Gestion d'erreurs globale
- Validation des inputs
- Tests unitaires

## 📝 Convention de Nommage

### Fichiers
- `*.service.ts` - Logique métier
- `*.controller.ts` - Contrôleurs HTTP
- `*.routes.ts` - Définition des routes
- `*.types.ts` - Définitions TypeScript
- `*.ts` (utilitaires) - Fonctions pures

### Variables & Fonctions
- `const userName = 'Jean'` - Variables explicites
- `function validateEmail(email: string): boolean` - Verbes d'action
- `interface IUserRepository` - Interfaces avec préfixe I
- `type UserInput = Omit<User, 'id' | 'createdAt'>` - Types explicites

## 🔗 Ressources

- **Architecture**: docs/ARCHITECTURE.md
- **API**: docs/API.md
- **Contributing**: docs/CONTRIBUTING.md


