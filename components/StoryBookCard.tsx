import { BookOpen, ChevronRight, Check, Clock, Globe } from 'lucide-react'

interface StoryBookCardProps {
  story: {
    id: string
    title: string
    description: string
    language: string
    level: number
    wordCount: number
    _count?: { questions: number }
    completed?: boolean
  }
  onClick: () => void
}

const levelLabels = ['', '入门', '初级', '中级', '高级', '精通']

const getLanguageLabel = (lang: string) => {
  return lang === 'English' ? '🇺🇸 英语' : '🇨🇳 中文'
}

export default function StoryBookCard({ story, onClick }: StoryBookCardProps) {
  const levelLabel = levelLabels[story.level] || ''
  const questionCount = story._count?.questions ?? 0

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm border border-gray-100 p-5 card-hover cursor-pointer relative overflow-hidden"
    >
      {story.completed && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white px-2.5 py-1.5 rounded-full shadow-md z-10">
          <Check className="h-4 w-4" />
          <span className="text-xs font-medium">已完成</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-500">
            {getLanguageLabel(story.language)}
          </span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            story.level === 1
              ? 'bg-emerald-100 text-emerald-700'
              : story.level === 2
              ? 'bg-green-100 text-green-700'
              : story.level === 3
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {levelLabel}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {story.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{story.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <BookOpen className="h-4 w-4" />
          <span>{story.wordCount} 字</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{questionCount} 题</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-600 font-medium">
          <span>开始阅读</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
