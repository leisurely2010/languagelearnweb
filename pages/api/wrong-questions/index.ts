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
  const { groupBy, courseId, source } = req.query

  if (req.method === 'GET') {
    try {
      if (groupBy === 'course') {
        // 获取所有有错题的课程（仅普通课程）
        const wrongQuestions = await prisma.wrongQuestion.findMany({
          where: { userId, source: 'COURSE' },
          include: {
            user: false
          }
        })

        // 获取所有相关课程
        const courseIds = [...new Set(wrongQuestions.filter(q => q.courseId).map(q => q.courseId as string))]
        const courses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          include: {
            lessons: false
          }
        })

        // 统计每门课程的错题数
        const result = courses.map(course => ({
          course,
          count: wrongQuestions.filter(q => q.courseId === course.id).length
        }))

        return res.json(result)
      } else if (courseId) {
        // 获取特定课程的错题
        const wrongQuestions = await prisma.wrongQuestion.findMany({
          where: {
            userId,
            courseId: courseId as string
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        return res.json(wrongQuestions)
      } else if (source === 'special') {
        // 获取专项训练的错题
        const wrongQuestions = await prisma.wrongQuestion.findMany({
          where: {
            userId,
            source: 'SPECIAL_TRAINING'
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        return res.json(wrongQuestions)
      } else {
        // 获取所有错题
        const wrongQuestions = await prisma.wrongQuestion.findMany({
          where: { userId },
          orderBy: {
            createdAt: 'desc'
          }
        })

        return res.json(wrongQuestions)
      }
    } catch (error) {
      console.error('Error fetching wrong questions:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // 添加错题
    try {
      const { 
        exerciseId, 
        question, 
        options, 
        answer, 
        type, 
        courseId, 
        lessonId,
        specialTrainingQuestionId,
        specialTrainingId,
        source = 'COURSE'
      } = req.body

      // 根据来源决定唯一约束
      let existing = null
      if (source === 'SPECIAL_TRAINING' && specialTrainingQuestionId) {
        existing = await prisma.wrongQuestion.findUnique({
          where: {
            userId_specialTrainingQuestionId: {
              userId,
              specialTrainingQuestionId,
            },
          },
        })
      } else if (exerciseId) {
        existing = await prisma.wrongQuestion.findUnique({
          where: {
            userId_exerciseId: {
              userId,
              exerciseId
            },
          },
        })
      }

      if (existing) {
        // 更新错题次数
        const updated = await prisma.wrongQuestion.update({
          where: { id: existing.id },
          data: {
            wrongCount: { increment: 1 },
            consecutiveCorrect: 0,
            lastAttemptedAt: new Date()
          },
        })
        // 更新错题统计并检查成就
        await prisma.user.update({
          where: { id: userId },
          data: { totalWrongQuestions: { increment: 1 } }
        })
        const newAchievements = await checkAndUnlockAchievements(userId)
        return res.json({ updated, newAchievements })
      } else {
        // 创建新错题
        const data: any = {
          userId,
          question,
          options,
          answer,
          type,
          source,
        }
        
        if (source === 'SPECIAL_TRAINING') {
          data.specialTrainingQuestionId = specialTrainingQuestionId
          data.specialTrainingId = specialTrainingId
        } else {
          data.exerciseId = exerciseId
          data.courseId = courseId
          data.lessonId = lessonId
        }
        
        const newWrongQuestion = await prisma.wrongQuestion.create({ data })
        // 更新错题统计并检查成就
        await prisma.user.update({
          where: { id: userId },
          data: { totalWrongQuestions: { increment: 1 } }
        })
        const newAchievements = await checkAndUnlockAchievements(userId)
        return res.json({ newWrongQuestion, newAchievements })
      }
    } catch (error) {
      console.error('Error creating wrong question:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
