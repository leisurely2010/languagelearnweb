import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (req.method === 'POST') {
    const training = await prisma.specialTraining.findUnique({
      where: { id: id as string },
    })
    
    if (!training) {
      return res.status(404).json({ message: 'Training not found' })
    }

    // 通过 email 查找用户，确保用户存在
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    const attempt = await prisma.specialTrainingAttempt.create({
      data: {
        userId: user.id,
        trainingId: id as string,
        completed: false,
      },
    })
    
    res.status(201).json(attempt)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
