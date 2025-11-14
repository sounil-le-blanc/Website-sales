import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/daytapes/[date]
export async function GET(
  _req: Request,
   { params }: { params: Promise<{ date: string }> }
) {

  const { date } = await params 

  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer la DayTape avec ses events
    const dayTape = await prisma.dayTape.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: date
        }
      },
      include: {
        events: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!dayTape) {
      return NextResponse.json({ error: 'DayTape non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ dayTape })

  } catch (error) {
    console.error('Erreur lors de la récupération de la DayTape:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/daytapes/[date] - Supprimer une DayTape
export async function DELETE(
  request: NextRequest,
   { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Vérifier que la DayTape existe et appartient à l'utilisateur
    const dayTape = await prisma.dayTape.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: date
        }
      }
    })

    if (!dayTape) {
      return NextResponse.json({ error: 'DayTape non trouvée' }, { status: 404 })
    }

    // Supprimer la DayTape (les events seront supprimés en cascade)
    await prisma.dayTape.delete({
      where: { id: dayTape.id }
    })

    return NextResponse.json({ message: 'DayTape supprimée' })

  } catch (error) {
    console.error('Erreur lors de la suppression de la DayTape:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}