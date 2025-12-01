import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { createAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const endpoint = searchParams.get('endpoint')
    
    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')
    
    // Endpoint stats
    if (endpoint === 'stats') {
      const [totalProducts, sold, listed, inStock] = await Promise.all([
        collection.countDocuments({ userId }),
        collection.countDocuments({ userId, status: 'sold' }),
        collection.countDocuments({ userId, status: 'listed' }),
        collection.countDocuments({ userId, status: { $in: ['in_stock', 'in_stock_euros', 'to_list'] } })
      ])

      const soldItems = await collection
        .find({ userId, status: 'sold', soldPrice: { $exists: true } })
        .toArray()

      const totalRevenue = soldItems.reduce((sum: number, p: any) => sum + (p.soldPrice || 0), 0)
      const totalCost = soldItems.reduce((sum: number, p: any) => sum + (p.unitCost || 0) * (p.quantity || 1), 0)
      const totalProfit = totalRevenue - totalCost
      const averageMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0

      return NextResponse.json({
        totalProducts,
        inStock,
        listed,
        sold,
        totalRevenue,
        totalCost,
        totalProfit,
        averageMargin: Math.round(averageMargin * 100) / 100
      })
    }
    
    // Liste des produits avec filtres
    const status = searchParams.get('status')
    const supplierOrderId = searchParams.get('supplierOrderId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const query: any = { userId }
    if (status) query.status = status
    if (supplierOrderId) query.supplierOrderId = supplierOrderId

    const [products, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ])

    return NextResponse.json({ products, total })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    // Validation
    if (!body.name || !body.unitCost || !body.salePrice) {
      return NextResponse.json(
        { error: 'Missing required fields: name, unitCost, salePrice' },
        { status: 400 }
      )
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')

    // Créer le produit
    const product = {
      userId,
      supplierOrderId: body.supplierOrderId || null,
      name: body.name,
      brand: body.brand || '',
      size: body.size || '',
      quantity: body.quantity || 1,
      description: body.description || '',
      photos: body.photos || [],
      url: body.url || '',
      unitCost: body.unitCost,
      totalCost: body.totalCost || body.unitCost * (body.quantity || 1),
      purchaseDate: new Date(body.purchaseDate || Date.now()),
      salePrice: body.salePrice,
      soldPrice: body.soldPrice || null,
      soldTo: body.soldTo || null,
      soldDate: body.soldDate ? new Date(body.soldDate) : null,
      status: body.status || 'in_stock',
      condition: body.condition || '',
      platform: body.platform || '',
      listedDate: body.listedDate ? new Date(body.listedDate) : null,
      boosted: body.boosted || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(product)

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: { ...product, _id: result.insertedId }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
