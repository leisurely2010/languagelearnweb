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

  const { attemptId, questionId, userAnswer } = req.body

  if (req.method === 'POST') {
    const question = await prisma.specialTrainingQuestion.findUnique({
      where: { id: questionId },
    })
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // 验证attempt属于当前用户
    const attempt = await prisma.specialTrainingAttempt.findUnique({
      where: { id: attemptId },
    })

    if (!attempt || attempt.userId !== session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    
    const isCorrect = userAnswer === question.answer
    
    const existingAnswer = await prisma.specialTrainingAnswer.findFirst({
      where: {
        attemptId,
        questionId,
      },
      select: { id: true },
    })

    if (existingAnswer) {
      await prisma.specialTrainingAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          userAnswer,
          isCorrect,
        },
      })
    } else {
      await prisma.specialTrainingAnswer.create({
        data: {
          attemptId,
          questionId,
          userAnswer,
          isCorrect,
        },
      })
    }

    res.status(201).json({ isCorrect })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
