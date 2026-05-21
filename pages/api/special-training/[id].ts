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

  const { id } = req.query

  if (req.method === 'GET') {
    const training = await prisma.specialTraining.findUnique({
      where: { id: id as string },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })
    
    if (!training) {
      return res.status(404).json({ message: 'Training not found' })
    }
    
    res.status(200).json(training)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
