import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, X, ArrowRight } from 'lucide-react'
import { Achievement } from '@/types'

interface GrammarQuestion {
  question: string
  options: string[]
  answer: string
  feedback: string
  exerciseId: string
}

interface GrammarExerciseProps {
  questions: GrammarQuestion[]
  onComplete: (score: number) => void
  courseId: string
  lessonId: string
  onNewAchievement?: (achievement: Achievement) => void
}

export default function GrammarExercise({ questions, onComplete, courseId, lessonId, onNewAchievement }: GrammarExerciseProps) {
  const { data: session } = useSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = questions[currentIndex]

  const addToWrongQuestions = async () => {
    if (!session) return
    
    try {
      const response = await fetch('/api/wrong-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: currentQuestion.exerciseId,
          question: currentQuestion.question,
          options: JSON.stringify(currentQuestion.options),
          answer: currentQuestion.answer,
          type: 'grammar',
          courseId,
          lessonId,
        }),
      })
      
      const result = await response.json()
      if (result.newAchievements && result.newAchievements.length > 0 && onNewAchievement) {
        onNewAchievement(result.newAchievements[0])
      }
    } catch (error) {
      console.error('Error adding to wrong questions:', error)
    }
  }

  const handleSelectAnswer = (answer: string) => {
    if (showFeedback) return
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + 1)
    } else {
      addToWrongQuestions()
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setCompleted(true)
      onComplete(score)
    }
  }

  if (completed) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">语法练习完成！</h2>
        <p className="text-gray-600">你的得分：{score}/{questions.length}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">进度: {currentIndex + 1}/{questions.length}</span>
        <span className="text-sm font-medium text-primary-600">得分: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                showFeedback
                  ? option === currentQuestion.answer
                    ? 'border-green-500 bg-green-50'
                    : selectedAnswer === option
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span className="font-medium text-gray-900">{option}</span>
              {showFeedback && option === currentQuestion.answer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {showFeedback && selectedAnswer === option && option !== currentQuestion.answer && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">{currentQuestion.feedback}</p>
        </div>
      )}

      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>{currentIndex < questions.length - 1 ? '下一题' : '查看结果'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
