import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import { BookOpen, AlertCircle, Clock, Target } from 'lucide-react'
import { Course } from '@/types'

type TabType = 'course' | 'special'

export default function WrongQuestions() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('course')
  const [coursesWithMistakes, setCoursesWithMistakes] = useState<{ course: Course; count: number }[]>([])
  const [specialMistakes, setSpecialMistakes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      if (activeTab === 'course') {
        fetch('/api/wrong-questions?groupBy=course')
          .then(res => res.json())
          .then(data => {
            setCoursesWithMistakes(data)
            setLoading(false)
          })
          .catch(err => {
            console.error('Error fetching wrong questions:', err)
            setLoading(false)
          })
      } else {
        fetch('/api/wrong-questions?source=special')
          .then(res => res.json())
          .then(data => {
            setSpecialMistakes(data)
            setLoading(false)
          })
          .catch(err => {
            console.error('Error fetching special wrong questions:', err)
            setLoading(false)
          })
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router, activeTab])

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  const hasCourseMistakes = coursesWithMistakes.length > 0
  const hasSpecialMistakes = specialMistakes.length > 0
  const hasAnyMistakes = hasCourseMistakes || hasSpecialMistakes

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">错题本</h1>
          <p className="text-gray-500">查看和复习你的错题</p>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('course')}
          className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
            activeTab === 'course'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            课程错题
          </span>
        </button>
        <button
          onClick={() => setActiveTab('special')}
          className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
            activeTab === 'special'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            专项训练错题
          </span>
        </button>
      </div>

      {/* 课程错题 */}
      {activeTab === 'course' && (
        hasCourseMistakes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesWithMistakes.map(({ course, count }) => (
              <Card
                key={course.id}
                className="p-5 cursor-pointer hover:shadow-md transition-all"
                onClick={() => router.push(`/wrong-questions/${course.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {count} 道错题
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Level {course.level}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<BookOpen className="h-16 w-16" />}
            title="暂无课程错题"
            description="继续学习课程，错题会在这里出现"
            onAction={() => router.push('/courses')}
            actionText="去学习"
          />
        )
      )}

      {/* 专项训练错题 */}
      {activeTab === 'special' && (
        hasSpecialMistakes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialMistakes.map((mistake) => (
              <Card
                key={mistake.id}
                className="p-5 cursor-pointer hover:shadow-md transition-all"
                onClick={() => router.push(`/wrong-questions/special/${mistake.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    错 {mistake.wrongCount} 次
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {getTrainingTypeName(mistake.type)}
                </h3>
                <div className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {getQuestionPreview(mistake.question)}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(mistake.createdAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<Target className="h-16 w-16" />}
            title="暂无专项训练错题"
            description="继续进行专项训练，错题会在这里出现"
            onAction={() => router.push('/special-training')}
            actionText="去训练"
          />
        )
      )}
    </Layout>
  )
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  onAction, 
  actionText 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  onAction: () => void, 
  actionText: string 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-300 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
      >
        {actionText}
      </button>
    </div>
  )
}

function getTrainingTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    'PINYIN_TO_WORDS': '拼音转汉字',
    'SYNONYMS': '同义词',
    'ANTONYMS': '反义词',
    'IDIOMS': '成语',
    'WORD_COLLOCATION': '词语搭配',
    'FILL_IN_BLANK': '填空',
    'QUANTIFIERS': '量词',
    'PUNCTUATION': '标点符号'
  }
  return typeMap[type] || type
}

function getQuestionPreview(question: string): string {
  try {
    const parsed = JSON.parse(question)
    return parsed.pinyin || parsed.word || parsed.idiom || parsed.phrase || '题目'
  } catch {
    return question.substring(0, 50) + (question.length > 50 ? '...' : '')
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
