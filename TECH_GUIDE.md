# 📚 Guide Technique et Recommandations

## 🗄️ Base de Données - Recommandations

### Option 1: **SQLite (Recommandé pour commencer)** ✅
**Advantages:**
- ✅ Aucun serveur à gérer
- ✅ Parfait pour développement et prototypage
- ✅ Configuration simple
- ✅ Stocké localement dans un fichier

**Inconvénients:**
- ⚠️ Pas idéal pour applications multi-utilisateurs en production
- ⚠️ Performances limitées sous charge

**Configuration:**
```env
DATABASE_URL=file:./dev.db
```

**Utilisation avec Prisma:**
```bash
npx prisma migrate dev --name init
npx prisma db push
```

---

### Option 2: **PostgreSQL + Railway** (Production-ready)
**Advantages:**
- ✅ Gratuit (avec limites raisonnables)
- ✅ Scalable et performant
- ✅ Parfait pour production

**Étapes:**
1. Créer un compte sur [Railway.app](https://railway.app/)
2. Créer une nouvelle base PostgreSQL
3. Copier l'URL de connexion dans `.env`

**Configuration:**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

### Option 3: **Supabase** (PostgreSQL + Auth gratuite)
**Advantages:**
- ✅ PostgreSQL hébergé
- ✅ Auth intégrée
- ✅ API GraphQL/REST
- ✅ Gratuit avec bonnes limites

**Lien:** [supabase.com](https://supabase.com/)

---

## 📦 Bibliothèques Installées et Leur Rôle

### **Frontend (React)**

| Libraire | Rôle | Documentation |
|----------|------|---------------|
| `react` | Framework UI | [react.dev](https://react.dev/) |
| `react-dom` | Rendu React | [react.dev](https://react.dev/) |
| `typescript` | Typage statique | [typescriptlang.org](https://www.typescriptlang.org/) |
| `react-router-dom` | Routage d'application | [reactrouter.com](https://reactrouter.com/) |
| `axios` | Requêtes HTTP | [axios-http.com](https://axios-http.com/) |
| `zustand` | State management léger | [zustand-demo.vercel.app](https://zustand-demo.vercel.app/) |
| `better-auth` | Authentification | [betterauth.dev](https://www.betterauth.dev/) |
| `tailwindcss` | CSS utilitaires | [tailwindcss.com](https://tailwindcss.com/) |

### **Backend (Node.js)**

| Libraire | Rôle | Documentation |
|----------|------|---------------|
| `express` | Framework web | [expressjs.com](https://expressjs.com/) |
| `typescript` | Typage statique | [typescriptlang.org](https://www.typescriptlang.org/) |
| `prisma` | ORM puissant | [prisma.io](https://www.prisma.io/) |
| `@prisma/client` | Client Prisma | [prisma.io](https://www.prisma.io/) |
| `zod` | Validation de schémas | [zod.dev](https://zod.dev/) |
| `cors` | Gestion CORS | [expressjs.com/en/resources/middleware/cors.html](https://expressjs.com/en/resources/middleware/cors.html) |
| `dotenv` | Variables d'environnement | [github.com/motdotla/dotenv](https://github.com/motdotla/dotenv) |

---

## 🔐 Better Auth - Setup

### Installation côté Backend:
```bash
npm install better-auth
npm install --save-dev @better-auth/core
```

### Configuration de base:
```typescript
// server/src/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
```

---

## 🎨 shadcn/ui - Installation

### Command d'installation:
```bash
npx shadcn-ui@latest init
```

### Sélectionner des composants:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
```

### Composants recommandés pour commencer:
- `button` - Boutons
- `card` - Cartes
- `form` - Formulaires
- `input` - Champs texte
- `dialog` - Modales

---

## 🚀 Prochaines Étapes

1. **Setup Prisma:**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

2. **Configurer Better Auth dans le serveur**

3. **Installer shadcn UI:**
   ```bash
   cd client
   npx shadcn-ui@latest init
   ```

4. **Tester la connexion API:**
   - Lancer le serveur: `npm run dev` (depuis `server/`)
   - Lancer le client: `npm start` (depuis `client/`)

---

## 📖 Ressources Utiles

- **Better Auth:** [betterauth.dev](https://www.betterauth.dev/)
- **Prisma ORM:** [prisma.io](https://www.prisma.io/)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com/)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/)
- **React Router:** [reactrouter.com](https://reactrouter.com/)
- **Zod Validation:** [zod.dev](https://zod.dev/)
- **Zustand:** [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
