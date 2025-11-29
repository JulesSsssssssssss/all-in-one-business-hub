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
    const status = searchParams.get('status')

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('supplierOrders')

    // Construire la query
    const query: any = { userId }
    if (status) {
      query.status = status
    }

    // Récupérer les commandes
    const orders = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching supplier orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
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
    if (!body.name || !body.supplier || !body.totalCost) {
      return NextResponse.json(
        { error: 'Missing required fields: name, supplier, totalCost' },
        { status: 400 }
      )
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('supplierOrders')

    // Créer la commande
    const order = {
      userId,
      name: body.name,
      supplier: body.supplier,
      purchaseDate: new Date(body.purchaseDate || Date.now()),
      totalCost: body.totalCost,
      shippingCost: body.shippingCost || 0,
      customsCost: body.customsCost || 0,
      otherFees: body.otherFees || 0,
      notes: body.notes || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(order)

    return NextResponse.json(
      {
        message: 'Supplier order created successfully',
        order: { ...order, _id: result.insertedId }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating supplier order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
