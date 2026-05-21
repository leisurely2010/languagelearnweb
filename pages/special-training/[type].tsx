import { useState, useEffect, useMemo } from 'react'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowLeft, ChevronRight, Star, Lock, Check, AlertCircle, Loader2 } from 'lucide-react'
import MonsterEmblem from '@/components/monsters'
import type { SpecialTraining, SpecialTrainingType } from '@/types'

type TrainingListItem = Omit<SpecialTraining, 'questions' | 'attempts'> & {
  _count?: {
    questions: number
  }
}

// 神兽中文名映射
const beastNames: Record<string, { Chinese: string; English: string }> = {
  PINYIN_TO_WORDS: { Chinese: '应龙', English: 'Yinglong' },
  SYNONYMS: { Chinese: '饕餮', English: 'Taotie' },
  ANTONYMS: { Chinese: '混沌', English: 'Hundun' },
  IDIOMS: { Chinese: '玄武', English: 'Xuanwu' },
  WORD_COLLOCATION: { Chinese: '凤凰', English: 'Fenghuang' },
  FILL_IN_BLANK: { Chinese: '九尾狐', English: 'Nine-Tail Fox' },
  QUANTIFIERS: { Chinese: '麒麟', English: 'Qilin' },
  PUNCTUATION: { Chinese: '白泽', English: 'Baize' },
}

// 训练类型中文名映射
const typeNames: Record<string, { Chinese: string; English: string }> = {
  PINYIN_TO_WORDS: { Chinese: '看拼音写词语', English: 'Spelling Practice' },
  SYNONYMS: { Chinese: '近义词', English: 'Synonyms' },
  ANTONYMS: { Chinese: '反义词', English: 'Antonyms' },
  IDIOMS: { Chinese: '成语积累', English: 'Idioms' },
  WORD_COLLOCATION: { Chinese: '词语搭配', English: 'Word Collocation' },
  FILL_IN_BLANK: { Chinese: '选词填空', English: 'Fill in the Blank' },
  QUANTIFIERS: { Chinese: '量词使用', English: 'Determiners' },
  PUNCTUATION: { Chinese: '标点用法', English: 'Punctuation' },
}

