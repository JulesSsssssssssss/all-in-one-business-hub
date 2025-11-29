#!/bin/bash

# Script de déploiement rapide pour Vercel
# Usage: ./deploy-vercel.sh

echo "🚀 Déploiement All-in-One Business Hub sur Vercel"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -d "app" ]; then
  echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
  exit 1
fi

# Installer Vercel CLI si nécessaire
if ! command -v vercel &> /dev/null; then
  echo "📦 Installation de Vercel CLI..."
  npm install -g vercel
fi

# Se déplacer dans le dossier app
cd app

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
fi

echo ""
echo "📋 Configuration requise pour Vercel:"
echo ""
echo "Variables d'environnement à ajouter dans Vercel Dashboard:"
echo "-----------------------------------------------------------"
echo "MONGODB_USERNAME=databaseApp"
echo "MONGODB_PASSWORD=Jumarin49"
echo "MONGODB_HOST=vintedatabase.laep9wk.mongodb.net"
echo "MONGODB_DATABASE_NAME=Vintedatabase"
echo "MONGODB_PARAMS=retryWrites=true&w=majority"
echo "MONGODB_APP_NAME=Vintedatabase"
echo ""
echo "BETTER_AUTH_SECRET=<générer avec: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\">"
echo "BETTER_AUTH_URL=https://all-in-one-business-hub.vercel.app"
echo "NEXTAUTH_URL=https://all-in-one-business-hub.vercel.app"
echo ""
echo "⚠️  Ne pas définir NEXT_PUBLIC_API_URL (on utilise le même domaine)"
echo ""

read -p "Avez-vous configuré ces variables dans Vercel Dashboard? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Veuillez d'abord configurer les variables sur Vercel Dashboard:"
  echo "   https://vercel.com/dashboard → Projet → Settings → Environment Variables"
  exit 1
fi

echo ""
echo "🏗️  Lancement du déploiement Vercel..."
echo ""

# Déployer
vercel --prod

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🧪 Tests à effectuer:"
echo "  1. https://all-in-one-business-hub.vercel.app/api/health"
echo "  2. https://all-in-one-business-hub.vercel.app/auth/register"
echo "  3. https://all-in-one-business-hub.vercel.app/dashboard"
echo ""
echo "🔍 Vérifier la console du navigateur : aucune erreur CORS ne devrait apparaître"
