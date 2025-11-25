# 🔐 Authentification avec Better Auth

## ✅ Configuration Complétée

Better Auth est maintenant configuré et prêt à être utilisé ! Toutes les routes d'authentification sont disponibles.

---

## 📍 Routes d'Authentification Disponibles

Toutes les routes sont préfixées par `/api/auth`

### 1️⃣ **Inscription (Sign Up)**

**POST** `/api/auth/sign-up/email`

```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "Jean Dupont"
}
```

**Réponse succès** (201):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jean Dupont",
    "emailVerified": false,
    "createdAt": "2025-11-25T19:00:00.000Z",
    "updatedAt": "2025-11-25T19:00:00.000Z"
  },
  "session": {
    "id": "...",
    "userId": "507f1f77bcf86cd799439011",
    "expiresAt": "2025-12-02T19:00:00.000Z",
    "token": "..."
  }
}
```

---

### 2️⃣ **Connexion (Sign In)**

**POST** `/api/auth/sign-in/email`

```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "rememberMe": true
}
```

**Réponse succès** (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jean Dupont",
    ...
  },
  "session": {
    "token": "...",
    ...
  }
}
```

**Erreur** (401):
```json
{
  "error": "Invalid email or password"
}
```

---

### 3️⃣ **Déconnexion (Sign Out)**

**POST** `/api/auth/sign-out`

Headers requis:
```
Authorization: Bearer <session_token>
```

**Réponse succès** (200):
```json
{
  "success": true
}
```

---

### 4️⃣ **Récupérer la Session**

**GET** `/api/auth/get-session`

Headers requis:
```
Authorization: Bearer <session_token>
```

**Réponse succès** (200):
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Jean Dupont",
    ...
  },
  "session": {
    "id": "...",
    "expiresAt": "..."
  }
}
```

**Pas de session** (401):
```json
{
  "user": null,
  "session": null
}
```

---

### 5️⃣ **Changer le Mot de Passe**

**POST** `/api/auth/change-password`

```json
{
  "currentPassword": "ancienMotDePasse",
  "newPassword": "nouveauMotDePasse123",
  "revokeOtherSessions": true
}
```

---

### 6️⃣ **Demander Réinitialisation du Mot de Passe**

**POST** `/api/auth/request-password-reset`

```json
{
  "email": "user@example.com",
  "redirectTo": "http://localhost:3000/reset-password"
}
```

---

### 7️⃣ **Réinitialiser le Mot de Passe**

**POST** `/api/auth/reset-password`

```json
{
  "token": "<token_from_email>",
  "newPassword": "nouveauMotDePasse123"
}
```

---

## 🧪 Test avec cURL

### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Récupérer Session
```bash
curl -X GET http://localhost:5000/api/auth/get-session \
  -H "Authorization: Bearer <votre_token>"
```

---

## 💻 Utilisation Côté Frontend (React/Next.js)

### Installation du Client Better Auth

```bash
cd app
npm install better-auth
```

### Configuration du Client

Créez `app/src/lib/auth-client.ts` :

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000"
});
```

### Exemple d'Utilisation

```typescript
import { authClient } from '@/lib/auth-client';

// Inscription
async function signUp() {
  const { data, error } = await authClient.signUp.email({
    email: "user@example.com",
    password: "password123",
    name: "Jean Dupont"
  });
  
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Inscrit :", data.user);
}

// Connexion
async function signIn() {
  const { data, error } = await authClient.signIn.email({
    email: "user@example.com",
    password: "password123",
    rememberMe: true
  });
  
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Connecté :", data.user);
}

// Déconnexion
async function signOut() {
  await authClient.signOut();
}

// Récupérer la session
async function getSession() {
  const { data } = await authClient.getSession();
  
  if (data) {
    console.log("Utilisateur connecté :", data.user);
  } else {
    console.log("Pas de session active");
  }
}
```

### Hook React

```typescript
import { useSession } from '@/hooks/useSession';

function MyComponent() {
  const { user, isLoading } = useSession();
  
  if (isLoading) return <div>Chargement...</div>;
  
  if (!user) return <div>Non connecté</div>;
  
  return <div>Bienvenue {user.name} !</div>;
}
```

---

## 🗄️ Collections MongoDB

Better Auth crée automatiquement ces collections :

### `user`
```javascript
{
  _id: ObjectId,
  id: String,
  email: String (unique),
  emailVerified: Boolean,
  name: String,
  image: String?,
  createdAt: Date,
  updatedAt: Date
}
```

### `session`
```javascript
{
  _id: ObjectId,
  id: String,
  userId: String,
  expiresAt: Date,
  token: String,
  ipAddress: String?,
  userAgent: String?
}
```

### `account`
```javascript
{
  _id: ObjectId,
  id: String,
  userId: String,
  accountId: String,
  providerId: String, // "credential" pour email/password
  accessToken: String?,
  refreshToken: String?,
  expiresAt: Date?,
  password: String? // Hash du mot de passe
}
```

---

## 🔒 Protéger des Routes Backend

### Middleware Express

```typescript
import { requireAuth } from '../lib/auth-helpers';

// Route protégée
router.get('/profile', requireAuth(), async (req, res) => {
  // req.user contient les infos utilisateur
  res.json({
    user: req.user,
    message: `Bienvenue ${req.user.name}`
  });
});
```

### Exemple complet

```typescript
import express from 'express';
import { requireAuth, getSession } from '../lib/auth-helpers';

const protectedRouter = express.Router();

// Route publique
protectedRouter.get('/public', (req, res) => {
  res.json({ message: 'Accessible à tous' });
});

// Route protégée
protectedRouter.get('/private', requireAuth(), (req, res) => {
  res.json({
    message: 'Route protégée',
    user: req.user
  });
});

// Route avec vérification manuelle
protectedRouter.get('/custom', async (req, res) => {
  const session = await getSession(req);
  
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  res.json({
    user: session.user,
    session: session.session
  });
});

export { protectedRouter };
```

---

## ⚙️ Configuration Avancée

### Durée de Session

Dans `server/src/auth.ts` :

```typescript
export const auth = betterAuth({
  // ...
  session: {
    expiresIn: 60 * 60 * 24 * 7,    // 7 jours
    updateAge: 60 * 60 * 24          // 1 jour
  }
});
```

### Longueur du Mot de Passe

```typescript
emailAndPassword: {
  enabled: true,
  minPasswordLength: 8,
  maxPasswordLength: 128
}
```

### Désactiver l'Inscription

```typescript
emailAndPassword: {
  enabled: true,
  disableSignUp: true  // Seuls les admins peuvent créer des comptes
}
```

---

## 🐛 Dépannage

### Erreur "Invalid email or password"
- Vérifiez que l'email et le mot de passe sont corrects
- Le mot de passe doit faire minimum 8 caractères

### Erreur "User already exists"
- Cet email est déjà enregistré
- Utilisez la connexion au lieu de l'inscription

### Session null après connexion
- Vérifiez que le token est bien envoyé dans les headers
- Format : `Authorization: Bearer <token>`

### CORS errors
- Ajoutez l'origine frontend dans `trustedOrigins` (`server/src/auth.ts`)

---

## 📚 Ressources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Email & Password Guide](https://www.better-auth.com/docs/authentication/email-password)
- [MongoDB Adapter](https://www.better-auth.com/docs/integrations/mongodb)

---

**✅ Votre système d'authentification est prêt !**

Testez-le dès maintenant avec les commandes cURL ci-dessus ! 🚀
