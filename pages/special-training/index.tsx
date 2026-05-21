import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Check, ChevronRight, Trophy, AlertCircle, Loader2 } from 'lucide-react'
import MonsterEmblem from '@/components/monsters'
import type { SpecialTrainingType, Achievement } from '@/types'

const trainingTypes = [
  {
    type: 'PINYIN_TO_WORDS' as SpecialTrainingType,
    title: { Chinese: '看拼音写词语', English: 'Spelling Practice' },
    description: { Chinese: '根据拼音写出对应的词语', English: 'Practice English spelling' },
    bg: 'from-violet-100 to-purple-100',
    color: 'text-violet-600',
    borderColor: 'border-violet-200 hover:border-violet-400',
    glowColor: 'shadow-violet-200/50',
  },
  {
    type: 'SYNONYMS' as SpecialTrainingType,
    title: { Chinese: '近义词', English: 'Synonyms' },
    description: { Chinese: '找出与词语意思相近的词', English: 'Find words with similar meanings' },
    bg: 'from-blue-100 to-cyan-100',
    color: 'text-blue-600',
    borderColor: 'border-blue-200 hover:border-blue-400',
    glowColor: 'shadow-blue-200/50',
  },
  {
    type: 'ANTONYMS' as SpecialTrainingType,
    title: { Chinese: '反义词', English: 'Antonyms' },
    description: { Chinese: '找出与词语意思相反的词', English: 'Find words with opposite meanings' },
    bg: 'from-rose-100 to-pink-100',
    color: 'text-rose-600',
    borderColor: 'border-rose-200 hover:border-rose-400',
    glowColor: 'shadow-rose-200/50',
  },
  {
    type: 'IDIOMS' as SpecialTrainingType,
    title: { Chinese: '成语积累', English: 'Idioms' },
    description: { Chinese: '学习和巩固成语知识', English: 'Learn common English idioms' },
    bg: 'from-amber-100 to-yellow-100',
    color: 'text-amber-600',
    borderColor: 'border-amber-200 hover:border-amber-400',
    glowColor: 'shadow-amber-200/50',
  },
  {
    type: 'WORD_COLLOCATION' as SpecialTrainingType,
    title: { Chinese: '词语搭配', English: 'Word Collocation' },
    description: { Chinese: '掌握正确的词语组合方式', English: 'Master correct word combinations' },
    bg: 'from-teal-100 to-emerald-100',
    color: 'text-teal-600',
    borderColor: 'border-teal-200 hover:border-teal-400',
    glowColor: 'shadow-teal-200/50',
  },
  {
    type: 'FILL_IN_BLANK' as SpecialTrainingType,
    title: { Chinese: '选词填空', English: 'Fill in the Blank' },
    description: { Chinese: '选择合适的词语填入句子', English: 'Choose the correct word for the blank' },
    bg: 'from-sky-100 to-indigo-100',
    color: 'text-sky-600',
    borderColor: 'border-sky-200 hover:border-sky-400',
    glowColor: 'shadow-sky-200/50',
  },
  {
    type: 'QUANTIFIERS' as SpecialTrainingType,
    title: { Chinese: '量词使用', English: 'Determiners' },
    description: { Chinese: '学习和练习量词的正确使用', English: 'Practice correct determiner usage' },
    bg: 'from-orange-100 to-amber-100',
    color: 'text-orange-600',
    borderColor: 'border-orange-200 hover:border-orange-400',
    glowColor: 'shadow-orange-200/50',
  },
  {
    type: 'PUNCTUATION' as SpecialTrainingType,
    title: { Chinese: '标点用法', English: 'Punctuation' },
    description: { Chinese: '掌握标点符号的正确使用', English: 'Master correct punctuation usage' },
    bg: 'from-fuchsia-100 to-pink-100',
    color: 'text-fuchsia-600',
    borderColor: 'border-fuchsia-200 hover:border-fuchsia-400',
    glowColor: 'shadow-fuchsia-200/50',
  },
]

interface TypeProgressData {
  totalLevels: number
  completedLevels: number
  allCompleted?: boolean
}

