import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type AchievementDef = {
  title: string
  description: string
  condition: string
  icon: string
  rarity: string
}

const allAchievements: AchievementDef[] = [
  { title: '初学者', description: '完成第一次学习', condition: '完成任意一门课程的第一节课', icon: '🌱', rarity: 'common' },
  { title: '坚持就是胜利', description: '连续学习3天', condition: '连续3天每天至少完成一节课', icon: '⭐', rarity: 'common' },
  { title: '连续学习者', description: '连续学习7天', condition: '连续7天每天至少完成一节课', icon: '🔥', rarity: 'rare' },
  { title: '词汇达人', description: '学习100个单词', condition: '完成所有词汇类课程，累计学习100个单词', icon: '📚', rarity: 'rare' },
  { title: '语法高手', description: '完成所有语法课程', condition: '完成所有语言的语法类课程', icon: '✅', rarity: 'epic' },
  { title: '口语新星', description: '完成口语练习', condition: '完成任意一门口语类课程', icon: '🎤', rarity: 'common' },
  { title: '听力专家', description: '完成听力训练', condition: '完成任意一门听力类课程', icon: '🎧', rarity: 'common' },
  { title: '双语达人', description: '同时学习英语和中文', condition: '完成至少一门英语课程和一门中文课程', icon: '🌍', rarity: 'epic' },
  { title: '全能学霸', description: '完成所有课程', condition: '完成平台上所有课程的所有课时', icon: '🏆', rarity: 'legendary' },
  { title: '社区新人', description: '发布第一篇帖子', condition: '在社区发布你的第一篇帖子', icon: '💬', rarity: 'common' },
  { title: '社区活跃', description: '发布10篇帖子', condition: '在社区累计发布10篇帖子', icon: '🌟', rarity: 'rare' },
  { title: '经验大师', description: '获得10000 XP', condition: '累计获得10000点经验值', icon: '💎', rarity: 'legendary' },
]

// 计算连续学习天数
const calculateStreak = (progressRecords: any[], todayStr: string) => {
  // 收集所有有学习记录的日期
  const studyDates = new Set<string>()
  
  progressRecords.forEach(p => {
    if (p.completedAt) {
      const date = new Date(p.completedAt)
      date.setHours(0, 0, 0, 0)
      studyDates.add(date.toISOString().split('T')[0])
    }
  })

  if (studyDates.size === 0) return 0

  let streak = 0
  let checkDate = new Date()
  checkDate.setHours(0, 0, 0, 0)

  // 从今天开始往前数
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0]
    
    if (studyDates.has(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// 检查和解锁成就
const checkAndUnlockAchievements = async (userId: string) => {
  try {
    const unlockedAchievements = await prisma.achievement.findMany({ where: { userId } })
    const unlockedTitles = new Set(unlockedAchievements.map(a => a.title))

    const allProgress = await prisma.progress.findMany({ where: { userId, completed: true } })
    const allCourses = await prisma.course.findMany({ include: { lessons: true } })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const userPosts = await prisma.post.findMany({ where: { userId } })

    const newAchievements: AchievementDef[] = []

    allAchievements.forEach(achievement => {
      if (unlockedTitles.has(achievement.title)) return

      let shouldUnlock = false

      switch (achievement.title) {
        case '初学者':
          shouldUnlock = allProgress.length >= 1
          break
        case '坚持就是胜利':
          shouldUnlock = calculateStreak(allProgress, new Date().toISOString()) >= 3
          break
        case '连续学习者':
          shouldUnlock = calculateStreak(allProgress, new Date().toISOString()) >= 7
          break
        case '经验大师':
          shouldUnlock = user?.totalXP ? user.totalXP >= 10000 : false
          break
        case '社区新人':
          shouldUnlock = userPosts.length >= 1
          break
        case '社区活跃':
          shouldUnlock = userPosts.length >= 10
          break
        case '全能学霸':
          const allLessonIds = allCourses.flatMap(c => c.lessons.map(l => l.id))
          const completedLessonIds = allProgress.map(p => p.lessonId).filter(Boolean)
          shouldUnlock = allLessonIds.length > 0 && allLessonIds.every(id => completedLessonIds.includes(id))
          break
      }

      if (shouldUnlock) {
        newAchievements.push(achievement)
      }
    })

    if (newAchievements.length > 0) {
      await Promise.all(
        newAchievements.map(ach => 
          prisma.achievement.create({
            data: {
              userId,
              title: ach.title,
              description: ach.description,
              icon: ach.icon,
              unlockedAt: new Date()
            }
          })
        )
      )
    }

    return newAchievements
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  if (req.method === 'GET') {
    const { courseId, lessonId } = req.query
    
    let where: any = { userId }
    
    if (courseId) where.courseId = courseId
    if (lessonId) where.lessonId = lessonId

    const progress = await prisma.progress.findMany({ where })
    
    res.status(200).json(progress)
  } else if (req.method === 'POST') {
    const { courseId, lessonId, completed, score } = req.body
    
    const existingProgress = await prisma.progress.findFirst({
      where: { userId, courseId, lessonId }
    })

    let progressResult
    if (existingProgress) {
      progressResult = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: { completed, score, completedAt: completed ? new Date() : null }
      })
    } else {
      progressResult = await prisma.progress.create({
        data: { userId, courseId, lessonId, completed, score, completedAt: completed ? new Date() : null }
      })
    }

    let updatedUser = null
    if (completed && score) {
      // 更新经验值
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { totalXP: { increment: score * 10 } }
      })

      // 计算和更新连续学习天数
      const allProgress = await prisma.progress.findMany({ 
        where: { userId, completed: true } 
      })
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const newStreak = calculateStreak(allProgress, today.toISOString())
      
      // 更新用户连续学习天数
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { currentStreak: newStreak }
      })

      // 检查和解锁成就
      await checkAndUnlockAchievements(userId)
    }

    res.status(200).json(progressResult)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
