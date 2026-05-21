import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        comments: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.status(200).json(posts)
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { title, content } = req.body
    
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        title,
        content,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    
    res.status(201).json(post)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
