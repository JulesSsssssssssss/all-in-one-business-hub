/**
 * Script de test de connexion MongoDB
 * Vérifie que la connexion à MongoDB Atlas fonctionne
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectMongooseToDatabase, connectToDatabase } from './db';

async function testConnection() {
  console.log('🔍 Test de connexion MongoDB Atlas...\n');
  
  try {
    // Test connexion MongoDB native (pour Better Auth)
    console.log('1️⃣ Test connexion MongoDB native...');
    await connectToDatabase();
    console.log('✅ Connexion MongoDB native réussie!\n');
    
    // Test connexion Mongoose (pour les modèles)
    console.log('2️⃣ Test connexion Mongoose...');
    await connectMongooseToDatabase();
    console.log('✅ Connexion Mongoose réussie!\n');
    
    console.log('🎉 Toutes les connexions fonctionnent parfaitement!');
    console.log('📊 Base de données:', process.env.MONGODB_DATABASE_NAME);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
  }
}

testConnection();