export default function SpecialTrainingIndex() {
  const { data: session } = useSession()
  const router = useRouter()
  const [language, setLanguage] = useState<'Chinese' | 'English'>('Chinese')
  const [typeProgress, setTypeProgress] = useState<Record<string, TypeProgressData>>({})
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [progressRes, achievementsRes] = await Promise.all([
          fetch('/api/special-training/progress'),
          fetch('/api/achievements'),
        ])

        if (!progressRes.ok) throw new Error('获取进度失败')
        if (!achievementsRes.ok) throw new Error('获取成就失败')

        const progressData = await progressRes.json()
        const achievementsData = await achievementsRes.json()

        setTypeProgress(progressData.typeProgress || {})
        setAchievements(achievementsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  // 文字国际化
  const t = (key: 'title' | 'description') => {
    if (key === 'title') {
      return language === 'Chinese' ? '讨伐悬赏令' : 'Bounty Hunt'
    }
    return language === 'Chinese'
      ? '选择要讨伐的神兽，完成试炼获取丰厚奖励'
      : 'Choose a mythical beast to hunt, complete trials and earn rewards'
  }

  const getStarCount = (totalLevels: number) => {
    return Math.min(totalLevels, 5)
  }

  const getDifficultyLabel = (totalLevels: number) => {
    if (totalLevels <= 1) return language === 'Chinese' ? '简单' : 'Easy'
    if (totalLevels <= 2) return language === 'Chinese' ? '普通' : 'Normal'
    if (totalLevels <= 3) return language === 'Chinese' ? '困难' : 'Hard'
    return language === 'Chinese' ? '地狱' : 'Hell'
  }

  // 检查该类型是否有已解锁的成就
  const isAchievementUnlocked = (type: string) => {
    return achievements.some((a) => a.title?.includes(type) || a.description?.includes(type))
  }

  const getStatusText = (progress: TypeProgressData | undefined) => {
    if (!progress || progress.totalLevels === 0) {
      return language === 'Chinese' ? '前往讨伐' : 'Start Hunt'
    }
    if (progress.completedLevels === 0) {
      return language === 'Chinese' ? '前往讨伐' : 'Start Hunt'
    }
    if (progress.allCompleted || progress.completedLevels >= progress.totalLevels) {
      return language === 'Chinese' ? '已讨伐 ✓' : 'Defeated ✓'
    }
    return language === 'Chinese' ? '继续讨伐' : 'Continue'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-24">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">
            {language === 'Chinese' ? '加载讨伐令中...' : 'Loading bounty list...'}
          </p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-24">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <p className="text-red-600 font-medium mb-2">
            {language === 'Chinese' ? '加载失败' : 'Failed to load'}
          </p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {language === 'Chinese' ? '重新加载' : 'Reload'}
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('description')}
          </p>
        </div>

        {/* 语言切换 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {language === 'Chinese' ? '语言：' : 'Language:'}
            </label>
            <div className="flex gap-1.5">
              {(['Chinese', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                    language === lang
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {lang === 'Chinese' ? '中文' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 悬赏令卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainingTypes.map((trainingType) => {
            const progress = typeProgress[trainingType.type]
            const totalLevels = progress?.totalLevels || 0
            const completedLevels = progress?.completedLevels || 0
            const allCompleted = progress?.allCompleted || (totalLevels > 0 && completedLevels >= totalLevels)
            const hasAchievement = isAchievementUnlocked(trainingType.type) || allCompleted
            const stars = getStarCount(totalLevels)

            return (
              <div
                key={trainingType.type}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${
                  allCompleted
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : `${trainingType.borderColor} dark:border-gray-600`
                } p-6 transition-all duration-300 cursor-pointer ${
                  allCompleted
                    ? 'shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/20'
                    : `shadow-md ${trainingType.glowColor} hover:shadow-xl`
                } hover:-translate-y-1`}
                onClick={() =>
                  router.push(`/special-training/${trainingType.type}?language=${language}`)
                }
              >
                {/* 已讨伐角标 */}
                {allCompleted && (
                  <div className="absolute -top-3 -right-3 z-20 flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg">
                    <Check className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold tracking-wide">
                      {language === 'Chinese' ? '已讨伐' : 'DEFEATED'}
                    </span>
                  </div>
                )}

                {/* 成就图标 */}
                {hasAchievement && (
                  <div className="absolute top-3 right-3 z-10">
                    <Trophy className="h-5 w-5 text-yellow-500 drop-shadow-sm" />
                  </div>
                )}

                {/* 顶部装饰线 */}
                <div
                  className={`absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${
                    allCompleted ? 'from-emerald-400 to-emerald-500' : trainingType.bg + ' opacity-60'
                  }`}
                />

                {/* 神兽徽章 */}
                <div className="flex justify-center mb-5 pt-2">
                  <div
                    className={`relative transition-transform duration-300 group-hover:scale-110 ${
                      allCompleted ? 'opacity-70' : ''
                    }`}
                  >
                    <MonsterEmblem
                      type={trainingType.type}
                      size={80}
                      animated={!allCompleted}
                      defeated={allCompleted}
                    />
                  </div>
                </div>

                {/* 标题 */}
                <h3
                  className={`text-xl font-bold text-center mb-1 ${
                    allCompleted
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {trainingType.title[language]}
                </h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {trainingType.description[language]}
                </p>

                {/* 难度星级 */}
                {totalLevels > 0 && (
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < stars
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                      {getDifficultyLabel(totalLevels)}
                    </span>
                  </div>
                )}

                {/* 进度条 */}
                {totalLevels > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>
                        {language === 'Chinese' ? '讨伐进度' : 'Progress'}
                      </span>
                      <span className="font-mono">
                        {completedLevels}/{totalLevels}
                        {language === 'Chinese' ? ' 级' : ' levels'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          allCompleted
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r ' + trainingType.bg.replace('from-', 'from-').replace('to-', 'to-')
                        }`}
                        style={{
                          width: `${totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0}%`,
                          background: allCompleted
                            ? undefined
                            : `linear-gradient(90deg, ${getGradientColors(trainingType.type)})`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-center">
                  {allCompleted ? (
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
                      <Check className="h-4 w-4" />
                      <span>{language === 'Chinese' ? '已讨伐' : 'Defeated'}</span>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/special-training/${trainingType.type}?language=${language}`)
                      }}
                    >
                      <span>
                        {completedLevels === 0
                          ? language === 'Chinese'
                            ? '前往讨伐'
                            : 'Start Hunt'
                          : language === 'Chinese'
                          ? '继续讨伐'
                          : 'Continue'}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

/** 根据类型返回渐变颜色值 */
function getGradientColors(type: string): string {
  const map: Record<string, string> = {
    PINYIN_TO_WORDS: '#7c3aed, #9333ea',
    SYNONYMS: '#2563eb, #06b6d4',
    ANTONYMS: '#e11d48, #ec4899',
    IDIOMS: '#d97706, #eab308',
    WORD_COLLOCATION: '#0d9488, #10b981',
    FILL_IN_BLANK: '#0284c7, #6366f1',
    QUANTIFIERS: '#ea580c, #f59e0b',
    PUNCTUATION: '#d946ef, #ec4899',
  }
  return map[type] || '#6366f1, #8b5cf6'
}
