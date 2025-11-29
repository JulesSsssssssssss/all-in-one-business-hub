import { MongoClient, ServerApiVersion } from 'mongodb'

// Fonction pour construire l'URI MongoDB (lazy)
function getMongoUri(): string {
  const username = process.env.MONGODB_USERNAME
  const password = process.env.MONGODB_PASSWORD
  const host = process.env.MONGODB_HOST
  const database = process.env.MONGODB_DATABASE_NAME
  const params = process.env.MONGODB_PARAMS || 'retryWrites=true&w=majority'
  const appName = process.env.MONGODB_APP_NAME || 'VinteApp'

  if (!username || !password || !host || !database) {
    const missing = []
    if (!username) missing.push('MONGODB_USERNAME')
    if (!password) missing.push('MONGODB_PASSWORD')
    if (!host) missing.push('MONGODB_HOST')
    if (!database) missing.push('MONGODB_DATABASE_NAME')
    throw new Error(`Missing MongoDB environment variables: ${missing.join(', ')}`)
  }

  return `mongodb+srv://${username}:${password}@${host}/${database}?${params}&appName=${appName}`
}

// Nom de la base de données  
export const dbName = process.env.MONGODB_DATABASE_NAME ?? 'application-vente-db'

// Create a MongoClient with caching for serverless
let cachedClient: MongoClient | null = null
let cachedDb: any = null

/**
 * Connexion MongoDB native (pour Better Auth) - Optimisée pour serverless
 */
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = getMongoUri()
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 5,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  await client.connect()
  await client.db('admin').command({ ping: 1 })
  
  const db = client.db(dbName)
  
  cachedClient = client
  cachedDb = db
  
  console.log('✅ Connected to MongoDB database:', dbName)
  
  return { client, db }
}

/**
 * Obtenir le client MongoDB (pour Better Auth)
 */
async function getMongoClient(): Promise<MongoClient> {
  const { client } = await connectToDatabase()
  return client
}

/**
 * Obtenir la database MongoDB
 */
async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}

export { 
  connectToDatabase, 
  getMongoClient,
  getDatabase
}
