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
    const userId = session.user.id as string

    const [typeLevelRows, completedAttempts] = await Promise.all([
      prisma.specialTraining.findMany({
        select: { type: true, level: true },
      }),
      prisma.specialTrainingAttempt.findMany({
        where: {
          userId,
          completed: true,
          score: { gte: 60 },
        },
        select: {
          trainingId: true,
          training: { select: { type: true, level: true } },
        },
      }),
    ])

    // 统计每个type的总level数（去除重复的type+level组合）
    const typeLevelMap = new Map<string, Set<number>>()
    for (const training of typeLevelRows) {
      if (!typeLevelMap.has(training.type)) {
        typeLevelMap.set(training.type, new Set())
      }
      typeLevelMap.get(training.type)!.add(training.level)
    }

    // 统计每个type已完成的不同level数
    const completedTypeLevelMap = new Map<string, Set<number>>()
    for (const attempt of completedAttempts) {
      if (!completedTypeLevelMap.has(attempt.training.type)) {
        completedTypeLevelMap.set(attempt.training.type, new Set())
      }
      completedTypeLevelMap.get(attempt.training.type)!.add(attempt.training.level)
    }

    // 构建typeProgress
    const typeProgress: Record<string, { totalLevels: number; completedLevels: number }> = {}
    const allTypes = ['PINYIN_TO_WORDS', 'SYNONYMS', 'ANTONYMS', 'IDIOMS', 'WORD_COLLOCATION', 'FILL_IN_BLANK', 'QUANTIFIERS', 'PUNCTUATION']
    
    for (const type of allTypes) {
      const totalLevels = typeLevelMap.get(type)?.size || 0
      const completedLevels = completedTypeLevelMap.get(type)?.size || 0
      typeProgress[type] = { totalLevels, completedLevels }
    }
    
    res.status(200).json({
      completedTrainingIds: completedAttempts.map(attempt => attempt.trainingId),
      typeProgress
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
