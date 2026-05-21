import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const examId = req.query.id as string
  const { attemptId, answers } = req.body
  
  console.log('Received submission:', { examId, attemptId, answers })

  if (req.method === 'POST') {
    try {
      // 获取考试信息和题目
      const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { questions: true },
      })
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' })
      }

      console.log('Exam found:', exam.id, 'with', exam.questions.length, 'questions')

      let correctCount = 0
      const examAnswers: { examAttemptId: string; examQuestionId: string; userAnswer: string; isCorrect: boolean }[] = []

      // 计算每个题目的正确性
      for (const question of exam.questions) {
        const userAnswer = answers[question.id]
        const isCorrect = userAnswer === question.answer
        
        console.log(`Question ${question.id}: userAnswer=${userAnswer}, correctAnswer=${question.answer}, isCorrect=${isCorrect}`)
        
        if (isCorrect) correctCount++

        examAnswers.push({
          examAttemptId: attemptId,
          examQuestionId: question.id,
          userAnswer: userAnswer || '',
          isCorrect,
        })
      }

      // 计算总分
      const totalQuestions = exam.questions.length
      const score = Math.round((correctCount / totalQuestions) * 100)
      const passed = score >= exam.passingScore
      
      console.log('Calculated results:', { correctCount, totalQuestions, score, passed, passingScore: exam.passingScore })

      // 更新考试尝试
      const updatedAttempt = await prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          score,
          passed,
          completedAt: new Date(),
        },
      })

      // 批量创建答题记录
      await prisma.examAnswer.createMany({
        data: examAnswers,
      })

      // 如果考试通过，解锁下一级课程
      if (passed) {
        const nextLevel = exam.level + 1
        
        // 检查下一级别是否已解锁
        const existingUnlock = await prisma.unlockedLevel.findFirst({
          where: {
            userId: session.user.id,
            language: exam.language,
            level: nextLevel,
          },
        })

        if (!existingUnlock) {
          await prisma.unlockedLevel.create({
            data: {
              userId: session.user.id,
              language: exam.language,
              level: nextLevel,
            },
          })
          console.log('Unlocked next level:', nextLevel)
        }
      }

      const response = {
        attempt: updatedAttempt,
        score,
        passed,
        correctCount,
        totalQuestions,
      }
      
      console.log('Sending response:', response)
      res.status(200).json(response)
    } catch (error) {
      console.error('Error submitting exam:', error)
      res.status(500).json({ 
        message: 'Failed to submit exam',
        error: (error as Error).message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
