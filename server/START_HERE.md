# 🚀 Démarrage Rapide - Backend MongoDB

## ✅ Migration Prisma → MongoDB + Mongoose Complétée !

Votre backend utilise maintenant **MongoDB natif avec Mongoose** (comme le projet tamagocho).

---

## 📋 Checklist Configuration

### 1️⃣ Compte MongoDB Atlas

- [ ] Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Créer un cluster gratuit (M0)
- [ ] Créer un utilisateur de base de données
- [ ] Configurer l'accès réseau (0.0.0.0/0)

### 2️⃣ Configuration .env

Mettez à jour `server/.env` avec vos identifiants :

```env
MONGODB_USERNAME=votre_username
MONGODB_PASSWORD=votre_password
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE_NAME=application-vente
```

### 3️⃣ Installation

```powershell
cd server
npm install
```

### 4️⃣ Lancement

```powershell
npm run dev
```

✅ Le serveur démarre sur `http://localhost:5000`

---

## 🏗️ Structure des Modèles

### 📁 Fichiers créés

```
server/src/
├── db/
│   ├── index.ts                    # Connexion MongoDB + Mongoose
│   └── models/
│       ├── user.model.ts           # Utilisateurs
│       ├── supplier-order.model.ts # Commandes fournisseurs
│       └── product.model.ts        # Produits
└── auth.ts                         # Better Auth avec mongodbAdapter
```

### 📊 Collections MongoDB

1. **User** - Utilisateurs avec authentification
2. **SupplierOrder** - Commandes fournisseurs
3. **Product** - Produits individuels

---

## 🔄 Différences avec Prisma

| Avant (Prisma) | Après (Mongoose) |
|----------------|------------------|
| `schema.prisma` | Schémas TypeScript |
| `prisma generate` | Pas de génération |
| `prisma db push` | Mongoose crée auto |
| String IDs (`cuid`) | ObjectId MongoDB |
| Relations auto | `.populate()` manuel |

---

## 📚 Documentation

- **[MONGODB_MIGRATION.md](../docs/MONGODB_MIGRATION.md)** - Guide complet de migration
- **[README.md](./README.md)** - Documentation du serveur
- **[MONGODB_SETUP.md](../docs/MONGODB_SETUP.md)** - Configuration détaillée

---

## 🎯 Prochaines Étapes

1. ✅ Configurez votre compte MongoDB Atlas
2. ✅ Mettez à jour le fichier `.env`
3. ✅ Lancez le serveur : `npm run dev`
4. 🔄 Testez la connexion Better Auth
5. 🔄 Implémentez les services CRUD avec Mongoose

---

## 💡 Exemple d'Utilisation

### Créer un produit

```typescript
import Product from './db/models/product.model'
import { connectMongooseToDatabase } from './db'

async function createProduct() {
  await connectMongooseToDatabase()
  
  const product = await Product.create({
    userId: '507f1f77bcf86cd799439011',
    supplierOrderId: '507f1f77bcf86cd799439012',
    name: 'Nike Air Max',
    size: '42',
    quantity: 1,
    unitCost: 75,
    salePrice: 120,
    purchaseDate: new Date(),
    status: 'in_stock'
  })
  
  console.log('Product created:', product._id)
}
```

---

**🎉 Votre backend est prêt avec MongoDB + Mongoose !**
