# Configuration MongoDB Atlas

## 🎯 Guide de Configuration Complet

### Étape 1 : Créer un Cluster MongoDB Atlas

1. **Créer un compte** sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Créer un nouveau projet** (ex: "ApplicationVente")
3. **Créer un cluster** :
   - Choisir le plan **M0 (Free)** pour commencer
   - Sélectionner une région proche (ex: Europe - Paris)
   - Nom du cluster : `cluster0` (ou votre choix)

### Étape 2 : Configurer l'Accès

#### 2.1 Créer un utilisateur de base de données

1. Aller dans **Database Access**
2. Cliquer sur **Add New Database User**
3. Choisir **Password** comme méthode d'authentification
4. **Créer un nom d'utilisateur** et un **mot de passe sécurisé**
   - ⚠️ Notez-les précieusement !
5. Sélectionner **Read and write to any database**
6. Cliquer sur **Add User**

#### 2.2 Configurer l'accès réseau

1. Aller dans **Network Access**
2. Cliquer sur **Add IP Address**
3. **Option 1** (développement) : Cliquer sur **Allow Access from Anywhere** (0.0.0.0/0)
4. **Option 2** (production) : Ajouter votre IP spécifique
5. Cliquer sur **Confirm**

### Étape 3 : Obtenir la Chaîne de Connexion

1. Aller dans **Database** (dans le menu de gauche)
2. Cliquer sur **Connect** sur votre cluster
3. Choisir **Drivers**
4. Sélectionner **Node.js** et la version récente
5. **Copier la chaîne de connexion** qui ressemble à :

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Étape 4 : Configurer le Fichier .env

1. Ouvrir le fichier `server/.env`
2. Remplacer la ligne `DATABASE_URL` avec votre chaîne de connexion :

```env
# Remplacez :
# - <username> par votre nom d'utilisateur MongoDB
# - <password> par votre mot de passe MongoDB
# - Ajoutez le nom de la base après .net/ (ex: myDatabase)

DATABASE_URL="mongodb+srv://monuser:monmotdepasse@cluster0.xxxxx.mongodb.net/applicationVente?retryWrites=true&w=majority"
```

**⚠️ Important :**
- Remplacez `<username>` et `<password>` par vos identifiants
- Ajoutez le nom de votre database après `.mongodb.net/` (ex: `applicationVente`)
- Si votre mot de passe contient des caractères spéciaux, encodez-les en URL :
  - `@` → `%40`
  - `#` → `%23`
  - `/` → `%2F`
  - `:` → `%3A`

### Étape 5 : Générer et Pousser le Schéma

Une fois le `.env` configuré, exécutez les commandes suivantes :

```powershell
# Dans le dossier server
cd server

# Générer le client Prisma pour MongoDB
npx prisma generate

# Pousser le schéma vers MongoDB Atlas (crée les collections)
npx prisma db push
```

### Étape 6 : Vérifier la Connexion

```powershell
# Dans le dossier server
cd server

# Ouvrir Prisma Studio pour visualiser vos données
npx prisma studio
```

Prisma Studio devrait s'ouvrir sur `http://localhost:5555` et afficher vos collections MongoDB.

---

## 📊 Structure des Collections MongoDB

Votre base de données contiendra 3 collections principales :

### Collection `User`
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  name: "Jean Dupont",
  password: "hashed_password",
  hasAcre: false,
  acreStartDate: null,
  createdAt: ISODate("2025-11-25T..."),
  updatedAt: ISODate("2025-11-25T...")
}
```

### Collection `SupplierOrder`
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  name: "Lot Nike - Alibaba Mars 2025",
  supplier: "Alibaba",
  purchaseDate: ISODate("2025-03-15T..."),
  totalCost: 1500.00,
  shippingCost: 150.00,
  customsCost: 100.00,
  otherFees: 50.00,
  notes: "Première commande",
  status: "active",
  createdAt: ISODate("2025-11-25T..."),
  updatedAt: ISODate("2025-11-25T...")
}
```

### Collection `Product`
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  supplierOrderId: ObjectId("..."),
  name: "Nike Air Max 90",
  size: "42",
  quantity: 1,
  description: "Baskets neuves dans leur boîte",
  photos: "[]",
  unitCost: 75.00,
  purchaseDate: ISODate("2025-03-15T..."),
  salePrice: 120.00,
  soldPrice: null,
  soldTo: null,
  status: "in_stock",
  condition: "Neuf",
  platform: null,
  listedDate: null,
  soldDate: null,
  boosted: false,
  createdAt: ISODate("2025-11-25T..."),
  updatedAt: ISODate("2025-11-25T...")
}
```

---

## 🔧 Commandes Utiles

```powershell
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers MongoDB (sans migrations)
npx prisma db push

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Vérifier le schéma Prisma
npx prisma validate

# Formater le schéma Prisma
npx prisma format
```

---

## ❗ Troubleshooting

### Erreur : "Authentication failed"
- Vérifiez que le nom d'utilisateur et mot de passe sont corrects
- Vérifiez que les caractères spéciaux sont encodés en URL
- Vérifiez que l'utilisateur a les permissions nécessaires dans MongoDB Atlas

### Erreur : "IP not whitelisted"
- Allez dans **Network Access** sur MongoDB Atlas
- Ajoutez votre IP actuelle ou autorisez `0.0.0.0/0` (dev uniquement)

### Erreur : "Cannot find module '@prisma/client'"
```powershell
cd server
npm install @prisma/client
npx prisma generate
```

### Erreur : "Schema parsing failed"
- Vérifiez que le fichier `schema.prisma` est bien formaté
- Exécutez `npx prisma format` puis `npx prisma validate`

---

## 📚 Ressources

- [Documentation Prisma MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## 🔐 Sécurité en Production

**⚠️ Avant de déployer en production :**

1. **Ne commitez JAMAIS le fichier `.env`** (déjà dans `.gitignore`)
2. **Utilisez des variables d'environnement** sur votre plateforme de déploiement
3. **Restreignez l'accès réseau** à des IPs spécifiques
4. **Utilisez un mot de passe fort** pour l'utilisateur MongoDB
5. **Activez l'audit logging** sur MongoDB Atlas
6. **Créez des backups réguliers** (MongoDB Atlas le fait automatiquement)

---

## ✅ Checklist de Configuration

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster créé et actif
- [ ] Utilisateur de base de données créé
- [ ] Accès réseau configuré (IP whitelistée)
- [ ] Chaîne de connexion copiée
- [ ] Fichier `.env` mis à jour avec DATABASE_URL
- [ ] `npx prisma generate` exécuté avec succès
- [ ] `npx prisma db push` exécuté avec succès
- [ ] Prisma Studio s'ouvre et affiche les collections
- [ ] Serveur démarre sans erreur de connexion

---

**🎉 Votre base de données MongoDB Atlas est maintenant prête !**
