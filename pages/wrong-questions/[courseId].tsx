import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import AchievementNotification from '@/components/AchievementNotification'
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { WrongQuestion, Achievement } from '@/types'

export default function WrongQuestionsDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { courseId } = router.query
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && courseId) {
      fetch(`/api/wrong-questions?courseId=${courseId}`)
        .then(res => res.json())
        .then(data => {
          setWrongQuestions(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching wrong questions:', err)
          setLoading(false)
        })
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router, courseId])

  const currentQuestion = wrongQuestions[currentIndex]

  const handleOptionSelect = async (option: string) => {
    if (!session || !currentQuestion) return
    
    setSelectedOption(option)
    const isCorrect = option === currentQuestion.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setShowAnswer(true)
    
    try {
      const newConsecutiveCorrect = isCorrect 
        ? currentQuestion.consecutiveCorrect + 1 
        : 0
      
      await fetch(`/api/wrong-questions/${currentQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct: isCorrect }),
      })
      
      if (isCorrect && newConsecutiveCorrect >= 3) {
        await handleRemove()
      } else {
        setWrongQuestions(prev => prev.map(q => 
          q.id === currentQuestion.id 
            ? { ...q, consecutiveCorrect: newConsecutiveCorrect }
            : q
        ))
      }
    } catch (err) {
      console.error('Error updating question:', err)
    }
  }

  const handleNext = () => {
    setShowAnswer(false)
    setSelectedOption(null)
    setFeedback(null)
    if (currentIndex < wrongQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleRemove = async () => {
    if (!session || !currentQuestion) return

    try {
      const response = await fetch(`/api/wrong-questions/${currentQuestion.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.newAchievements && result.newAchievements.length > 0) {
          setNewAchievement(result.newAchievements[0])
        }
      }
      
      setWrongQuestions(prev => prev.filter(q => q.id !== currentQuestion.id))
      
      if (currentIndex < wrongQuestions.length - 1) {
        setShowAnswer(false)
        setSelectedOption(null)
        setFeedback(null)
      } else if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
        setShowAnswer(false)
        setSelectedOption(null)
        setFeedback(null)
      }
    } catch (err) {
      console.error('Error removing question:', err)
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

  if (wrongQuestions.length === 0) {
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
          <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">太棒了！</h3>
          <p className="text-gray-500 mb-6">这门课程的错题已经全部解决</p>
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            继续学习
          </button>
        </div>
      </Layout>
    )
  }

  const options = JSON.parse(currentQuestion.options)

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">错题练习</h1>
          <div className="text-gray-500">
            {currentIndex + 1} / {wrongQuestions.length}
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-500">
              错了 {currentQuestion.wrongCount} 次 · 
              连续答对 {currentQuestion.consecutiveCorrect}/3 次移出错题本
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => !showAnswer && handleOptionSelect(option)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showAnswer
                    ? option === currentQuestion.answer
                      ? 'border-green-500 bg-green-50'
                      : selectedOption === option
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                    : selectedOption === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showAnswer && option === currentQuestion.answer && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showAnswer && (
          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">正确答案</h3>
              <p className="text-green-600">{currentQuestion.answer}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                移出错题本
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                {currentIndex < wrongQuestions.length - 1 ? '下一题' : '完成'}
              </button>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  )
}
