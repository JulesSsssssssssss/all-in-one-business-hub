import { z } from 'zod';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // MongoDB variables (optionnel pour le moment)
  MONGODB_USERNAME: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),
  MONGODB_HOST: z.string().optional(),
  MONGODB_DATABASE_NAME: z.string().optional(),
  MONGODB_PARAMS: z.string().optional(),
  MONGODB_APP_NAME: z.string().optional(),
  // Better Auth
  BETTER_AUTH_SECRET: z.string().default('dev-secret-key-change-in-production'),
  BETTER_AUTH_URL: z.string().default('http://localhost:5000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

type Environment = z.infer<typeof envSchema>;

function validateEnv(): Environment {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error('❌ Erreur de configuration des variables d\'environnement:');
    console.error(env.error.issues);
    process.exit(1);
  }

  return env.data;
}

export const config = validateEnv();
