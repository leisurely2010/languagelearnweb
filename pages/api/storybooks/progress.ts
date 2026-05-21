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

  if (req.method === 'GET') {
    // 通过 email 查找用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // 获取用户的所有绘本阅读尝试
    const attempts = await prisma.storyAttempt.findMany({
      where: { userId: user.id },
      include: {
        story: {
          select: { language: true },
        },
      },
    })

    const readCount = attempts.length
    const completedCount = attempts.filter(a => a.completed).length
    const perfectCount = attempts.filter(a => a.completed && a.score === 100).length

    // 获取阅读过的语言列表
    const languagesSet = new Set<string>()
    for (const attempt of attempts) {
      if (attempt.story?.language) {
        languagesSet.add(attempt.story.language)
      }
    }
    const languages = Array.from(languagesSet)

    res.status(200).json({
      readCount,
      completedCount,
      perfectCount,
      languages,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
