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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')

    // Récupérer le produit
    const product = await collection.findOne({
      _id: new ObjectId(id),
      userId
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')

    // Construire les mises à jour
    const updates: any = { updatedAt: new Date() }
    
    if (body.name !== undefined) updates.name = body.name
    if (body.brand !== undefined) updates.brand = body.brand
    if (body.size !== undefined) updates.size = body.size
    if (body.quantity !== undefined) updates.quantity = body.quantity
    if (body.description !== undefined) updates.description = body.description
    if (body.photos !== undefined) updates.photos = body.photos
    if (body.url !== undefined) updates.url = body.url
    if (body.unitCost !== undefined) updates.unitCost = body.unitCost
    if (body.totalCost !== undefined) updates.totalCost = body.totalCost
    if (body.purchaseDate !== undefined) updates.purchaseDate = new Date(body.purchaseDate)
    if (body.salePrice !== undefined) updates.salePrice = body.salePrice
    if (body.soldPrice !== undefined) updates.soldPrice = body.soldPrice
    if (body.soldTo !== undefined) updates.soldTo = body.soldTo
    if (body.soldDate !== undefined) updates.soldDate = new Date(body.soldDate)
    if (body.status !== undefined) updates.status = body.status
    if (body.condition !== undefined) updates.condition = body.condition
    if (body.platform !== undefined) updates.platform = body.platform
    if (body.listedDate !== undefined) updates.listedDate = new Date(body.listedDate)
    if (body.boosted !== undefined) updates.boosted = body.boosted

    // Mettre à jour le produit
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updates },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: result
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')

    // Supprimer le produit
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
