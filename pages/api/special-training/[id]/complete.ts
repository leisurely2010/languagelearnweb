import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { checkAndUnlockAchievements } from '@/lib/achievements'

function parseQuestionOptions(questionJson: string): string[] {
  try {
    const parsed = JSON.parse(questionJson)
    return parsed.options || []
  } catch {
    return []
  }
}

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

    // 验证attempt属于当前用户
    const attemptCheck = await prisma.specialTrainingAttempt.findUnique({
      where: { id: attemptId },
      include: { training: true }
    })

    if (!attemptCheck || attemptCheck.userId !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const answers = await prisma.specialTrainingAnswer.findMany({
      where: { attemptId },
      include: {
        question: true,
      },
    })
    
    const correctCount = answers.filter((a: { isCorrect: boolean }) => a.isCorrect).length
    const totalCount = answers.length
    const score = Math.round((correctCount / totalCount) * 100)
    const passed = score >= 60
    const isPerfect = score === 100
    
    const attempt = await prisma.specialTrainingAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        completed: passed,
        completedAt: new Date(),
      },
    })

    const wrongAnswers = answers.filter((answer: any) => !answer.isCorrect)

    if (wrongAnswers.length > 0) {
      for (const wrongAnswer of wrongAnswers) {
        const existingWrongQuestion = await prisma.wrongQuestion.findUnique({
          where: {
            userId_specialTrainingQuestionId: {
              userId: user.id,
              specialTrainingQuestionId: wrongAnswer.questionId,
            },
          },
        })

        if (existingWrongQuestion) {
          await prisma.wrongQuestion.update({
            where: { id: existingWrongQuestion.id },
            data: {
              wrongCount: { increment: 1 },
              consecutiveCorrect: 0,
              lastAttemptedAt: new Date(),
            },
          })
        } else {
          await prisma.wrongQuestion.create({
            data: {
              userId: user.id,
              specialTrainingQuestionId: wrongAnswer.questionId,
              specialTrainingId: wrongAnswer.question.trainingId,
              question: wrongAnswer.question.question,
              options: JSON.stringify(parseQuestionOptions(wrongAnswer.question.question)),
              answer: wrongAnswer.question.answer,
              type: wrongAnswer.question.type,
              source: 'SPECIAL_TRAINING',
            },
          })
        }
      }
    }
    
    // 更新用户统计
    let typesArray: string[] = []
    try {
      typesArray = JSON.parse(user.specialTrainingTypes || '[]')
    } catch {
      typesArray = []
    }
    
    // 通过后才记录当前训练类型完成次数
    if (passed && attemptCheck.training?.type) {
      typesArray.push(attemptCheck.training.type)
    }
    
    const updateData: any = {
      specialTrainingTypes: JSON.stringify(typesArray),
      totalWrongQuestions: { increment: wrongAnswers.length },
    }

    if (passed) {
      updateData.specialTrainingCompleted = { increment: 1 }
    }
    
    if (isPerfect) {
      updateData.specialTrainingPerfect = { increment: 1 }
    }
    
    // 检查当前类型的所有等级是否已完成
    if (attemptCheck.training?.type && attemptCheck.training?.language && score >= 60) {
      const currentType = attemptCheck.training.type
      const currentLang = attemptCheck.training.language
      
      // 查询该类型+语言下所有等级的训练
      const allTrainingsForType = await prisma.specialTraining.findMany({
        where: { type: currentType, language: currentLang },
        select: { id: true, level: true }
      })
      
      // 查询用户在该类型下所有已完成的attempt
      const completedAttempts = await prisma.specialTrainingAttempt.findMany({
        where: {
          userId: user.id,
          completed: true,
          score: { gte: 60 },
          training: { type: currentType, language: currentLang }
        },
        select: { trainingId: true }
      })
      
      const completedTrainingIds = new Set(completedAttempts.map((a: { trainingId: string }) => a.trainingId))
      const allTypeLevelsCompleted = allTrainingsForType.every((t: { id: string }) => completedTrainingIds.has(t.id))
      
      if (allTypeLevelsCompleted) {
        let typeCompletedArray: string[] = []
        try {
          typeCompletedArray = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        } catch {
          typeCompletedArray = []
        }
        
        if (!typeCompletedArray.includes(currentType)) {
          typeCompletedArray.push(currentType)
          updateData.specialTrainingTypeCompleted = JSON.stringify(typeCompletedArray)
        }
      }
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })
    
    // 检查成就
    const newAchievements = await checkAndUnlockAchievements(user.id)
    
    let nextTrainingId: string | null = null
    if (passed && attemptCheck.training) {
      const nextTraining = await prisma.specialTraining.findFirst({
        where: {
          type: attemptCheck.training.type,
          language: attemptCheck.training.language,
          level: attemptCheck.training.level + 1,
        },
        select: { id: true },
      })
      nextTrainingId = nextTraining?.id || null
    }

    res.status(200).json({ 
      attempt, 
      correctCount, 
      totalCount, 
      score,
      passed,
      nextTrainingId,
      newAchievements
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
