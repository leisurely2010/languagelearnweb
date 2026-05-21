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
  const { attemptId, answers } = req.body

  if (req.method === 'POST') {
    try {
      // 获取绘本及其题目
      const storybook = await prisma.storyBook.findUnique({
        where: { id: id as string },
        include: { questions: true },
      })
      
      if (!storybook) {
        return res.status(404).json({ message: 'Storybook not found' })
      }

      // 验证用户身份
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // 验证attempt属于当前用户
      const attemptCheck = await prisma.storyAttempt.findUnique({
        where: { id: attemptId },
      })

      if (!attemptCheck || attemptCheck.userId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized' })
      }

      // 构建答案查找映射
      const answersMap = new Map<string, string>()
      for (const answer of answers) {
        answersMap.set(answer.questionId, answer.userAnswer)
      }

      let correctCount = 0
      const storyAnswers: {
        attemptId: string
        questionId: string
        userAnswer: string
        isCorrect: boolean
      }[] = []

      // 计算每个题目的正确性
      for (const question of storybook.questions) {
        const userAnswer = answersMap.get(question.id) || ''
        const isCorrect = userAnswer === question.answer
        
        if (isCorrect) correctCount++

        storyAnswers.push({
          attemptId: attemptId,
          questionId: question.id,
          userAnswer,
          isCorrect,
        })
      }

      // 计算得分
      const totalQuestions = storybook.questions.length
      const score = Math.round((correctCount / totalQuestions) * 100)

      // 更新尝试记录（暂不标记为 completed）
      const updatedAttempt = await prisma.storyAttempt.update({
        where: { id: attemptId },
        data: {
          score,
        },
      })

      // 批量创建答题记录
      await prisma.storyAnswer.createMany({
        data: storyAnswers,
      })

      res.status(200).json({
        attempt: updatedAttempt,
        score,
        correctCount,
        totalQuestions,
      })
    } catch (error) {
      console.error('Error submitting story answers:', error)
      res.status(500).json({ 
        message: 'Failed to submit answers',
        error: (error as Error).message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
