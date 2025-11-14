import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/daytapes - Liste des DayTapes de l'utilisateur
export async function GET(request: NextRequest) {
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

    // Récupérer les DayTapes avec compteur d'events
    const dayTapes = await prisma.dayTape.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { events: true }
        }
      }
    })

    return NextResponse.json({ 
      dayTapes: dayTapes.map(dt => ({
        ...dt,
        eventCount: dt._count.events
      }))
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des DayTapes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/daytapes - Créer une nouvelle DayTape (rare, normalement auto)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { date } = await request.json() // Format "YYYY-MM-DD"

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Créer ou récupérer DayTape du jour
    const dayTape = await prisma.dayTape.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: date || new Date().toISOString().split('T')[0]
        }
      },
      update: {},
      create: {
        userId: user.id,
        date: date || new Date().toISOString().split('T')[0]
      }
    })

    return NextResponse.json({ dayTape })

  } catch (error) {
    console.error('Erreur lors de la création de la DayTape:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}