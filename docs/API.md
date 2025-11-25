# 📚 Documentation API

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentification

### POST /auth/register
Enregistrer un nouvel utilisateur.

**Request:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "jean@example.com",
    "name": "Jean Dupont"
  },
  "statusCode": 201
}
```

**Errors:**
- `400` - Champs manquants
- `400` - Email invalide
- `400` - Mot de passe faible (< 8 caractères)
- `409` - Email déjà utilisé

---

### POST /auth/login
Connecter un utilisateur.

**Request:**
```json
{
  "email": "jean@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "jean@example.com",
    "name": "Jean Dupont"
  },
  "statusCode": 200
}
```

**Errors:**
- `400` - Champs manquants
- `401` - Identifiants invalides

---

### GET /auth/me
Récupérer l'utilisateur courant (protégé).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "jean@example.com",
    "name": "Jean Dupont"
  },
  "statusCode": 200
}
```

**Errors:**
- `401` - Non authentifié
- `401` - Token invalide

---

## 🏥 Health Check

### GET /health
Vérifier l'état du serveur.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "Server is running",
    "timestamp": "2025-11-17T20:30:00Z"
  },
  "statusCode": 200
}
```

---

## 📊 Format de Réponse Standard

Toutes les réponses API suivent ce format:

```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "statusCode": number
}
```

### Codes de Statut
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Validation

### Email
- Format valide: `test@example.com`
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Mot de passe
- Minimum 8 caractères
- Maximum 128 caractères
- Pas d'autres restrictions pour le MVP

### Nom
- Requis pour l'inscription
- Minimum 1 caractère

---

## 🛣️ Constantes Frontend

### Routes
```typescript
/                 // Home
/auth/login       // Login
/auth/register    // Register
/dashboard        // Dashboard (protégé)
```

### API Endpoints
```typescript
/auth/login       // POST
/auth/register    // POST
/auth/logout      // POST
/auth/me          // GET
/health           // GET
```

---

## 🚀 À Venir

- [ ] POST /auth/logout
- [ ] POST /auth/refresh-token
- [ ] GET /users/:id
- [ ] PATCH /users/:id
- [ ] DELETE /users/:id
- [ ] POST /auth/forgot-password
- [ ] POST /auth/reset-password
