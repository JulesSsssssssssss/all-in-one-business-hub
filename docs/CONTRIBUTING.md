# 🤝 Guide de Contribution

## 🎯 Principes du Projet

Ce projet suit une architecture **SOLID** et **Clean Code**. Tous les contributeurs doivent respecter ces principes:

1. **Single Responsibility**: Une classe = une responsabilité
2. **Noms explicites**: `user`, pas `u`
3. **Fonctions courtes**: Moins de 20 lignes
4. **Pas de duplication**: DRY principle
5. **Types stricts**: TypeScript everywhere
6. **Gestion d'erreurs**: Try/catch explicite

---

## 📁 Structure du Dossier

### Backend
```
server/src/
├── config/     → Configuration & env
├── types/      → TypeScript types
├── lib/        → Utilitaires & clients
├── services/   → Logique métier
├── controllers → Handlers HTTP
├── routes/     → Définition des routes
├── middleware/ → Cross-cutting concerns
└── index.ts    → Point d'entrée
```

### Frontend
```
app/src/
├── types/      → TypeScript types
├── hooks/      → React hooks
├── lib/        → Utilitaires & API client
├── components/ → Composants React
├── constants/  → Constantes
└── app/        → Pages Next.js
```

---

## ✅ Checklist pour un Nouveau Feature

### 1. Backend

```typescript
// ✅ Créer le type dans src/types/
export interface NewFeatureRequest {
  field1: string;
  field2: number;
}

// ✅ Créer le service dans src/services/
export class NewFeatureService {
  static async handleFeature(request: NewFeatureRequest) {
    // Logique métier
    // Logging
    // Gestion d'erreurs
  }
}

// ✅ Créer le contrôleur dans src/controllers/
export class NewFeatureController {
  static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NewFeatureService.handleFeature(req.body);
      res.json({
        success: true,
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

// ✅ Ajouter la route dans src/routes/
router.post('/feature', NewFeatureController.handle.bind(NewFeatureController));

// ✅ Documenter dans docs/API.md
```

### 2. Frontend

```typescript
// ✅ Créer le hook dans src/hooks/
export function useNewFeature() {
  const [data, setData] = useState(null);
  // Logique métier
  return { data };
}

// ✅ Créer le composant dans src/components/
export function NewFeatureComponent() {
  const { data } = useNewFeature();
  return <>...</>;
}

// ✅ Utiliser dans les pages
```

---

## 🔍 Règles de Code

### Nommer Correctement

```typescript
// ❌ Mauvais
const u = await getUser(id);
const d = new Date();
const x = calculateValue(a, b);

// ✅ Bon
const user = await userService.getUserById(id);
const currentDate = new Date();
const totalPrice = calculatePrice(quantity, unitPrice);
```

### Fonctions Courtes

```typescript
// ❌ Mauvais - 50 lignes
function processUser(user) {
  // validation
  // transformation
  // logging
  // error handling
  // ...
}

// ✅ Bon - Séparation des responsabilités
function validateUser(user) { /* ... */ }
function transformUser(user) { /* ... */ }
function logUserAction(user) { /* ... */ }
```

### Pas de Duplication

```typescript
// ❌ Mauvais - validation répétée
if (email.length < 1) throw Error('...');
if (password.length < 8) throw Error('...');

// ✅ Bon - validation externalisée
validateEmail(email);
validatePassword(password);
```

### Types Stricts

```typescript
// ❌ Mauvais
function handleData(data: any) {
  return data.user.email;
}

// ✅ Bon
interface UserData {
  user: {
    email: string;
  };
}

function handleData(data: UserData): string {
  return data.user.email;
}
```

---

## 🧪 Tests

### Ajouter des Tests Unitaires

```typescript
// src/services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  describe('registerUser', () => {
    it('should create a new user', () => {
      // Arrange
      const request = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      // Act
      const result = AuthService.registerUser(request);

      // Assert
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error if email exists', () => {
      // ...
    });
  });
});
```

---

## 📝 Messages de Commit

Utilisez le format Conventional Commits:

```
<type>(<scope>): <subject>

<body>
<footer>
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Format/whitespace
- `refactor`: Refactorisation
- `test`: Tests
- `chore`: Maintenance

**Exemples:**
```
feat(auth): add user registration endpoint
fix(validation): validate email format correctly
docs: update API documentation
refactor(services): extract common validation logic
test: add AuthService tests
```

---

## 🚀 Avant de Faire une PR

- [ ] Code suit les standards SOLID
- [ ] Pas de `any` en TypeScript
- [ ] Tests écrits et passants
- [ ] Documentation mise à jour
- [ ] Pas de console.log (utiliser le logger)
- [ ] Gestion d'erreurs complète
- [ ] Commit messages clairs

---

## 🐛 Rapporter un Bug

1. Vérifier que le bug existe toujours
2. Créer une issue avec:
   - Description claire
   - Étapes pour reproduire
   - Comportement attendu
   - Comportement réel
   - Screenshots si possible

---

## 💬 Questions?

Consultez:
- `docs/ARCHITECTURE.md` - Architecture générale
- `docs/API.md` - Documentation API
- `.github/copilot-instructions.md` - Instructions Copilot
