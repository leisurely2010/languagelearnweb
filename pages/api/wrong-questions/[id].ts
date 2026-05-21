import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkAndUnlockAchievements } from '@/lib/achievements'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id as string
  const { id } = req.query

  if (req.method === 'PUT') {
    // 更新错题
    try {
      const { correct } = req.body

      const wrongQuestion = await prisma.wrongQuestion.findUnique({
        where: { id: id as string }
      })

      if (!wrongQuestion || wrongQuestion.userId !== userId) {
        return res.status(404).json({ message: 'Wrong question not found' })
      }

      const updated = await prisma.wrongQuestion.update({
        where: { id: id as string },
        data: {
          consecutiveCorrect: correct 
            ? wrongQuestion.consecutiveCorrect + 1 
            : 0,
          lastAttemptedAt: new Date()
        }
      })

      return res.json(updated)
    } catch (error) {
      console.error('Error updating wrong question:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    // 删除错题（移出错题本）
    try {
      const wrongQuestion = await prisma.wrongQuestion.findUnique({
        where: { id: id as string }
      })

      if (!wrongQuestion || wrongQuestion.userId !== userId) {
        return res.status(404).json({ message: 'Wrong question not found' })
      }

      await prisma.wrongQuestion.delete({
        where: { id: id as string }
      })

      // 更新纠正统计并检查成就
      await prisma.user.update({
        where: { id: userId },
        data: { totalCorrectedQuestions: { increment: 1 } }
      })
      const newAchievements = await checkAndUnlockAchievements(userId)

      return res.json({ success: true, newAchievements })
    } catch (error) {
      console.error('Error deleting wrong question:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
