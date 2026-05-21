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
    try {
      const unlockedLevels = await prisma.unlockedLevel.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          level: true,
          language: true,
        },
      })
      
      res.status(200).json(unlockedLevels)
    } catch (error) {
      console.error('Error fetching unlocked levels:', error)
      res.status(500).json({ message: 'Failed to fetch unlocked levels' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
