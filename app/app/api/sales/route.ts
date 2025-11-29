import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const endpoint = searchParams.get('endpoint')
  
  // TODO: Implémenter avec MongoDB
  if (endpoint === 'stats') {
    return NextResponse.json({
      totalRevenue: 0,
      totalProfit: 0,
      totalProducts: 0,
      soldProducts: 0,
      listedProducts: 0,
      averageMargin: 0
    })
  }
  
  // Liste des produits
  return NextResponse.json({ products: [], total: 0 })
}

export async function POST() {
  // TODO: Implémenter avec MongoDB
  return NextResponse.json({ 
    message: 'Product creation not yet implemented',
    success: false 
  }, { status: 501 })
}
