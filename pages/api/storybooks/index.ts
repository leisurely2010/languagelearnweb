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
    const { language, level, page: pageStr, limit: limitStr } = req.query
    
    const page = Math.max(1, parseInt(pageStr as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(limitStr as string) || 20))
    const skip = (page - 1) * limit
    
    let where: any = {}
    if (language) where.language = language
    if (level) where.level = parseInt(level as string)

    const [storybooks, total] = await Promise.all([
      prisma.storyBook.findMany({
        where,
        include: {
          _count: {
            select: { questions: true },
          },
        },
        orderBy: [
          { language: 'asc' },
          { level: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.storyBook.count({ where }),
    ])
    
    res.status(200).json({
      data: storybooks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
