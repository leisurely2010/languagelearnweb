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
      const attempts = await prisma.examAttempt.findMany({
        where: { userId: session.user.id },
        select: { examId: true, passed: true, score: true, completedAt: true },
      })
      res.status(200).json(attempts)
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch exam attempts' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
