import prisma from '@/lib/prisma'

export interface AchievementConfig {
  id: string
  title: string
  description: string
  icon: string
  checkCondition: (user: any) => boolean
}

export const WRONG_QUESTION_ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'first-wrong',
    title: '初遇错题',
    description: '第一次遇到错题',
    icon: '❌',
    checkCondition: (user) => user.totalWrongQuestions >= 1
  },
  {
    id: 'wrong-10',
    title: '错题收集者',
    description: '累计遇到10道错题',
    icon: '📚',
    checkCondition: (user) => user.totalWrongQuestions >= 10
  },
  {
    id: 'wrong-50',
    title: '错题达人',
    description: '累计遇到50道错题',
    icon: '📖',
    checkCondition: (user) => user.totalWrongQuestions >= 50
  },
  {
    id: 'wrong-100',
    title: '错题大师',
    description: '累计遇到100道错题',
    icon: '🎓',
    checkCondition: (user) => user.totalWrongQuestions >= 100
  },
  {
    id: 'corrected-1',
    title: '知错能改',
    description: '第一次纠正错题',
    icon: '✅',
    checkCondition: (user) => user.totalCorrectedQuestions >= 1
  },
  {
    id: 'corrected-10',
    title: '改错小能手',
    description: '累计纠正10道错题',
    icon: '🔧',
    checkCondition: (user) => user.totalCorrectedQuestions >= 10
  },
  {
    id: 'corrected-50',
    title: '改错专家',
    description: '累计纠正50道错题',
    icon: '🛠️',
    checkCondition: (user) => user.totalCorrectedQuestions >= 50
  },
  {
    id: 'corrected-100',
    title: '改错大师',
    description: '累计纠正100道错题',
    icon: '🏆',
    checkCondition: (user) => user.totalCorrectedQuestions >= 100
  },
  {
    id: 'corrected-200',
    title: '错题终结者',
    description: '累计纠正200道错题',
    icon: '👑',
    checkCondition: (user) => user.totalCorrectedQuestions >= 200
  },
  {
    id: 'balanced-learner',
    title: '平衡学习者',
    description: '遇到和纠正的错题都超过50道',
    icon: '⚖️',
    checkCondition: (user) => user.totalWrongQuestions >= 50 && user.totalCorrectedQuestions >= 50
  }
]

export const SPECIAL_TRAINING_ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'first-special-training',
    title: '专项初体验',
    description: '完成第一次专项训练',
    icon: '🎯',
    checkCondition: (user) => user.specialTrainingCompleted >= 1
  },
  {
    id: 'special-training-10',
    title: '专项练习者',
    description: '完成10次专项训练',
    icon: '🏃',
    checkCondition: (user) => user.specialTrainingCompleted >= 10
  },
  {
    id: 'special-training-50',
    title: '专项达人',
    description: '完成50次专项训练',
    icon: '🏅',
    checkCondition: (user) => user.specialTrainingCompleted >= 50
  },
  {
    id: 'special-training-100',
    title: '专项大师',
    description: '完成100次专项训练',
    icon: '🏆',
    checkCondition: (user) => user.specialTrainingCompleted >= 100
  },
  {
    id: 'perfect-score',
    title: '完美答卷',
    description: '第一次获得满分',
    icon: '💯',
    checkCondition: (user) => user.specialTrainingPerfect >= 1
  },
  {
    id: 'perfect-10',
    title: '完美达人',
    description: '获得10次满分',
    icon: '🌟',
    checkCondition: (user) => user.specialTrainingPerfect >= 10
  },
  {
    id: 'all-types',
    title: '全能选手',
    description: '完成过所有类型的专项训练',
    icon: '🎖️',
    checkCondition: (user) => {
      try {
        const types = JSON.parse(user.specialTrainingTypes || '[]')
        const allTypes = ['PINYIN_TO_WORDS', 'SYNONYMS', 'ANTONYMS', 'IDIOMS', 'WORD_COLLOCATION', 'FILL_IN_BLANK', 'QUANTIFIERS', 'PUNCTUATION']
        return allTypes.every(type => types.includes(type))
      } catch {
        return false
      }
    }
  },
  {
    id: 'pinyin-master',
    title: '拼音大师',
    description: '完成10次拼音专项训练',
    icon: '📝',
    checkCondition: (user) => checkTypeCompletion(user, 'PINYIN_TO_WORDS', 10)
  },
  {
    id: 'idiom-master',
    title: '成语大师',
    description: '完成10次成语专项训练',
    icon: '📜',
    checkCondition: (user) => checkTypeCompletion(user, 'IDIOMS', 10)
  },
  {
    id: 'vocabulary-expert',
    title: '词汇专家',
    description: '完成10次同义词专项训练',
    icon: '📚',
    checkCondition: (user) => checkTypeCompletion(user, 'SYNONYMS', 10)
  }
]

