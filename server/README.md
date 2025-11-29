# Backend Server - MongoDB + Mongoose

## 🚀 Configuration Rapide

### Prérequis

- Node.js 18+
- Compte MongoDB Atlas (gratuit)

### Installation

```powershell
cd server
npm install
```

### Configuration MongoDB Atlas

1. **Créer un compte** sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Créer un cluster gratuit (M0)**

3. **Créer un utilisateur de base de données** :
   - Database Access → Add New Database User
   - Notez le username et password

4. **Configurer l'accès réseau** :
   - Network Access → Add IP Address
   - Autorisez `0.0.0.0/0` (dev) ou votre IP

5. **Mettre à jour `.env`** :

```env
MONGODB_USERNAME=votre_username
MONGODB_PASSWORD=votre_password
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE_NAME=application-vente
MONGODB_PARAMS=?retryWrites=true&w=majority
MONGODB_APP_NAME=ApplicationVente
```

### Lancer le serveur

```powershell
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

---

## 📊 Structure de la Base de Données

### Collections MongoDB (Mongoose)

#### `User`
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password: String,
  hasAcre: Boolean,
  acreStartDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### `SupplierOrder`
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  supplier: String,
  purchaseDate: Date,
  totalCost: Number,
  shippingCost: Number,
  customsCost: Number,
  otherFees: Number,
  notes: String,
  status: 'active' | 'completed',
  createdAt: Date,
  updatedAt: Date
}
```

#### `Product`
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  supplierOrderId: ObjectId,
  name: String,
  size: String,
  quantity: Number,
  unitCost: Number,
  salePrice: Number,
  soldPrice: Number,
  status: 'in_stock' | 'listed' | 'sold',
  // ... autres champs
}
```

---

## 🔧 Scripts Disponibles

```powershell
# Développement
npm run dev                 # Démarrer le serveur en mode dev

# Production
npm run build               # Compiler TypeScript
npm run start               # Démarrer le serveur compilé
```

---

## 📁 Structure du Projet

```
server/
├── src/
│   ├── index.ts                 # Point d'entrée
│   ├── auth.ts                  # Configuration Better Auth
│   ├── config/
│   │   ├── env.ts              # Variables d'environnement
│   │   └── constants.ts        # Constantes
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── health.controller.ts
│   │   └── order.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── order.service.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── health.routes.ts
│   │   └── order.routes.ts
│   ├── middleware/
│   │   ├── auth-guard.ts
│   │   └── error-handler.ts
│   ├── lib/
│   │   ├── prisma.ts           # Client Prisma singleton
│   │   └── logger.ts
│   └── types/
│       ├── api.ts
│       ├── auth.ts
│       └── order.ts
├── prisma/
│   └── schema.prisma            # Schéma MongoDB
├── setup-mongodb.js             # Script de configuration
├── .env                         # Variables d'environnement (git-ignored)
└── package.json
```

---

## 🔐 Variables d'Environnement

Fichier `.env` :

```env
# Serveur
PORT=5000
NODE_ENV=development

# MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority"

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Important :**
- Ne commitez JAMAIS le fichier `.env`
- Utilisez des secrets forts en production
- Encodez les caractères spéciaux dans le mot de passe MongoDB

---

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/session` - Session actuelle

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Supprimer une commande

### Santé
- `GET /api/health` - Status du serveur

Documentation complète : [`docs/API.md`](../docs/API.md)

---

## 🧪 Tests

```powershell
# À venir
npm test
```

---

## 🐛 Dépannage

### "Authentication failed"
- Vérifiez les identifiants MongoDB dans `.env`
- Vérifiez que le mot de passe est encodé (caractères spéciaux)
- Vérifiez que l'utilisateur existe sur MongoDB Atlas

### "IP not whitelisted"
- Allez dans **Network Access** sur MongoDB Atlas
- Ajoutez votre IP ou `0.0.0.0/0` (dev uniquement)

### "Cannot find module '@prisma/client'"
```powershell
npm install
npm run db:generate
```

### "Port 5000 already in use"
- Changez `PORT=5001` dans `.env`
- Ou tuez le processus : `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`

---

## 🚀 Déploiement

### Prérequis Production
1. **Sécurisez MongoDB Atlas** :
   - Restreignez les IPs autorisées
   - Utilisez un mot de passe fort
   - Activez l'audit logging

2. **Variables d'environnement** :
   - Utilisez les variables d'env de votre plateforme
   - Ne commitez JAMAIS `.env`
   - Changez `BETTER_AUTH_SECRET`

3. **Build** :
```powershell
npm run build
npm start
```

---

## 📖 Ressources

- [Documentation MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Documentation Prisma MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Documentation Better Auth](https://www.better-auth.com/)
- [Guide Architecture SOLID](../docs/ARCHITECTURE.md)

---

## 💡 Bonnes Pratiques

### Code
- ✅ Types stricts TypeScript
- ✅ Séparation des responsabilités (SOLID)
- ✅ Gestion d'erreurs centralisée
- ✅ Validation des inputs (Zod)
- ✅ Noms explicites

### Base de Données
- ✅ Utilisez les index pour les performances
- ✅ Validez les données avant insertion
- ✅ Gérez les relations avec ObjectId
- ✅ Nettoyez les données obsolètes
- ✅ Backups réguliers (auto sur Atlas)

### Sécurité
- ✅ Authentification sur toutes les routes sensibles
- ✅ Validation des inputs
- ✅ Rate limiting (à implémenter)
- ✅ HTTPS en production
- ✅ Secrets sécurisés

---

**🎉 Votre backend est prêt à fonctionner avec MongoDB Atlas !**
