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
    const { language, level } = req.query
    
    let where: any = {}
    if (language) where.language = language
    if (level) where.level = parseInt(level as string)

    const exams = await prisma.exam.findMany({
      where,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })
    
    res.status(200).json(exams)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
