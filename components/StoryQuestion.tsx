import { Star, Check, X } from 'lucide-react'

interface StoryQuestionProps {
  question: {
    id: string
    question: string
    options?: string | null
    type: string
    difficulty: number
  }
  questionNumber: number
  totalQuestions: number
  selectedAnswer?: string
  onSelectAnswer: (answer: string) => void
  showResult?: boolean
  isCorrect?: boolean
  correctAnswer?: string
  explanation?: string | null
}

export default function StoryQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  isCorrect = false,
  correctAnswer,
  explanation,
}: StoryQuestionProps) {
  const options: string[] = question.options
    ? JSON.parse(question.options)
    : []

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度和难度 */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          题目 {questionNumber}/{totalQuestions}
        </span>
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= question.difficulty
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-emerald-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* 题目 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>

        {/* 选项 */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = showResult && option === correctAnswer
            const isWrongSelected = showResult && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => onSelectAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                  showResult
                    ? isCorrectOption
                      ? 'border-emerald-500 bg-emerald-50'
                      : isWrongSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                    : isSelected
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
                {showResult && isCorrectOption && (
                  <Check className="h-5 w-5 text-emerald-500" />
                )}
                {showResult && isWrongSelected && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </button>
            )
          })}
        </div>

        {/* 解析 */}
        {showResult && explanation && (
          <div
            className={`mt-4 p-4 rounded-xl text-sm ${
              isCorrect
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="font-medium mb-1">
              {isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
            </p>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
