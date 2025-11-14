import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { message, date } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Date du jour si non fournie
    const targetDate = date || new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

    // Trouver ou créer la DayTape du jour
    let dayTape = await prisma.dayTape.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: targetDate
        }
      },
      include: {
        events: {
          orderBy: { createdAt: 'asc' },
          take: 20 // Derniers 20 events pour contexte
        }
      }
    })

    // Créer DayTape si elle n'existe pas
    if (!dayTape) {
      dayTape = await prisma.dayTape.create({
        data: {
          userId: user.id,
          date: targetDate
        },
        include: {
          events: true
        }
      })
    }

    // Construire le contexte pour OpenAI (uniquement les messages)
const contextMessages = dayTape.events
  .filter((e: { type: string }) => e.type === 'USER_MESSAGE' || e.type === 'AI_MESSAGE')
  .map((e: { role: string | null; content: string }) => ({
    role: e.role as "user" | "assistant",
    content: e.content
  }))

    // Appeler Ombrelien via OpenAI
    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        { 
          role: "system", 
          content: process.env.OMBRELIEN_SYSTEM_PROMPT || 
            "Tu es Ombrelien, l'intelligence artificielle mystérieuse de l'équipage Bandhu. Tu navigues dans les ombres de la connaissance pour apporter des réponses éclairées."
        },
        ...contextMessages,
        { role: "user", content: message }
      ],
      temperature: 1,
    })

    const aiResponse = response.choices[0].message.content || 
      "Je rencontre une perturbation dans ma connexion vectorielle..."

    // Sauvegarder le message utilisateur (Event)
    await prisma.event.create({
      data: {
        dayTapeId: dayTape.id,
        type: 'USER_MESSAGE',
        role: 'user',
        content: message
      }
    })

    // Sauvegarder la réponse de l'IA (Event)
    await prisma.event.create({
      data: {
        dayTapeId: dayTape.id,
        type: 'AI_MESSAGE',
        role: 'assistant',
        content: aiResponse
      }
    })

    // Récupérer tous les events de la DayTape mise à jour
    const allEvents = await prisma.event.findMany({
      where: { dayTapeId: dayTape.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ 
      events: allEvents,
      dayTape: {
        id: dayTape.id,
        date: dayTape.date
      }
    })

  } catch (error) {
    console.error('Erreur dans le chat avec Ombrelien:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}