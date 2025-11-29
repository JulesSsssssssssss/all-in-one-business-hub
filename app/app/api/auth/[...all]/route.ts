import { toNextJsHandler } from 'better-auth/next-js'
import { createAuth } from '@/lib/auth'

export const GET = async (req: Request) => {
  const auth = await createAuth()
  const handlers = toNextJsHandler(auth)
  return handlers.GET(req)
}

export const POST = async (req: Request) => {
  const auth = await createAuth()
  const handlers = toNextJsHandler(auth)
  return handlers.POST(req)
}
