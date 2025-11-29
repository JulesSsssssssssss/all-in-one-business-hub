# Test des endpoints d'authentification Better Auth

Le serveur doit être en cours d'exécution sur http://localhost:5000

## 1. Test Health Check

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```

**Résultat attendu:**
```json
{
  "success": true,
  "data": {
    "status": "Server is running"
  },
  "statusCode": 200
}
```

---

## 2. Test Sign Up (Inscription)

**Windows PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "Test1234"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-up/email" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Résultat attendu:**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "session": {
    "token": "...",
    "expiresAt": "..."
  }
}
```

---

## 3. Test Sign In (Connexion)

**Windows PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "Test1234"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-in/email" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session

$response
```

**Résultat attendu:**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "session": {
    "token": "...",
    "expiresAt": "..."
  }
}
```

---

## 4. Test Get Session

**Windows PowerShell (après Sign In):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/get-session" `
    -Method GET `
    -WebSession $session
```

**Résultat attendu:**
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "session": {
    "id": "...",
    "userId": "...",
    "expiresAt": "..."
  }
}
```

---

## 5. Test Sign Out

**Windows PowerShell (après Sign In):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-out" `
    -Method POST `
    -WebSession $session
```

**Résultat attendu:**
```json
{
  "success": true
}
```

---

## Tester avec curl (si disponible)

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}' \
  -c cookies.txt
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  -c cookies.txt
```

### Get Session
```bash
curl -X GET http://localhost:5000/api/auth/get-session \
  -b cookies.txt
```

### Sign Out
```bash
curl -X POST http://localhost:5000/api/auth/sign-out \
  -b cookies.txt
```

---

## Vérifier les collections MongoDB

Après avoir créé un utilisateur, vérifiez dans MongoDB Atlas que les collections suivantes ont été créées :

- `user` - Contient les informations utilisateur
- `session` - Contient les sessions actives
- `account` - Contient les comptes liés (pour OAuth)

---

## Codes d'erreur possibles

| Code | Signification |
|------|--------------|
| 200  | Succès |
| 400  | Requête invalide (email déjà utilisé, mot de passe trop court, etc.) |
| 401  | Non authentifié (mauvais email/mot de passe) |
| 500  | Erreur serveur |

---

## Notes

- Le mot de passe doit faire entre 8 et 128 caractères
- L'email doit être valide et unique
- Les sessions expirent après 7 jours
- Les cookies sont utilisés pour maintenir la session
