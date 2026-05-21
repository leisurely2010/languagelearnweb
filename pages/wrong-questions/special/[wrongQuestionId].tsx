import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import AchievementNotification from '@/components/AchievementNotification'
import { ArrowLeft, AlertCircle, CheckCircle2, Check, X } from 'lucide-react'
import { WrongQuestion, Achievement } from '@/types'

export default function SpecialWrongQuestionDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { wrongQuestionId } = router.query
  const [wrongQuestion, setWrongQuestion] = useState<WrongQuestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answerInput, setAnswerInput] = useState('')
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [tempOption, setTempOption] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && wrongQuestionId) {
      fetch('/api/wrong-questions?source=special')
        .then(res => res.json())
        .then(data => {
          const question = data.find((q: WrongQuestion) => q.id === wrongQuestionId)
          setWrongQuestion(question || null)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching wrong question:', err)
          setLoading(false)
        })
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router, wrongQuestionId])

  const parseQuestion = (question: string) => {
    try {
      return JSON.parse(question)
    } catch {
      return {}
    }
  }

  const getOptions = (question: string, type: string): string[] => {
    const parsed = parseQuestion(question)
    if (parsed.options) {
      return parsed.options
    }
    return []
  }

  const handleSubmit = async (userAnswer: string) => {
    if (!session || !wrongQuestion) return
    
    setSelectedOption(userAnswer)
    const isCorrect = userAnswer === wrongQuestion.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setShowAnswer(true)
    setTempOption(null)
    
    try {
      const newConsecutiveCorrect = isCorrect 
        ? wrongQuestion.consecutiveCorrect + 1 
        : 0
      
      await fetch(`/api/wrong-questions/${wrongQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct: isCorrect }),
      })
      
      if (isCorrect && newConsecutiveCorrect >= 3) {
        await handleRemove()
      }
    } catch (err) {
      console.error('Error updating question:', err)
    }
  }

  const handleRemove = async () => {
    if (!session || !wrongQuestion) return

    try {
      const response = await fetch(`/api/wrong-questions/${wrongQuestion.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.newAchievements && result.newAchievements.length > 0) {
          setNewAchievement(result.newAchievements[0])
        }
      }
      
      router.push('/wrong-questions')
    } catch (err) {
      console.error('Error removing question:', err)
    }
  }

  const renderQuestion = () => {
    if (!wrongQuestion) return null
    
    const parsed = parseQuestion(wrongQuestion.question)
    const options = getOptions(wrongQuestion.question, wrongQuestion.type)
    const hasOptions = options.length > 0

    switch (wrongQuestion.type) {
      case 'PINYIN_TO_WORDS':
        return (
          <div>
            <div className="text-2xl font-medium text-gray-900 mb-4">{parsed.pinyin}</div>
            {parsed.hint && <div className="text-gray-500 mb-4">提示: {parsed.hint}</div>}
            {!showAnswer ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="请输入词语"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answerInput) {
                      handleSubmit(answerInput)
                    }
                  }}
                />
                <button
                  onClick={() => answerInput && handleSubmit(answerInput)}
                  disabled={!answerInput}
                  className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-lg ${feedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>你的答案: {answerInput}</span>
                  {feedback === 'correct' ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                </div>
                <div className="text-gray-700">正确答案: {wrongQuestion.answer}</div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div>
            <div className="text-xl font-medium text-gray-900 mb-4">
              {parsed.word || parsed.idiom || parsed.phrase || parsed.sentence}
            </div>
            {hasOptions ? (
              <>
                <div className="space-y-3">
                  {options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => !showAnswer && !tempOption && setTempOption(option)}
                      disabled={showAnswer || (tempOption !== null && tempOption !== option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showAnswer
                          ? option === wrongQuestion.answer
                            ? 'border-green-500 bg-green-50'
                            : selectedOption === option
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 opacity-60'
                          : tempOption === option
                          ? 'border-primary-500 bg-primary-50'
                          : tempOption !== null
                          ? 'border-gray-200 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showAnswer && option === wrongQuestion.answer && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {showAnswer && selectedOption === option && option !== wrongQuestion.answer && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {tempOption && !showAnswer && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleSubmit(tempOption)}
                      className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => setTempOption(null)}
                      className="w-full py-3 px-4 mt-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      重新选择
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">无选项可用</div>
            )}
          </div>
        )
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (!wrongQuestion) {
    return (
      <Layout>
        <div className="mb-6">
          <button
            onClick={() => router.push('/wrong-questions')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回错题本</span>
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">错题不存在</h3>
          <button
            onClick={() => router.push('/wrong-questions')}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            返回错题本
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
      <div className="mb-6">
        <button
          onClick={() => router.push('/wrong-questions')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回错题本</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">专项训练错题练习</h1>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-gray-500">
              错了 {wrongQuestion.wrongCount} 次 · 
              连续答对 {wrongQuestion.consecutiveCorrect}/3 次移出错题本
            </span>
          </div>
          
          {renderQuestion()}
        </div>

        {showAnswer && (
          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">正确答案</h3>
              <p className="text-green-600">{wrongQuestion.answer}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                移出错题本
              </button>
              <button
                onClick={() => router.push('/wrong-questions')}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                返回错题本
              </button>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  )
}
