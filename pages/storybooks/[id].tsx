import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import StoryReader from '@/components/StoryReader'
import StoryQuestion from '@/components/StoryQuestion'
import StoryResult from '@/components/StoryResult'
import {
  ArrowLeft,
  BookOpen,
  BookCheck,
  Trophy,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import type { StoryBook, StoryQuestion as StoryQuestionType, StoryAttempt, Achievement } from '@/types'

type PageMode = 'loading' | 'reading' | 'quiz' | 'result' | 'error'

interface QuizAnswer {
  questionId: string
  userAnswer: string
}

export default function StoryBookDetail() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query

  // 页面状态
  const [mode, setMode] = useState<PageMode>('loading')
  const [story, setStory] = useState<StoryBook | null>(null)
  const [error, setError] = useState<string>('')

  // 答题状态
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealedQuestions, setRevealedQuestions] = useState<Set<number>>(new Set())

  // 提交状态
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)

  // 结果状态
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  // 退出确认弹窗
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const questions: StoryQuestionType[] = story?.questions ?? []
  const totalQ = questions.length
  const answeredCount = Object.keys(answers).length

  // 加载绘本数据
  useEffect(() => {
    if (id && session) {
      loadStory()
    }
  }, [id, session])

  const loadStory = async () => {
    setMode('loading')
    try {
      const res = await fetch(`/api/storybooks/${id}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('绘本未找到')
          setMode('error')
          return
        }
        throw new Error('加载失败')
      }
      const data = await res.json()
      setStory(data)
      setMode('reading')
    } catch (err) {
      console.error('加载绘本失败:', err)
      setError('加载绘本失败，请稍后重试')
      setMode('error')
    }
  }

  // 开始答题
  const startQuiz = async () => {
    try {
      const res = await fetch(`/api/storybooks/${id}/start`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('开始答题失败')
      const data = await res.json()
      setAttemptId(data.id)
      setCurrentQuestionIndex(0)
      setAnswers({})
      setRevealedQuestions(new Set())
      setMode('quiz')
    } catch (err) {
      console.error('开始答题失败:', err)
      alert('开始答题失败，请重试')
    }
  }

  // 选择答案
  const selectAnswer = useCallback(
    (answer: string) => {
      if (!story) return
      const q = questions[currentQuestionIndex]
      // 如果该题已揭晓答案，不能再次选择
      if (revealedQuestions.has(currentQuestionIndex)) return

      setAnswers((prev) => ({
        ...prev,
        [q.id]: answer,
      }))
    },
    [story, currentQuestionIndex, questions, revealedQuestions]
  )

  // 确认当前题目答案
  const confirmAnswer = () => {
    const q = questions[currentQuestionIndex]
    if (!answers[q.id]) return

    setRevealedQuestions((prev) => new Set(prev).add(currentQuestionIndex))
  }

  // 下一题
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQ - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  // 上一题（只在答题模式下允许，且只能回到已答过的题）
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // 提交答案
  const submitAnswers = async () => {
    if (!attemptId || !story) return

    setSubmitting(true)
    try {
      const answersArray: QuizAnswer[] = Object.entries(answers).map(
        ([questionId, userAnswer]) => ({
          questionId,
          userAnswer,
        })
      )

      const res = await fetch(`/api/storybooks/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          answers: answersArray,
        }),
      })

      if (!res.ok) throw new Error('提交答案失败')
      const data = await res.json()

      setScore(data.score)
      setCorrectCount(data.correctCount)
      setTotalQuestions(data.totalQuestions)

      // 提交成功后调用 complete 接口
      await completeStory()
    } catch (err) {
      console.error('提交答案失败:', err)
      alert('提交答案失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 完成阅读
  const completeStory = async () => {
    if (!attemptId) return

    setCompleting(true)
    try {
      const res = await fetch(`/api/storybooks/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      })

      if (!res.ok) throw new Error('完成阅读失败')
      const data = await res.json()

      // 保存新成就
      if (data.newAchievements?.length > 0) {
        setNewAchievements(data.newAchievements)
      }

      // 记录已完成的绘本 ID 到 sessionStorage
      saveCompletedId()

      setMode('result')
    } catch (err) {
      console.error('完成阅读失败:', err)
      // 即使 complete 失败，也显示结果
      setMode('result')
    } finally {
      setCompleting(false)
    }
  }

  // 记录完成状态
  const saveCompletedId = () => {
    try {
      const stored = sessionStorage.getItem('storybook_completed')
      const ids: string[] = stored ? JSON.parse(stored) : []
      if (!ids.includes(id as string)) {
        ids.push(id as string)
        sessionStorage.setItem('storybook_completed', JSON.stringify(ids))
      }
    } catch {
      // ignore
    }
  }

  // 重新答题
  const handleRetry = () => {
    setAttemptId(null)
    setAnswers({})
    setRevealedQuestions(new Set())
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectCount(0)
    setTotalQuestions(0)
    setNewAchievements([])
    setMode('reading')
  }

  // 返回列表
  const handleBackToList = () => {
    router.push('/storybooks')
  }

  // 退出确认
  const handleExit = () => {
    setShowExitConfirm(true)
  }

  const confirmExit = () => {
    setShowExitConfirm(false)
    router.push('/storybooks')
  }

  // 计算当前模式标签
  const getModeBadge = () => {
    switch (mode) {
      case 'reading':
        return {
          label: '阅读中',
          icon: BookOpen,
          color: 'bg-emerald-100 text-emerald-700',
        }
      case 'quiz':
        return {
          label: '答题中',
          icon: BookCheck,
          color: 'bg-blue-100 text-blue-700',
        }
      case 'result':
        return {
          label: '已完成',
          icon: Trophy,
          color: 'bg-yellow-100 text-yellow-700',
        }
      default:
        return null
    }
  }

  const modeBadge = getModeBadge()

  // ========== 渲染 ==========

  // 加载状态
  if (mode === 'loading') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500">加载绘本中...</p>
        </div>
      </Layout>
    )
  }

  // 错误状态
  if (mode === 'error') {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="p-4 bg-red-50 rounded-full inline-flex mb-4">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || '绘本未找到'}
          </h3>
          <p className="text-gray-500 mb-6">请检查绘本链接是否正确</p>
          <button
            onClick={() => router.push('/storybooks')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回绘本列表
          </button>
        </div>
      </Layout>
    )
  }

  // 阅读模式
  if (mode === 'reading' && story) {
    return (
      <Layout>
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/storybooks')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回列表</span>
          </button>

          {modeBadge && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${modeBadge.color}`}
            >
              <modeBadge.icon className="h-4 w-4" />
              {modeBadge.label}
            </span>
          )}
        </div>

        <StoryReader
          title={story.title}
          content={story.content}
          language={story.language}
          onStartQuiz={startQuiz}
        />
      </Layout>
    )
  }

  // 答题模式
  if (mode === 'quiz' && story) {
    const currentQ = questions[currentQuestionIndex]
    const isRevealed = revealedQuestions.has(currentQuestionIndex)
    const isLastQuestion = currentQuestionIndex === totalQ - 1
    const hasAnswer = !!answers[currentQ?.id]

    return (
      <Layout>
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>退出</span>
          </button>

          <div className="flex items-center gap-3">
            {/* 答题进度 */}
            <span className="text-sm text-gray-500">
              {answeredCount}/{totalQ} 已答
            </span>

            {modeBadge && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${modeBadge.color}`}
              >
                <modeBadge.icon className="h-4 w-4" />
                {modeBadge.label}
              </span>
            )}
          </div>
        </div>

        {/* 答题区域 */}
        <StoryQuestion
          question={currentQ}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQ}
          selectedAnswer={answers[currentQ?.id]}
          onSelectAnswer={selectAnswer}
          showResult={isRevealed}
          isCorrect={
            isRevealed ? answers[currentQ?.id] === currentQ?.answer : false
          }
          correctAnswer={currentQ?.answer}
          explanation={currentQ?.explanation}
        />

        {/* 操作按钮 */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              上一题
            </button>

            <div className="flex items-center gap-3">
              {/* 确认答案按钮（未揭晓时显示） */}
              {!isRevealed && hasAnswer && (
                <button
                  onClick={confirmAnswer}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
                >
                  确认答案
                </button>
              )}

              {/* 下一题或提交按钮 */}
              {isRevealed &&
                (isLastQuestion ? (
                  <button
                    onClick={submitAnswers}
                    disabled={
                      submitting || completing || answeredCount < totalQ
                    }
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium inline-flex items-center gap-2"
                  >
                    {submitting || completing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {completing ? '完成中...' : '提交中...'}
                      </>
                    ) : (
                      '提交答案'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goToNextQuestion}
                    className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
                  >
                    下一题
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* 退出确认弹窗 */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  确认退出？
                </h3>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                退出后当前答题进度将丢失，确定要退出吗？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  继续答题
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    )
  }

  // 结果模式
  if (mode === 'result') {
    const isPerfect = score === 100

    return (
      <Layout>
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/storybooks')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回列表</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Trophy className="h-4 w-4" />
            已完成
          </span>
        </div>

        <StoryResult
          score={score}
          correctCount={correctCount}
          totalCount={totalQuestions}
          isPerfect={isPerfect}
          newAchievements={newAchievements.length > 0 ? newAchievements : undefined}
          onRetry={handleRetry}
          onBackToList={handleBackToList}
        />
      </Layout>
    )
  }

  // 默认状态（不应该到达这里）
  return null
}
