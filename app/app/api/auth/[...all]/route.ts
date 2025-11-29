import { toNextJsHandler } from 'better-auth/next-js'
import { createAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  try {
    const auth = await createAuth()
    const handlers = toNextJsHandler(auth)
    return handlers.GET(req)
  } catch (error) {
    console.error('Auth GET error:', error)
    return NextResponse.json(
      { error: 'Authentication service unavailable', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const POST = async (req: Request) => {
  try {
    const auth = await createAuth()
    const handlers = toNextJsHandler(auth)
    return handlers.POST(req)
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json(
      { error: 'Authentication service unavailable', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
