import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Play, Pause, Check, X } from 'lucide-react'
import { Achievement } from '@/types'

interface ListeningQuestion {
  audioUrl?: string
  question: string
  options: string[]
  answer: string
  feedback: string
  exerciseId: string
}

interface ListeningPracticeProps {
  questions: ListeningQuestion[]
  onComplete: (score: number) => void
  courseId: string
  lessonId: string
  onNewAchievement?: (achievement: Achievement) => void
}

export default function ListeningPractice({ questions, onComplete, courseId, lessonId, onNewAchievement }: ListeningPracticeProps) {
  const { data: session } = useSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
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
          type: 'listening',
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

  const handlePlay = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 3000)
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
        <div className="text-6xl mb-4">🎧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">听力练习完成！</h2>
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

      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`p-6 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-indigo-400'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white shadow-lg hover:shadow-xl disabled:opacity-70`}
          >
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
          </button>
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-900">
          {currentQuestion.question}
        </h2>
        {isPlaying && (
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-indigo-400 rounded-full animate-pulse"
                style={{ height: `${Math.random() * 20 + 10}px` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(option)}
            disabled={showFeedback}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              showFeedback
                ? option === currentQuestion.answer
                  ? 'border-green-500 bg-green-50'
                  : selectedAnswer === option
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{option}</span>
              {showFeedback && option === currentQuestion.answer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {showFeedback && selectedAnswer === option && option !== currentQuestion.answer && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showFeedback && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 mb-6">
            <p className="text-blue-800 text-sm">{currentQuestion.feedback}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
          </button>
        </>
      )}
    </div>
  )
}
