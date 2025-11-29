import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Ne jamais exposer les vraies valeurs en production
  const isDev = process.env.NODE_ENV === 'development'
  
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_USERNAME: process.env.MONGODB_USERNAME ? '✅ Set' : '❌ Missing',
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD ? '✅ Set' : '❌ Missing',
    MONGODB_HOST: process.env.MONGODB_HOST ? '✅ Set' : '❌ Missing',
    MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME ? '✅ Set' : '❌ Missing',
    MONGODB_PARAMS: process.env.MONGODB_PARAMS ? '✅ Set' : '⚠️ Using default',
    MONGODB_APP_NAME: process.env.MONGODB_APP_NAME ? '✅ Set' : '⚠️ Using default',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? '✅ Set' : '❌ Missing',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? '✅ Set' : '⚠️ Using default',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '⚠️ Using default',
    VERCEL_URL: process.env.VERCEL_URL ? `✅ ${process.env.VERCEL_URL}` : '❌ Not on Vercel',
  }

  // En dev, montrer les valeurs (masquées)
  if (isDev) {
    return NextResponse.json({
      ...envCheck,
      debug: {
        MONGODB_HOST: process.env.MONGODB_HOST,
        MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      }
    })
  }

  return NextResponse.json(envCheck)
}
