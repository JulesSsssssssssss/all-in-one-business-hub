import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { createAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params

    // Validation de l'ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('supplierOrders')

    // Récupérer la commande
    const order = await collection.findOne({
      _id: new ObjectId(id),
      userId
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching supplier order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params
    const body = await req.json()

    // Validation de l'ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('supplierOrders')

    // Construire les mises à jour
    const updates: any = { updatedAt: new Date() }
    
    if (body.name !== undefined) updates.name = body.name
    if (body.supplier !== undefined) updates.supplier = body.supplier
    if (body.purchaseDate !== undefined) updates.purchaseDate = new Date(body.purchaseDate)
    if (body.totalCost !== undefined) updates.totalCost = body.totalCost
    if (body.shippingCost !== undefined) updates.shippingCost = body.shippingCost
    if (body.customsCost !== undefined) updates.customsCost = body.customsCost
    if (body.otherFees !== undefined) updates.otherFees = body.otherFees
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.status !== undefined) updates.status = body.status

    // Mettre à jour la commande
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updates },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: result
    })
  } catch (error) {
    console.error('Error updating supplier order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params

    // Validation de l'ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('supplierOrders')

    // Supprimer la commande
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting supplier order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
