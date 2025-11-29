import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

// Helper pour créer l'instance Better Auth (utilisé dans les API routes)
// Cette fonction est async et ne se connecte QUE quand elle est appelée
export async function createAuth() {
  // Import dynamique pour éviter l'exécution au build time
  const { getMongoClient } = await import('./db')
  const client = await getMongoClient()
  
  return betterAuth({
    database: mongodbAdapter(client.db(process.env.MONGODB_DATABASE_NAME!)),
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    secret: process.env.BETTER_AUTH_SECRET ?? 'dev-secret-key-change-in-production',
    trustedOrigins: [
      'http://localhost:3000',
      process.env.NEXTAUTH_URL || '',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
    ].filter(Boolean),
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
}
