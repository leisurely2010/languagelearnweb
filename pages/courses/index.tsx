import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import CourseCard from '@/components/CourseCard'
import { Search, BookOpen, Lock, Check, X } from 'lucide-react'
import { Course, Progress } from '@/types'
import { useSession } from 'next-auth/react'

interface UnlockedLevel {
  level: number
  language: string
}

export default function Courses() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [unlockedLevels, setUnlockedLevels] = useState<UnlockedLevel[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
  }, [])

  useEffect(() => {
    if (session) {
      fetch('/api/user/unlocked-levels')
        .then(res => res.json())
        .then(data => setUnlockedLevels(data))
      fetch('/api/progress')
        .then(res => res.json())
        .then(data => setProgress(data))
    }
  }, [session])

  const isCourseUnlocked = (language: string, level: number) => {
    if (level === 1) return true
    return unlockedLevels.some(ul => ul.language === language && ul.level === level)
  }

  const isCourseCompleted = (course: Course) => {
    if (!session) return false
    const allLessonIds = course.lessons.map(l => l.id)
    const completedLessonIds = progress
      .filter(p => p.completed && p.lessonId && p.courseId === course.id)
      .map(p => p.lessonId)
    return allLessonIds.length > 0 && allLessonIds.every(id => completedLessonIds.includes(id))
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage
    const matchesLevel = selectedLevel === 'all' || course.level === parseInt(selectedLevel)
    return matchesSearch && matchesLanguage && matchesLevel
  })

  const languages = ['all', 'English', 'Chinese']
  const levels = [
    { value: 'all', label: '全部等级' },
    { value: '1', label: '入门' },
    { value: '2', label: '初级' },
    { value: '3', label: '中级' },
    { value: '4', label: '高级' },
  ]

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">课程中心</h1>
          <p className="text-gray-500">探索丰富的语言学习课程</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">语言：</label>
              <div className="flex gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                      selectedLanguage === lang
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {lang === 'all' ? '全部' : lang === 'English' ? '🇺🇸 英语' : '🇨🇳 中文'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">等级：</label>
              <div className="flex gap-1.5">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                      selectedLevel === level.value
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map(course => {
            const unlocked = isCourseUnlocked(course.language, course.level)
            const completed = isCourseCompleted(course)
            return (
              <div key={course.id} className="relative group">
                <CourseCard
                  course={course}
                  onClick={() => {
                    if (unlocked) {
                      window.location.href = `/courses/${course.id}`
                    }
                  }}
                />
                {completed && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white px-2.5 py-1.5 rounded-full shadow-md z-10">
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-medium">已完成</span>
                  </div>
                )}
                {!unlocked && (
                  <div 
                    className="absolute inset-0 bg-gray-200/40 rounded-xl cursor-pointer transition-all group-hover:bg-gray-200/30"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUnlockModal(true)
                    }}
                  >
                    <div className="absolute top-12 right-3 flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1.5 rounded-full shadow-md">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs font-medium">未解锁</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到课程</h3>
          <p className="text-gray-500">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}

      {/* 解锁提示弹窗 */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUnlockModal(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setShowUnlockModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center -mt-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">课程未解锁</h3>
              <p className="text-gray-500 mb-6">该课程需要先通过对应等级的考试才能学习</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  稍后再说
                </button>
                <button
                  onClick={() => {
                    setShowUnlockModal(false)
                    window.location.href = `/exams`
                  }}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  参加考试
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
