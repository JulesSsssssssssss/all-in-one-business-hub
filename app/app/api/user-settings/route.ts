import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { createAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('user')
    
    const user = await usersCollection.findOne(
      { id: session.user.id },
      { projection: { hasAcre: 1, acreStartDate: 1 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      hasAcre: user.hasAcre || false,
      acreStartDate: user.acreStartDate || null,
    })
  } catch (error) {
    console.error('Erreur GET /api/settings:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hasAcre, acreStartDate } = body

    if (typeof hasAcre !== 'boolean') {
      return NextResponse.json(
        { error: 'Le champ hasAcre doit être un booléen' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('user')

    const result = await usersCollection.updateOne(
      { id: session.user.id },
      { 
        $set: { 
          hasAcre,
          acreStartDate: acreStartDate ? new Date(acreStartDate) : null,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      hasAcre,
      acreStartDate,
    })
  } catch (error) {
    console.error('Erreur PUT /api/settings:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
