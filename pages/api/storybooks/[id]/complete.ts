import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUnlockAchievements } from '@/lib/achievements'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query
  const { attemptId } = req.body

  if (req.method === 'POST') {
    // 验证用户身份
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // 验证attempt属于当前用户，并获取绘本信息
    const attemptCheck = await prisma.storyAttempt.findUnique({
      where: { id: attemptId },
      include: {
        story: true,
        answers: true,
      },
    })

    if (!attemptCheck || attemptCheck.userId !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // 计算本次阅读的统计
    const correctCount = attemptCheck.answers.filter(a => a.isCorrect).length
    const totalCount = attemptCheck.answers.length
    const score = attemptCheck.score ?? Math.round((correctCount / totalCount) * 100)
    const isPerfect = score === 100

    // 标记为已完成
    const attempt = await prisma.storyAttempt.update({
      where: { id: attemptId },
      data: {
        completed: true,
        completedAt: new Date(),
        score,
      },
    })

    // 更新用户统计
    let languagesArray: string[] = []
    try {
      languagesArray = JSON.parse(user.storyLanguages || '[]')
    } catch {
      languagesArray = []
    }

    // 添加当前绘本的语言
    if (attemptCheck.story?.language && !languagesArray.includes(attemptCheck.story.language)) {
      languagesArray.push(attemptCheck.story.language)
    }

    const updateData: any = {
      storyBooksRead: { increment: 1 },
      storyBooksCompleted: { increment: 1 },
      storyLanguages: JSON.stringify(languagesArray),
    }

    if (isPerfect) {
      updateData.storyBooksPerfect = { increment: 1 }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    // 检查成就
    const newAchievements = await checkAndUnlockAchievements(user.id)

    res.status(200).json({
      attempt,
      correctCount,
      totalCount,
      score,
      newAchievements,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
