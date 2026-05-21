import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { ArrowLeft, Check, AlertCircle, Trophy, XCircle } from 'lucide-react'

interface ExamQuestion {
  id: string
  order: number
  question: string
  options: string
  answer: string
  explanation?: string
}

interface Exam {
  id: string
  language: string
  level: number
  title: string
  description: string
  passingScore: number
  totalQuestions: number
  questions: ExamQuestion[]
}

export default function ExamPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    if (id && session) {
      loadExam()
    }
  }, [id, session])

  const loadExam = async () => {
    try {
      const res = await fetch(`/api/exams/${id}`)
      const data = await res.json()
      setExam(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load exam:', error)
    }
  }

  const startExam = async () => {
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: 'POST',
      })
      const data = await res.json()
      setAttemptId(data.id)
    } catch (error) {
      console.error('Failed to start exam:', error)
    }
  }

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (exam && currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitExam = async () => {
    if (!attemptId || !exam) return
    
    setSubmitting(true)
    try {
      console.log('Submitting exam with answers:', answers)
      const res = await fetch(`/api/exams/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId,
          answers,
        }),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      console.log('Response from server:', data)
      
      // 使用后端返回的数据，确保字段存在
      setResults({
        score: data.score,
        passed: data.passed,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions
      })
      setShowResults(true)
    } catch (error) {
      console.error('Failed to submit exam:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </Layout>
    )
  }

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">考试未找到</h3>
          <button
            onClick={() => router.push('/exams')}
            className="text-primary-600 hover:text-primary-700"
          >
            返回考试列表
          </button>
        </div>
      </Layout>
    )
  }

  if (showResults && results) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/exams')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回考试列表
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            
            {results.passed ? (
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 恭喜通过！</h2>
                <p className="text-gray-500 mb-6">你已成功解锁下一级别的课程！</p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">未通过</h2>
                <p className="text-gray-500 mb-6">再试一次，你可以的！</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-gray-900">{results.score}</span>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="w-10 h-1 bg-red-600 rounded-full"></div>
                    <div className="w-10 h-1 bg-red-600 rounded-full"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">总得分</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900">
                  {results.correctCount}/{results.totalQuestions}
                </div>
                <div className="text-sm text-gray-500">答对题数</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/exams')}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                返回考试列表
              </button>
              {!results.passed && (
                <button
                  onClick={() => {
                    setShowResults(false)
                    setAnswers({})
                    setCurrentQuestion(0)
                    setAttemptId(null)
                    setResults(null)
                  }}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  重新考试
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!attemptId) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/exams')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回考试列表
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{exam.title}</h1>
            <p className="text-gray-600 mb-6">{exam.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{exam.totalQuestions}</div>
                <div className="text-sm text-gray-500">题目数量</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{exam.passingScore}%</div>
                <div className="text-sm text-gray-500">及格分数</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">考试提示</h4>
                  <p className="text-sm text-yellow-700">
                    请确保你已经完成了该级别的所有课程。考试一旦开始，请认真完成每一道题目。
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              开始考试
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const currentQuestionData = exam.questions[currentQuestion]
  const options = JSON.parse(currentQuestionData.options)
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/exams')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              第 {currentQuestion + 1} 题 / 共 {exam.questions.length} 题
            </span>
            <span className="text-sm text-gray-500">
              已答 {answeredCount} 题
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-3">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => selectAnswer(currentQuestionData.id, option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestionData.id] === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {answers[currentQuestionData.id] === option && (
                    <Check className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一题
            </button>
            
            {currentQuestion === exam.questions.length - 1 ? (
              <button
                onClick={submitExam}
                disabled={submitting || answeredCount < exam.questions.length}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交试卷'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                下一题
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
