import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { postId } = req.query
    
    const comments = await prisma.comment.findMany({
      where: { postId: postId as string },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'asc' },
    })
    
    res.status(200).json(comments)
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { postId, content } = req.body
    
    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        postId,
        content,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    
    res.status(201).json(comment)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
