import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, X, Volume2 } from 'lucide-react'
import { Achievement } from '@/types'

interface Word {
  word: string
  meaning: string
  options: string[]
  exerciseId: string
}

interface WordPracticeProps {
  words: Word[]
  onComplete: (score: number) => void
  courseId: string
  lessonId: string
  onNewAchievement?: (achievement: Achievement) => void
}

export default function WordPractice({ words, onComplete, courseId, lessonId, onNewAchievement }: WordPracticeProps) {
  const { data: session } = useSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentWord = words[currentIndex]

  const addToWrongQuestions = async () => {
    if (!session) return
    
    try {
      const response = await fetch('/api/wrong-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: currentWord.exerciseId,
          question: currentWord.word,
          options: JSON.stringify(currentWord.options),
          answer: currentWord.meaning,
          type: 'vocabulary',
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
    
    if (answer === currentWord.meaning) {
      setScore(prev => prev + 1)
    } else {
      addToWrongQuestions()
    }
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
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
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
        <p className="text-gray-600">你的得分：{score}/{words.length}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">进度: {currentIndex + 1}/{words.length}</span>
        <span className="text-sm font-medium text-primary-600">得分: {score}</span>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-center mb-4">
          <button className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
            <Volume2 className="h-6 w-6 text-primary-600" />
          </button>
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">{currentWord.word}</h2>
        <p className="text-center text-gray-500">选择正确的中文释义</p>
      </div>

      <div className="space-y-3">
        {currentWord.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(option)}
            disabled={showFeedback}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              showFeedback
                ? option === currentWord.meaning
                  ? 'border-green-500 bg-green-50'
                  : selectedAnswer === option
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{option}</span>
              {showFeedback && option === currentWord.meaning && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {showFeedback && selectedAnswer === option && option !== currentWord.meaning && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="mt-6">
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            {currentIndex < words.length - 1 ? '下一题' : '查看结果'}
          </button>
        </div>
      )}
    </div>
  )
}
