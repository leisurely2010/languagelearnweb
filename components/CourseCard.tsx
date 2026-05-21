import { Clock, BookOpen, Star } from 'lucide-react'
import { Course } from '@/types'

interface CourseCardProps {
  course: Course
  onClick: () => void
  className?: string
}

export default function CourseCard({ course, onClick, className }: CourseCardProps) {
  const languageFlag = course.language === 'English' ? '🇺🇸' : '🇨🇳'
  const levelLabel = ['', '入门', '初级', '中级', '高级', '精通'][course.level]

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 card-hover cursor-pointer ${className || ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{languageFlag}</span>
          <span className="text-sm font-medium text-gray-500">{course.language}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          course.level === 1 ? 'bg-green-100 text-green-700' :
          course.level === 2 ? 'bg-blue-100 text-blue-700' :
          course.level === 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>
          {levelLabel}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{course.duration}分钟</span>
        </div>
        <div className="flex items-center space-x-1">
          <BookOpen className="h-4 w-4" />
          <span>{course.lessons.length}节课</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>4.5</span>
        </div>
      </div>
    </div>
  )
}
