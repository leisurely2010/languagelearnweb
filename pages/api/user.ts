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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learningPaths: true,
        achievements: true,
      },
    })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.status(200).json(user)
  } else if (req.method === 'PUT') {
    const { name, image } = req.body
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, image },
    })
    
    res.status(200).json(user)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