// 各类型主题色
const typeTheme: Record<string, { bg: string; color: string; border: string; gradient: string }> = {
  PINYIN_TO_WORDS: { bg: 'from-violet-500 to-purple-600', color: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-400 to-purple-500' },
  SYNONYMS: { bg: 'from-blue-500 to-cyan-500', color: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-400 to-cyan-500' },
  ANTONYMS: { bg: 'from-rose-500 to-pink-500', color: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-400 to-pink-500' },
  IDIOMS: { bg: 'from-amber-500 to-yellow-500', color: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-400 to-yellow-500' },
  WORD_COLLOCATION: { bg: 'from-teal-500 to-emerald-500', color: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-400 to-emerald-500' },
  FILL_IN_BLANK: { bg: 'from-sky-500 to-indigo-500', color: 'text-sky-600', border: 'border-sky-200', gradient: 'from-sky-400 to-indigo-500' },
  QUANTIFIERS: { bg: 'from-orange-500 to-amber-500', color: 'text-orange-600', border: 'border-orange-200', gradient: 'from-orange-400 to-amber-500' },
  PUNCTUATION: { bg: 'from-fuchsia-500 to-pink-500', color: 'text-fuchsia-600', border: 'border-fuchsia-200', gradient: 'from-fuchsia-400 to-pink-500' },
}

export default function SpecialTrainingLevelList() {
  const { data: session } = useSession()
  const router = useRouter()
  const { type, language } = router.query

  const lang = (language as string) as 'Chinese' | 'English' || 'Chinese'
  const trainingType = type as SpecialTrainingType | undefined

  const [trainings, setTrainings] = useState<TrainingListItem[]>([])
  const [completedTrainingIds, setCompletedTrainingIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 按level排序的训练列表
  const sortedTrainings = useMemo(() => {
    return [...trainings].sort((a, b) => a.level - b.level)
  }, [trainings])

  // 构建已完成训练ID集合（score >= 60 且 completed）
  const completedTrainingIdSet = useMemo(() => completedTrainingIds, [completedTrainingIds])

  // 检查某个训练是否已完成
  const isTrainingCompleted = (trainingId: string) => {
    return completedTrainingIdSet.has(trainingId)
  }

  // 检查某个等级是否已解锁
  const isLevelUnlocked = (level: number): boolean => {
    if (level === 1) return true
    // 需要前一级完成且score >= 60
    const prevTraining = sortedTrainings.find((t) => t.level === level - 1)
    if (!prevTraining) return false
    return isTrainingCompleted(prevTraining.id)
  }

  // 获取某个等级的状态
  const getLevelStatus = (training: TrainingListItem) => {
    const completed = isTrainingCompleted(training.id)
    const unlocked = isLevelUnlocked(training.level)

    if (!unlocked) return 'locked'
    if (completed) return 'completed'
    return 'available'
  }

  useEffect(() => {
    if (!trainingType || !lang) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [trainingsRes, progressRes] = await Promise.all([
          fetch(`/api/special-training?type=${trainingType}&language=${lang}`),
          fetch('/api/special-training/progress'),
        ])

        if (!trainingsRes.ok) throw new Error('获取训练列表失败')
        if (!progressRes.ok) throw new Error('获取进度失败')

        const trainingsData: TrainingListItem[] = await trainingsRes.json()
        const progressData = await progressRes.json()

        setTrainings(trainingsData)
        setCompletedTrainingIds(new Set(progressData.completedTrainingIds || []))
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [trainingType, lang])

  // 文字国际化
  const beastName = trainingType ? beastNames[trainingType]?.Chinese || '' : ''
  const beastNameEn = trainingType ? beastNames[trainingType]?.English || '' : ''
  const typeName = trainingType ? typeNames[trainingType]?.[lang] || '' : ''
  const theme = trainingType ? typeTheme[trainingType] : typeTheme['PINYIN_TO_WORDS']

  const backText = lang === 'Chinese' ? '返回悬赏令' : 'Back to Bounty List'
  const pageTitle =
    lang === 'Chinese'
      ? `讨伐${beastName} · 三大试炼`
      : `Hunt ${beastNameEn} · Three Trials`
  const pageSubtitle =
    lang === 'Chinese'
      ? `完成所有试炼，讨伐${beastName}，获取丰厚奖励！`
      : `Complete all trials, defeat ${beastNameEn}, and earn great rewards!`
  const questionsText = lang === 'Chinese' ? '题' : ' questions'
  const difficultyText = lang === 'Chinese' ? '难度' : 'Difficulty'
  const needPrevCompleteText = lang === 'Chinese' ? '需完成前一试炼' : 'Requires previous trial'
  const startText = lang === 'Chinese' ? '开始讨伐' : 'Start Hunt'
  const continueText = lang === 'Chinese' ? '继续讨伐' : 'Continue'
  const defeatedText = lang === 'Chinese' ? '已击败' : 'Defeated'
  const retryText = lang === 'Chinese' ? '重练' : 'Retry'
  const noTrainingTitle = lang === 'Chinese' ? '暂无试炼' : 'No Trials Available'

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-24">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {lang === 'Chinese' ? '加载试炼中...' : 'Loading trials...'}
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
            {lang === 'Chinese' ? '加载失败' : 'Failed to load'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {lang === 'Chinese' ? '重新加载' : 'Reload'}
          </button>
        </div>
      </Layout>
    )
  }

  const getDifficultyStars = (level: number) => {
    // level越高星星越多
    return Math.min(level + 1, 5)
  }

  const getDifficultyLabel = (level: number) => {
    if (level <= 1) return lang === 'Chinese' ? '简单' : 'Easy'
    if (level === 2) return lang === 'Chinese' ? '中等' : 'Medium'
    return lang === 'Chinese' ? '困难' : 'Hard'
  }

  const levelLabels = [
    '',
    lang === 'Chinese' ? '入门' : 'Beginner',
    lang === 'Chinese' ? '进阶' : 'Intermediate',
    lang === 'Chinese' ? '挑战' : 'Challenge',
    lang === 'Chinese' ? '精通' : 'Master',
    lang === 'Chinese' ? '传说' : 'Legend',
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/special-training')}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm">{backText}</span>
        </button>

        {/* 神兽头部区域 */}
        <div className="flex items-center gap-6 mb-10">
          {/* 大号神兽徽章 */}
          <div className="flex-shrink-0">
            <div className="relative">
              {trainingType && (
                <MonsterEmblem
                  type={trainingType}
                  size={180}
                  animated={true}
                  defeated={false}
                />
              )}
              {/* 光晕效果 */}
              <div
                className={`absolute -inset-4 rounded-full bg-gradient-to-r ${theme?.gradient || 'from-primary-400 to-primary-500'} opacity-20 blur-2xl -z-10 animate-pulse`}
              />
            </div>
          </div>

          {/* 标题区域 */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {pageTitle}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {pageSubtitle}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${theme?.bg} text-white shadow-sm`}
              >
                {typeName}
              </span>
              {sortedTrainings.length > 0 && (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {lang === 'Chinese'
                    ? `共 ${sortedTrainings.length} 个试炼`
                    : `${sortedTrainings.length} trials`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 试炼列表 */}
        {sortedTrainings.length > 0 ? (
          <div className="space-y-4">
            {sortedTrainings.map((training, index) => {
              const status = getLevelStatus(training)
              const stars = getDifficultyStars(training.level)
              const questionCount = training._count?.questions || 0
              const levelLabel = levelLabels[training.level] || `Lv.${training.level}`

              return (
                <div
                  key={training.id}
                  className={`relative group bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${
                    status === 'locked'
                      ? 'border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                      : status === 'completed'
                      ? 'border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-100/50 dark:shadow-emerald-900/20 cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
                      : `${theme?.border} dark:border-gray-600 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5`
                  }`}
                  onClick={() => {
                    if (status === 'locked') return
                    router.push(`/special-training/practice/${training.id}`)
                  }}
                >
                  {/* 等级指示器 - 左侧色带 */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                      status === 'locked'
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : status === 'completed'
                        ? 'bg-emerald-400'
                        : `bg-gradient-to-b ${theme?.gradient}`
                    }`}
                  />

                  <div className="pl-6 pr-6 py-5 flex items-center gap-4">
                    {/* 神兽小徽章 */}
                    <div className="flex-shrink-0">
                      {trainingType && (
                        <div
                          className={`transition-transform duration-300 ${
                            status === 'completed'
                              ? 'opacity-60 scale-95'
                              : status === 'locked'
                              ? 'opacity-40 grayscale'
                              : 'group-hover:scale-110'
                          }`}
                        >
                          <MonsterEmblem
                            type={trainingType}
                            size={64}
                            animated={status === 'available'}
                            defeated={status === 'completed'}
                          />
                        </div>
                      )}
                    </div>

                    {/* 训练信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className={`text-lg font-bold ${
                            status === 'locked'
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <span className="text-sm font-mono text-gray-400 dark:text-gray-500 mr-2">
                            Lv.{training.level}
                          </span>
                          {levelLabel}
                          {training.title !== `${levelLabel}` && (
                            <span className="text-gray-500 dark:text-gray-400 font-normal text-base ml-2">
                              — {training.title}
                            </span>
                          )}
                        </h3>
                      </div>

                      <p
                        className={`text-sm mb-2 ${
                          status === 'locked'
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {training.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        {/* 难度星级 */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < stars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-gray-400 dark:text-gray-500 ml-1">
                            {getDifficultyLabel(training.level)}
                          </span>
                        </div>

                        {/* 题目数量 */}
                        {questionCount > 0 && (
                          <span className="text-gray-400 dark:text-gray-500">
                            {questionCount}
                            {questionsText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 状态按钮 */}
                    <div className="flex-shrink-0">
                      {status === 'locked' ? (
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                          <Lock className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {lang === 'Chinese' ? '未解锁' : 'Locked'}
                          </span>
                        </div>
                      ) : status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium">
                            <Check className="h-4 w-4" />
                            <span>{defeatedText}</span>
                          </div>
                          <button
                            className="flex items-center gap-1 text-gray-400 hover:text-primary-500 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/special-training/practice/${training.id}`)
                            }}
                          >
                            {retryText}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/special-training/practice/${training.id}`)
                          }}
                        >
                          <span>{startText}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 锁定遮罩提示 */}
                  {status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-[1px]">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/70 dark:bg-gray-900/90 text-white rounded-full text-sm font-medium">
                        <Lock className="h-4 w-4" />
                        <span>
                          {index > 0
                            ? `${needPrevCompleteText} Lv.${sortedTrainings[index - 1]?.level}`
                            : needPrevCompleteText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-7xl mb-6">
              {trainingType && (
                <div className="inline-block opacity-30">
                  <MonsterEmblem type={trainingType} size={100} animated={false} defeated={true} />
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {noTrainingTitle}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {lang === 'Chinese'
                ? '该类型还没有试炼内容，请等待后续更新'
                : 'No trial content available for this type yet. Please check back later.'}
            </p>
            <button
              onClick={() => router.push('/special-training')}
              className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {lang === 'Chinese' ? '返回悬赏令' : 'Back to Bounty List'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
