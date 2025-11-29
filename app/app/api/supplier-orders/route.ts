import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implémenter avec MongoDB
  return NextResponse.json({ orders: [] })
}

export async function POST() {
  // TODO: Implémenter avec MongoDB
  return NextResponse.json({ 
    message: 'Order creation not yet implemented',
    success: false 
  }, { status: 501 })
}
