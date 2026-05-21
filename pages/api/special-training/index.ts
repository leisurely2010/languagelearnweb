import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    const { type, language, level } = req.query
    
    let where: any = {}
    if (type) where.type = type
    if (language) where.language = language
    if (level) where.level = parseInt(level as string)

    const trainings = await prisma.specialTraining.findMany({
      where,
      select: {
        id: true,
        type: true,
        language: true,
        level: true,
        title: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { level: 'asc' },
    })
    
    res.status(200).json(trainings)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
