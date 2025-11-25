import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client, dbName, connectToDatabase } from './db'

const REQUIRED_MONGO_ENV_VARS = [
  'MONGODB_USERNAME',
  'MONGODB_PASSWORD',
  'MONGODB_HOST',
  'MONGODB_DATABASE_NAME',
  'MONGODB_PARAMS',
  'MONGODB_APP_NAME'
] as const

const DEFAULT_SESSION_TIMEOUT_MS = 3000

function hasMongoConfiguration (): boolean {
  return REQUIRED_MONGO_ENV_VARS.every((key) => Boolean(process.env[key]))
}

async function ensureDatabaseConnection (): Promise<void> {
  if (!hasMongoConfiguration()) {
    console.warn('BetterAuth initialisation skipped: missing MongoDB environment variables.')
    return
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.error('❌ Échec de connexion MongoDB pour BetterAuth:', error)
  }
}

// Assurer la connexion avant d'initialiser BetterAuth
void ensureDatabaseConnection()

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:5000',
  secret: process.env.BETTER_AUTH_SECRET ?? 'dev-secret-key-change-in-production',
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24 // 1 jour
  }
})

