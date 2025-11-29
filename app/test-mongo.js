const { MongoClient } = require('mongodb');
const fs = require('fs');

// Charger .env.local manuellement
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME}`;

console.log('🔗 Tentative de connexion à MongoDB...');
console.log('Host:', process.env.MONGODB_HOST);
console.log('Database:', process.env.MONGODB_DATABASE_NAME);

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connexion réussie!');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping réussi!');
    const dbs = await client.db().admin().listDatabases();
    console.log('📦 Bases disponibles:', dbs.databases.map(d => d.name));
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

test();
