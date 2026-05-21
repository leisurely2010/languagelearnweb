import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  if (req.method === 'GET') {
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    })
    res.status(200).json(achievements)
  } else if (req.method === 'POST') {
    const { title, description, icon } = req.body
    
    const achievement = await prisma.achievement.create({
      data: { userId, title, description, icon, unlockedAt: new Date() },
    })
    
    res.status(201).json(achievement)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
