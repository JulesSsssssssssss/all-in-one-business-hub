# 🧪 Guide de Test - Routes d'Authentification

## ⚠️ Important

Le serveur doit être en cours d'exécution dans un terminal séparé avant de lancer les tests.

## 📋 Instructions

### Étape 1: Démarrer le serveur

**Dans le Terminal 1** (laissez-le ouvert):
```powershell
cd C:\Users\Utilisateur\Documents\Application\server
npm run dev
```

Attendez de voir:
```
✅ Connected to MongoDB database: Vintedatabase
[Server] ℹ️ Server started on http://localhost:5000
```

---

### Étape 2: Exécuter les tests

**Dans un NOUVEAU Terminal 2** (PowerShell):

#### Option A: Script de test complet (RECOMMANDÉ)
```powershell
cd C:\Users\Utilisateur\Documents\Application\server
.\test-all-routes.ps1
```

Ce script va tester automatiquement:
- ✅ Health Check
- ✅ Sign Up (Inscription)
- ✅ Sign In (Connexion)
- ✅ Get Session
- ✅ Sign Out (Déconnexion)

#### Option B: Tests manuels un par un

##### 1️⃣ Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

##### 2️⃣ Sign Up (Créer un utilisateur)
```powershell
$body = @{
    email = "test123@example.com"
    password = "Test1234"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-up/email" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

##### 3️⃣ Sign In (Se connecter)
```powershell
$body = @{
    email = "test123@example.com"
    password = "Test1234"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-in/email" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session

# Afficher la réponse
$response | ConvertTo-Json -Depth 10
```

##### 4️⃣ Get Session (Récupérer la session)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/get-session" `
    -Method GET `
    -WebSession $session
```

##### 5️⃣ Sign Out (Se déconnecter)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-out" `
    -Method POST `
    -WebSession $session
```

---

## 🎯 Résultats Attendus

### Health Check
```json
{
  "success": true,
  "data": {
    "status": "Server is running"
  },
  "statusCode": 200
}
```

### Sign Up
```json
{
  "user": {
    "id": "674557e123abc...",
    "email": "test123@example.com",
    "name": "Test User",
    "emailVerified": false,
    "image": null,
    "createdAt": "2025-11-25T...",
    "updatedAt": "2025-11-25T..."
  },
  "session": {
    "token": "eyJhb...",
    "expiresAt": "2025-12-02T..."
  }
}
```

### Sign In
```json
{
  "user": {
    "id": "674557e123abc...",
    "email": "test123@example.com",
    "name": "Test User"
  },
  "session": {
    "token": "eyJhb...",
    "expiresAt": "2025-12-02T..."
  }
}
```

### Get Session
```json
{
  "user": {
    "id": "674557e123abc...",
    "email": "test123@example.com",
    "name": "Test User"
  },
  "session": {
    "id": "session_abc123...",
    "userId": "674557e123abc...",
    "expiresAt": "2025-12-02T...",
    "ipAddress": null,
    "userAgent": null
  }
}
```

### Sign Out
```json
{
  "success": true
}
```

---

## ❌ Erreurs Possibles

### Erreur 400 - Email déjà utilisé
```json
{
  "error": "User already exists"
}
```
**Solution**: Utilisez un autre email ou connectez-vous avec l'email existant

### Erreur 401 - Non authentifié
```json
{
  "error": "Invalid credentials"
}
```
**Solution**: Vérifiez que l'email et le mot de passe sont corrects

### Erreur de connexion
```
Invoke-RestMethod : Unable to connect to the remote server
```
**Solution**: Vérifiez que le serveur tourne dans le Terminal 1

---

## 🔍 Vérifier dans MongoDB

Après avoir créé un utilisateur, vous pouvez vérifier dans **MongoDB Atlas**:

1. Connectez-vous à https://cloud.mongodb.com
2. Allez dans votre cluster `vintedatabase`
3. Cliquez sur "Browse Collections"
4. Vous devriez voir les collections:
   - **user** - Contient les utilisateurs créés
   - **session** - Contient les sessions actives
   - **account** - Comptes liés (vide pour l'instant)

---

## 📝 Notes

- Le mot de passe doit faire entre **8 et 128 caractères**
- L'email doit être **unique**
- Les sessions expirent après **7 jours**
- Les cookies sont **HTTPOnly** pour la sécurité

---

## 🚀 Prochaine Étape

Une fois tous les tests passés, consultez `AUTH_SETUP_COMPLETE.md` pour configurer le frontend Next.js !