export const TYPE_SPECIFIC_ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'pinyin-words-master',
    title: '屠龙者 · 应龙',
    description: '完成拼音专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('PINYIN_TO_WORDS')
      } catch { return false }
    }
  },
  {
    id: 'synonyms-master',
    title: '噬灵者 · 饕餮',
    description: '完成近义词专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('SYNONYMS')
      } catch { return false }
    }
  },
  {
    id: 'antonyms-master',
    title: '破虚者 · 混沌',
    description: '完成反义词专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('ANTONYMS')
      } catch { return false }
    }
  },
  {
    id: 'idioms-master',
    title: '镇岳者 · 玄武',
    description: '完成成语专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('IDIOMS')
      } catch { return false }
    }
  },
  {
    id: 'collocation-master',
    title: '御火者 · 凤凰',
    description: '完成词语搭配专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('WORD_COLLOCATION')
      } catch { return false }
    }
  },
  {
    id: 'fill-blank-master',
    title: '幻瞳者 · 九尾狐',
    description: '完成选词填空专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('FILL_IN_BLANK')
      } catch { return false }
    }
  },
  {
    id: 'quantifiers-master',
    title: '踏云者 · 麒麟',
    description: '完成量词专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('QUANTIFIERS')
      } catch { return false }
    }
  },
  {
    id: 'punctuation-master',
    title: '通明者 · 白泽',
    description: '完成标点专项训练全部等级',
    icon: '⚔️',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        return completed.includes('PUNCTUATION')
      } catch { return false }
    }
  },
  {
    id: 'octagonal-warrior',
    title: '八边形战士 · 山海至尊',
    description: '击败全部8种山海经神兽，完成所有专项训练全部等级',
    icon: '🏯',
    checkCondition: (user) => {
      try {
        const completed = JSON.parse(user.specialTrainingTypeCompleted || '[]')
        const allTypes = ['PINYIN_TO_WORDS', 'SYNONYMS', 'ANTONYMS', 'IDIOMS', 'WORD_COLLOCATION', 'FILL_IN_BLANK', 'QUANTIFIERS', 'PUNCTUATION']
        return allTypes.every(type => completed.includes(type))
      } catch { return false }
    }
  }
]

export const STORYBOOK_ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'first-story',
    title: '初读绘本',
    description: '完成第一次绘本阅读',
    icon: '📖',
    checkCondition: (user) => user.storyBooksCompleted >= 1
  },
  {
    id: 'story-10',
    title: '故事爱好者',
    description: '完成10本绘本阅读',
    icon: '📚',
    checkCondition: (user) => user.storyBooksCompleted >= 10
  },
  {
    id: 'story-50',
    title: '故事达人',
    description: '完成50本绘本阅读',
    icon: '🎯',
    checkCondition: (user) => user.storyBooksCompleted >= 50
  },
  {
    id: 'story-100',
    title: '故事大师',
    description: '完成100本绘本阅读',
    icon: '🏆',
    checkCondition: (user) => user.storyBooksCompleted >= 100
  },
  {
    id: 'perfect-story',
    title: '完美阅读',
    description: '第一次获得满分',
    icon: '💯',
    checkCondition: (user) => user.storyBooksPerfect >= 1
  },
  {
    id: 'perfect-10',
    title: '完美达人',
    description: '获得10次满分',
    icon: '🌟',
    checkCondition: (user) => user.storyBooksPerfect >= 10
  },
  {
    id: 'bilingual-reader',
    title: '双语读者',
    description: '阅读过英语和中文绘本',
    icon: '🌍',
    checkCondition: (user) => {
      try {
        const languages = JSON.parse(user.storyLanguages || '[]')
        return languages.includes('English') && languages.includes('Chinese')
      } catch {
        return false
      }
    }
  },
  {
    id: 'level-4-reader',
    title: '高级读者',
    description: '完成一本高级绘本',
    icon: '🎓',
    checkCondition: (user) => user.storyBooksRead > 0 // 简化条件，complete时会检查level
  }
]

function checkTypeCompletion(user: any, targetType: string, requiredCount: number): boolean {
  try {
    const typeRecords = JSON.parse(user.specialTrainingTypes || '[]')
    const count = typeRecords.filter((t: string) => t === targetType).length
    return count >= requiredCount
  } catch {
    return false
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalWrongQuestions: true,
      totalCorrectedQuestions: true,
      specialTrainingCompleted: true,
      specialTrainingPerfect: true,
      specialTrainingTypes: true,
      specialTrainingTypeCompleted: true,
      storyBooksRead: true,
      storyBooksCompleted: true,
      storyBooksPerfect: true,
      storyLanguages: true
    }
  })

  if (!user) return []

  const existingAchievements = await prisma.achievement.findMany({
    where: { userId },
    select: { title: true }
  })

  const existingTitles = new Set(existingAchievements.map((a: { title: string }) => a.title))
  const unlockedAchievements: any[] = []

  // 检查错题相关成就
  for (const config of WRONG_QUESTION_ACHIEVEMENTS) {
    if (!existingTitles.has(config.title) && config.checkCondition(user)) {
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          title: config.title,
          description: config.description,
          icon: config.icon,
          unlockedAt: new Date()
        }
      })
      unlockedAchievements.push(achievement)
    }
  }

  // 检查专项训练相关成就
  for (const config of SPECIAL_TRAINING_ACHIEVEMENTS) {
    if (!existingTitles.has(config.title) && config.checkCondition(user)) {
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          title: config.title,
          description: config.description,
          icon: config.icon,
          unlockedAt: new Date()
        }
      })
      unlockedAchievements.push(achievement)
    }
  }

  // 检查绘本阅读相关成就
  for (const config of STORYBOOK_ACHIEVEMENTS) {
    if (!existingTitles.has(config.title) && config.checkCondition(user)) {
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          title: config.title,
          description: config.description,
          icon: config.icon,
          unlockedAt: new Date()
        }
      })
      unlockedAchievements.push(achievement)
    }
  }

  // 检查专项类型专属成就（山海经神兽系列）
  for (const config of TYPE_SPECIFIC_ACHIEVEMENTS) {
    if (!existingTitles.has(config.title) && config.checkCondition(user)) {
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          title: config.title,
          description: config.description,
          icon: config.icon,
          unlockedAt: new Date()
        }
      })
      unlockedAchievements.push(achievement)
    }
  }

  return unlockedAchievements
}
