import { BookOpen, Sparkles } from 'lucide-react'

interface StoryReaderProps {
  title: string
  content: string
  language: string
  onStartQuiz: () => void
}

const getLanguageLabel = (lang: string) => {
  return lang === 'English' ? '🇺🇸 英语' : '🇨🇳 中文'
}

export default function StoryReader({ title, content, language, onStartQuiz }: StoryReaderProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-white shadow-md">
            <BookOpen className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
          {title}
        </h1>
        <p className="text-center text-gray-500 text-sm">
          {getLanguageLabel(language)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div className="prose prose-gray max-w-none prose-lg">
          {content.split('\n').map((paragraph, index) => {
            const trimmed = paragraph.trim()
            if (!trimmed) return null
            return (
              <p
                key={index}
                className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg last:mb-0"
                style={{ lineHeight: '1.9' }}
              >
                {trimmed}
              </p>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onStartQuiz}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:from-emerald-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
        >
          <Sparkles className="h-5 w-5" />
          <span>开始答题</span>
        </button>
      </div>
    </div>
  )
}
