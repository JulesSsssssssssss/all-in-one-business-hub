# 🏗️ Architecture SOLID du Projet

## Vue d'ensemble

Ce projet suit les principes **SOLID** et **Clean Code** pour une architecture maintenable et extensible.

---

## 📋 Principes SOLID Appliqués

### Single Responsibility Principle (SRP)
Chaque classe/module a **une seule raison de changer**:
- `AuthService` → Logique métier d'authentification
- `AuthController` → Gestion des requêtes HTTP
- `AuthRoutes` → Définition des routes
- `ErrorHandler` → Gestion centralisée des erreurs

### Open/Closed Principle (OCP)
Ouvert à l'extension, fermé à la modification:
- Ajouter un nouveau contrôleur sans modifier l'existant
- Ajouter un nouveau service sans modifier les routes

### Liskov Substitution Principle (LSP)
Les implémentations sont interchangeables:
- Les services peuvent être remplacés par des versions testables
- Les contrôleurs suivent une interface cohérente

### Interface Segregation Principle (ISP)
Interfaces spécifiques plutôt que génériques:
- `AuthCredentials` pour login
- `SignUpRequest` pour inscription
- Types précis pour chaque endpoint

### Dependency Inversion Principle (DIP)
Dépendre des abstractions, pas des implémentations:
- Les contrôleurs utilisent les services (abstraction)
- Les services utilisent Prisma (abstraction)
- Les routes importent les contrôleurs

---

## 🎯 Architecture par Couches

```
┌─────────────────────────────────────┐
│       Routes (Entrée HTTP)          │
├─────────────────────────────────────┤
│     Controllers (Requête/Réponse)   │
├─────────────────────────────────────┤
│     Services (Logique Métier)       │
├─────────────────────────────────────┤
│  Lib (Prisma, Logger, Utils)        │
├─────────────────────────────────────┤
│        Database (SQLite/PG)         │
└─────────────────────────────────────┘
```

### Backend Express

**Flux d'une requête:**
```
POST /api/auth/login
    ↓
routes/auth.routes.ts (RouterProvider)
    ↓
controllers/auth.controller.ts (Validation & Orchestration)
    ↓
services/auth.service.ts (Logique métier)
    ↓
lib/prisma.ts (Accès base de données)
    ↓
middleware/error-handler.ts (Gestion d'erreurs)
    ↓
Response JSON
```

**Structure des fichiers:**
```
server/src/
├── config/          # Configuration & validation d'env
│   ├── env.ts       # Variables d'environnement validées
│   └── constants.ts # Constantes métier
├── types/           # Types TypeScript
│   ├── auth.ts      # Types d'authentification
│   └── api.ts       # Types API generiques
├── lib/             # Utilitaires & clients
│   ├── prisma.ts    # Client Prisma (singleton)
│   └── logger.ts    # Logger structuré
├── services/        # Logique métier
│   ├── auth.service.ts
│   └── user.service.ts
├── controllers/     # Handlers HTTP
│   ├── auth.controller.ts
│   └── health.controller.ts
├── routes/          # Définition des routes
│   ├── auth.routes.ts
│   └── health.routes.ts
├── middleware/      # Cross-cutting concerns
│   ├── error-handler.ts
│   └── auth-guard.ts
└── index.ts         # Point d'entrée
```

### Frontend Next.js

**Flux de données:**
```
Page Component
    ↓
useAuth() Hook (État & Logique)
    ↓
useForm() Hook (Gestion du formulaire)
    ↓
lib/auth-client.ts (API Client)
    ↓
API Backend
```

**Structure des fichiers:**
```
app/src/
├── types/          # Types TypeScript
│   ├── auth.ts     # Types d'authentification
│   └── api.ts      # Types API
├── hooks/          # React Hooks personnalisés
│   ├── useAuth.ts  # Gestion d'authentification
│   └── useForm.ts  # Gestion de formulaires
├── lib/
│   ├── auth-client.ts      # Client API
│   └── utils/
│       ├── validation.ts   # Validation
│       └── errors.ts       # Gestion d'erreurs
├── components/     # Composants React
│   ├── forms/      # Composants de formulaires
│   ├── common/     # Composants communs
│   └── auth/       # Composants d'auth
├── constants/      # Constantes d'app
│   └── app.ts      # Routes, endpoints, messages
└── app/            # Pages Next.js
    ├── page.tsx    # Home
    ├── auth/
    │   ├── login/
    │   └── register/
    ├── dashboard/
    └── layout.tsx
```

---

## 💡 Clean Code Standards

### Noms Explicites
```typescript
// ❌ Mauvais
const d = new Date();
const h = await getUser(id);

// ✅ Bon
const currentDate = new Date();
const user = await authService.getUserById(id);
```

### Fonctions Courtes & Focalisées
```typescript
// ✅ Une seule responsabilité
static async registerUser(request: SignUpRequest) {
  // Validation
  // Création
  // Logging
}
```

### Pas de Duplication (DRY)
```typescript
// ✅ Validation externalisée dans utils/
if (!validateEmail(email)) {
  throw new Error(ERRORS.INVALID_EMAIL);
}
```

### Gestion d'Erreurs Explicite
```typescript
// ✅ Middleware centralisé
app.use(errorHandler);

// ✅ Try/catch avec propagation
try {
  const user = await authService.loginUser(email, password);
} catch (error) {
  next(error); // Vers le middleware d'erreur
}
```

### Types Stricts
```typescript
// ✅ Interfaces précises
interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

// ✅ Pas de `any`
function registerUser(request: SignUpRequest): Promise<User>
```

---

## 🔄 Flux d'Authentification

### 1️⃣ Inscription
```
USER INPUT
    ↓
Register Form (useForm hook)
    ↓
Validation (utils/validation)
    ↓
useAuth.register()
    ↓
POST /api/auth/register
    ↓
AuthController.register()
    ↓
AuthService.registerUser()
    ↓
Prisma.user.create()
    ↓
localStorage.setItem('user')
    ↓
Redirect /dashboard
```

### 2️⃣ Connexion
```
USER INPUT
    ↓
Login Form (useForm hook)
    ↓
Validation
    ↓
useAuth.login()
    ↓
POST /api/auth/login
    ↓
AuthController.login()
    ↓
AuthService.validateCredentials()
    ↓
Prisma.user.findUnique()
    ↓
localStorage.setItem('user')
    ↓
Redirect /dashboard
```

---

## 🚀 Bénéfices de cette Architecture

✅ **Maintenabilité**: Code organisé et prévisible  
✅ **Testabilité**: Chaque couche isolée  
✅ **Scalabilité**: Facile d'ajouter nouvelles fonctionnalités  
✅ **Collaboration**: Responsabilités claires  
✅ **Debugging**: Erreurs centralisées et structurées  
✅ **Documentation**: Code auto-documenté avec types stricts  

---

## 📝 Prochaines Étapes

- [ ] Ajouter JWT pour l'authentification
- [ ] Implémenter les tests unitaires
- [ ] Ajouter la validation Zod côté contrôleur
- [ ] Intégrer Better Auth
- [ ] Ajouter les rôles et permissions
- [ ] Mettre en place les middlewares d'authentification
