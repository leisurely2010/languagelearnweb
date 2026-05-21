import { useState, useEffect, useCallback, useRef } from 'react'
import Layout from '@/components/Layout'
import BattleScene from '@/components/BattleScene'
import DungeonTransition from '@/components/DungeonTransition'
import MonsterEmblem from '@/components/monsters'
import AchievementNotification from '@/components/AchievementNotification'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowLeft, Check, X, ChevronRight, Trophy, Sparkles } from 'lucide-react'
import { SpecialTraining, SpecialTrainingQuestion, SpecialTrainingType } from '@/types'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
}

// 神兽中文名映射
const MONSTER_NAMES: Record<SpecialTrainingType, string> = {
  PINYIN_TO_WORDS: '应龙',
  SYNONYMS: '饕餮',
  ANTONYMS: '混沌',
  IDIOMS: '玄武',
  WORD_COLLOCATION: '凤凰',
  FILL_IN_BLANK: '九尾狐',
  QUANTIFIERS: '麒麟',
  PUNCTUATION: '白泽',
}

export default function SpecialTrainingPractice() {
  const { data: session } = useSession()
  const router = useRouter()
  const { trainingId } = router.query

  // 原有状态
  const [training, setTraining] = useState<SpecialTraining | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [result, setResult] = useState<{ correctCount: number; totalCount: number; score: number } | null>(null)
  const [passed, setPassed] = useState(false)
  const [answerInput, setAnswerInput] = useState('')
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  // 新增战斗状态
  const [battleStarted, setBattleStarted] = useState(false)
  const [dungeonShow, setDungeonShow] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [answerEffectKey, setAnswerEffectKey] = useState(0)
  const [nextTrainingId, setNextTrainingId] = useState<string | null>(null)
  const pendingSubmitPromisesRef = useRef<Set<Promise<void>>>(new Set())
  const submittingQuestionIdsRef = useRef<Set<string>>(new Set())

  // 获取训练数据
  useEffect(() => {
    if (trainingId) {
      fetch(`/api/special-training/${trainingId}`)
        .then(res => res.json())
        .then(data => {
          setTraining(data)
          setLoading(false)
        })
    }
  }, [trainingId])

  // 成就通知队列
  useEffect(() => {
    if (newAchievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(newAchievements[0])
      setNewAchievements(prev => prev.slice(1))
    }
  }, [newAchievements, currentAchievement])

  // 开始训练（在 DungeonTransition onComplete 中调用）
  const startTraining = useCallback(async () => {
    if (!trainingId) return
    const res = await fetch(`/api/special-training/${trainingId}/start`, {
      method: 'POST',
    })
    const data = await res.json()
    setAttemptId(data.id)
  }, [trainingId])

  // 处理"开始讨伐"点击
  const handleStart = useCallback(() => {
    setDungeonShow(true)
  }, [])

  // DungeonTransition 动画完成回调
  const handleDungeonComplete = useCallback(() => {
    setBattleStarted(true)
    setDungeonShow(false)
    startTraining()
  }, [startTraining])

  // 提交答案
  const submitAnswer = async (questionId: string, userAnswer: string) => {
    if (!attemptId || !trainingId) return
    if (submittingQuestionIdsRef.current.has(questionId)) return

    const question = training?.questions?.find(q => q.id === questionId)
    if (!question) return

    // 记录本次答案正误
    const isCorrect = userAnswer === question.answer
    setLastAnswerCorrect(isCorrect)
    setAnswerEffectKey(prev => prev + 1)
    setUserAnswers(prev => ({ ...prev, [questionId]: userAnswer }))
    setShowFeedback(prev => ({ ...prev, [questionId]: true }))

    submittingQuestionIdsRef.current.add(questionId)

    const submitPromise = (async () => {
      try {
        const res = await fetch(`/api/special-training/${trainingId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId, questionId, userAnswer }),
        })

        if (!res.ok) {
          throw new Error('提交答案失败')
        }
      } catch (error) {
        console.error('Failed to submit special training answer:', error)
      } finally {
        submittingQuestionIdsRef.current.delete(questionId)
        pendingSubmitPromisesRef.current.delete(submitPromise)
      }
    })()

    pendingSubmitPromisesRef.current.add(submitPromise)
  }

  // 完成训练
  const completeTraining = async () => {
    if (!attemptId || !trainingId || completing) return

    setCompleting(true)

    try {
      if (pendingSubmitPromisesRef.current.size > 0) {
        await Promise.all(Array.from(pendingSubmitPromisesRef.current))
      }

      const res = await fetch(`/api/special-training/${trainingId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || '完成训练失败')
      }

      if (data.newAchievements && data.newAchievements.length > 0) {
        setNewAchievements(prev => [...prev, ...data.newAchievements])
      }

      if (data.nextTrainingId) {
        setNextTrainingId(data.nextTrainingId)
      }

      setResult({ correctCount: data.correctCount, totalCount: data.totalCount, score: data.score })
      setPassed(Boolean(data.passed))
      setCompleted(true)
    } catch (error) {
      console.error('Failed to complete special training:', error)
    } finally {
      setCompleting(false)
    }
  }

  // 下一题 / 完成
  const handleNext = () => {
    // 先重置答案正误状态
    setLastAnswerCorrect(null)

    if (currentIndex < (training?.questions?.length || 0) - 1) {
      setCurrentIndex(prev => prev + 1)
      setAnswerInput('')
    } else {
      completeTraining()
    }
  }

  const handleAchievementClose = () => {
    setCurrentAchievement(null)
  }

  const resetPracticeState = () => {
    setAttemptId(null)
    setCurrentIndex(0)
    setUserAnswers({})
    setShowFeedback({})
    setCompleted(false)
    setCompleting(false)
    setResult(null)
    setPassed(false)
    setAnswerInput('')
    setBattleStarted(false)
    setDungeonShow(false)
    setLastAnswerCorrect(null)
    setAnswerEffectKey(0)
    setNextTrainingId(null)
    pendingSubmitPromisesRef.current.clear()
    submittingQuestionIdsRef.current.clear()
  }

  const handleRetryTraining = async () => {
    try {
      resetPracticeState()
    } catch (error) {
      console.error('Failed to reset special training state:', error)
      alert('重新挑战失败，请稍后重试。')
    }
  }

  const handleNextTraining = async () => {
    if (!nextTrainingId) {
      alert('下一试炼暂未解锁，或当前已经是最后一个试炼。')
      return
    }

    try {
      await router.push(`/special-training/practice/${nextTrainingId}`)
    } catch (error) {
      console.error('Failed to navigate to next training:', error)
      alert('跳转到下一试炼失败，请稍后重试。')
    }
  }

  // 计算当前得分
  const calculateScore = () => {
    let correct = 0
    Object.entries(userAnswers).forEach(([qId, answer]) => {
      const q = training?.questions?.find(qu => qu.id === qId)
      if (q && answer === q.answer) correct++
    })
    return correct
  }

  const parseQuestion = (question: SpecialTrainingQuestion) => {
    try {
      return JSON.parse(question.question)
    } catch {
      return {}
    }
  }

  const renderQuestion = (question: SpecialTrainingQuestion) => {
    const parsed = parseQuestion(question)
    const hasAnswered = showFeedback[question.id]
    const userAnswer = userAnswers[question.id]
    const isCorrect = hasAnswered && userAnswer === question.answer

    switch (question.type) {
      case 'PINYIN_TO_WORDS':
        return (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">看拼音写词语</span>
            </div>
            <div className="text-2xl font-medium text-gray-900 mb-4">{parsed.pinyin}</div>
            {parsed.hint && <div className="text-gray-500 mb-4">提示: {parsed.hint}</div>}
            {!hasAnswered ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="请输入词语"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answerInput) {
                      submitAnswer(question.id, answerInput)
                    }
                  }}
                />
                <button
                  onClick={() => answerInput && submitAnswer(question.id, answerInput)}
                  disabled={!answerInput}
                  className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>你的答案: {userAnswer}</span>
                  {isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                </div>
                <div className="text-gray-700">正确答案: {question.answer}</div>
                {question.explanation && <div className="text-gray-500 mt-2">解析: {question.explanation}</div>}
              </div>
            )}
          </div>
        )

      case 'SYNONYMS':
      case 'ANTONYMS':
      case 'WORD_COLLOCATION':
      case 'FILL_IN_BLANK':
      case 'QUANTIFIERS':
      case 'PUNCTUATION':
      case 'IDIOMS':
        return (
          <div>
            {(() => {
              const typeLabels: Record<string, string> = {
                SYNONYMS: '近义词',
                ANTONYMS: '反义词',
                WORD_COLLOCATION: '词语搭配',
                FILL_IN_BLANK: '选词填空',
                QUANTIFIERS: '量词使用',
                PUNCTUATION: '标点用法',
                IDIOMS: '成语积累',
              }
              return (
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                    {typeLabels[question.type] || question.type}
                  </span>
                </div>
              )
            })()}
            <div className="text-xl font-medium text-gray-900 mb-4">
              {parsed.word || parsed.idiom || parsed.phrase || parsed.sentence}
            </div>
            <div className="space-y-3">
              {parsed.options?.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => !hasAnswered && submitAnswer(question.id, option)}
                  disabled={hasAnswered || completing}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    hasAnswered
                      ? option === question.answer
                        ? 'border-green-500 bg-green-50'
                        : userAnswer === option
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {hasAnswered && option === question.answer && <Check className="h-5 w-5 text-green-600" />}
                    {hasAnswered && userAnswer === option && option !== question.answer && <X className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              ))}
            </div>
            {hasAnswered && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                {question.explanation && <div className="text-blue-800">解析: {question.explanation}</div>}
              </div>
            )}
          </div>
        )

      default:
        return <div>不支持的题型</div>
    }
  }

  // 加载中
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  // 训练不存在
  if (!training) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">训练不存在</h3>
          <button
            onClick={() => router.push('/special-training')}
            className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            返回专项训练
          </button>
        </div>
      </Layout>
    )
  }

  const monsterType = training.type
  const monsterName = MONSTER_NAMES[monsterType] || '神兽'
  const level = training.level
  const currentQuestion = training.questions?.[currentIndex]
  const totalQuestions = training.questions?.length || 0
  const score = calculateScore()

  // 完成结果面板
  if (completed && result) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push('/special-training')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>返回训练列表</span>
          </button>

          {/* 结果面板 - 金色边框庆祝氛围 */}
          <div className={`relative overflow-hidden rounded-2xl border-2 p-8 text-center shadow-xl ${
            passed
              ? 'border-yellow-400/60 bg-gradient-to-b from-yellow-50 via-amber-50/30 to-white shadow-yellow-200/50'
              : 'border-rose-300/70 bg-gradient-to-b from-rose-50 via-orange-50/30 to-white shadow-rose-200/50'
          }`}>
            {/* 背景装饰 */}
            <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl ${
              passed ? 'bg-yellow-200/40' : 'bg-rose-200/40'
            }`} />
            <div className={`absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl ${
              passed ? 'bg-amber-200/30' : 'bg-orange-200/30'
            }`} />

            {/* 满星背景光效 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`h-48 w-48 rounded-full blur-2xl ${
                passed ? 'bg-yellow-400/5' : 'bg-rose-400/10'
              }`} />
            </div>

            <div className="relative">
              {/* 神兽徽章（击败状态） */}
              <div className="mb-6 flex justify-center">
                <div className="animate-bounce-in">
                  <MonsterEmblem
                    type={monsterType}
                    size={120}
                    defeated={passed}
                    className={passed
                      ? 'drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]'
                      : 'drop-shadow-[0_0_30px_rgba(244,63,94,0.22)]'}
                  />
                </div>
              </div>

              <h2 className={`mb-2 text-4xl font-extrabold text-transparent bg-clip-text ${
                passed
                  ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-orange-600'
                  : 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500'
              }`}>
                {passed ? '⚔️ 讨伐成功！' : '⚠️ 讨伐失败'}
              </h2>

              <p className="mb-6 text-lg text-gray-600">
                {passed ? (
                  <>
                    你以 <span className="text-2xl font-bold text-yellow-600">{result.score}</span>/100 分击败了{' '}
                    <span className="font-bold text-gray-900">{monsterName}</span> · Lv.{level}
                  </>
                ) : (
                  <>
                    你本次得分 <span className="text-2xl font-bold text-rose-600">{result.score}</span>/100，
                    需要达到 <span className="font-bold text-gray-900">60 分</span> 才能击败{' '}
                    <span className="font-bold text-gray-900">{monsterName}</span> · Lv.{level}
                  </>
                )}
              </p>

              {/* 统计数据 */}
              <div className="mx-auto mb-6 grid max-w-sm grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">{result.correctCount}</div>
                  <div className="text-xs text-gray-500">答对</div>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl font-bold text-red-500">{result.totalCount - result.correctCount}</div>
                  <div className="text-xs text-gray-500">答错</div>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary-600">{result.totalCount}</div>
                  <div className="text-xs text-gray-500">总题数</div>
                </div>
              </div>

              {/* 新成就展示 */}
              {passed && newAchievements.length > 0 && (
                <div className="mb-6 space-y-2">
                  {newAchievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="mx-auto flex max-w-md items-center gap-3 rounded-lg bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-3 text-left"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200 text-lg">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1 text-sm font-bold text-yellow-800">
                          <Sparkles className="h-3.5 w-3.5" />
                          新成就
                        </div>
                        <div className="text-sm font-medium text-yellow-900">{ach.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {passed && nextTrainingId && (
                  <button
                    onClick={handleNextTraining}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl hover:shadow-yellow-500/40 active:scale-95"
                  >
                    <span>下一试炼</span>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                {passed && !nextTrainingId && (
                  <button
                    onClick={handleNextTraining}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-300 px-8 py-3 font-bold text-gray-700 transition-all active:scale-95"
                  >
                    <span>下一试炼</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
                {!passed && (
                  <button
                    onClick={handleRetryTraining}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:from-rose-400 hover:to-orange-400 hover:shadow-xl hover:shadow-rose-500/40 active:scale-95"
                  >
                    <span>重新挑战</span>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                <button
                  onClick={() => router.push('/special-training')}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-3 font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>

        <AchievementNotification
          achievement={currentAchievement}
          onClose={handleAchievementClose}
        />
      </Layout>
    )
  }

  const practiceProgressText =
    totalQuestions > 0 ? `第 ${Math.min(currentIndex + 1, totalQuestions)} / ${totalQuestions} 题` : '准备战斗中'

  return (
    <>
      {/* DungeonTransition 过渡动画 */}
      <DungeonTransition
        show={dungeonShow}
        monsterType={monsterType}
        monsterName={monsterName}
        level={level}
        onComplete={handleDungeonComplete}
      />

      <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_rgba(15,23,42,0.98)_36%,_rgba(2,6,23,1)_74%)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,rgba(59,130,246,0.06)_76%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-fuchsia-500/10 to-transparent" />
        <div className="pointer-events-none absolute -left-28 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex min-h-screen flex-col">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{battleStarted ? '退出讨伐' : '返回专项训练'}</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-100/90 uppercase backdrop-blur-sm">
              <span>{monsterName}</span>
              <span className="text-white/30">•</span>
              <span>{practiceProgressText}</span>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-6 sm:px-6 lg:px-8">
            <div className={`grid w-full flex-1 gap-6 ${battleStarted ? 'lg:grid-cols-[minmax(380px,440px)_minmax(0,1fr)]' : 'grid-cols-1'}`}>
              <div className={battleStarted ? 'lg:sticky lg:top-6 self-start' : ''}>
                <BattleScene
                  monsterType={monsterType}
                  monsterName={monsterName}
                  level={level}
                  currentQuestion={currentIndex}
                  totalQuestions={totalQuestions}
                  score={score}
                  isCorrect={lastAnswerCorrect}
                  isCompleted={completed}
                  onStart={handleStart}
                  started={battleStarted}
                  answerEffectKey={answerEffectKey}
                />
              </div>

              {battleStarted && !completed && (
                <div className="flex min-h-[calc(100vh-7rem)] flex-col rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-md sm:p-6">
                  {!attemptId && (
                    <div className="flex flex-1 items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/20">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-300" />
                        <span>正在加载题目...</span>
                      </div>
                    </div>
                  )}

                  {attemptId && currentQuestion && (
                    <>
                      <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-gray-300">
                        <span>{practiceProgressText}</span>
                        <span>当前得分 {score}</span>
                      </div>

                      <div className="flex-1 overflow-auto rounded-[1.5rem] bg-white p-6 text-gray-900 shadow-inner shadow-slate-200/50 animate-fade-in-up">
                        {renderQuestion(currentQuestion)}
                      </div>
                    </>
                  )}

                  {currentQuestion && showFeedback[currentQuestion.id] && !completed && (
                    <button
                      onClick={handleNext}
                      disabled={completing}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-4 text-base font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition-all hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 hover:shadow-[0_24px_48px_rgba(59,130,246,0.42)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span>{completing ? '结算中...' : currentIndex < totalQuestions - 1 ? '下一题' : '完成练习'}</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AchievementNotification
        achievement={currentAchievement}
        onClose={handleAchievementClose}
      />

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.08); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  )
}
