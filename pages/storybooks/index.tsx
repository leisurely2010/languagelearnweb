import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import StoryBookCard from '@/components/StoryBookCard'
import { BookOpen, BookMarked, Sparkles, Lock, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface UnlockedLevel {
  level: number
  language: string
}

interface StoryBook {
  id: string
  title: string
  description: string
  language: string
  level: number
  wordCount: number
  _count?: { questions: number }
  completed?: boolean
}

interface PaginatedResponse {
  data: StoryBook[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ProgressData {
  readCount: number
  completedCount: number
  perfectCount: number
  languages: string[]
}

const PAGE_SIZE = 20

const languages = ['all', 'English', 'Chinese']
const levels = ['all', '1', '2', '3', '4']

const getLanguageLabel = (lang: string) => {
  return lang === 'English' ? '🇺🇸 英语' : '🇨🇳 中文'
}

const levelOptions = [
  { value: 'all', label: '全部等级' },
  { value: '1', label: '入门' },
  { value: '2', label: '初级' },
  { value: '3', label: '中级' },
  { value: '4', label: '高级' },
]

export default function StoryBooks() {
  const { data: session } = useSession()
  const router = useRouter()
  const [storybooks, setStorybooks] = useState<StoryBook[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [unlockedLevels, setUnlockedLevels] = useState<UnlockedLevel[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (session) {
      loadStorybooks()
      loadProgress()
      fetch('/api/user/unlocked-levels')
        .then(res => res.json())
        .then(data => setUnlockedLevels(data))
    }
  }, [session, selectedLanguage, selectedLevel, page])

  const isStorybookUnlocked = (language: string, level: number) => {
    if (level === 1) return true
    return unlockedLevels.some(ul => ul.language === language && ul.level === level)
  }

  const loadStorybooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedLanguage !== 'all') params.set('language', selectedLanguage)
      if (selectedLevel !== 'all') params.set('level', selectedLevel)
      params.set('page', String(page))
      params.set('limit', String(PAGE_SIZE))

      const res = await fetch(`/api/storybooks?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load storybooks')
      const result: PaginatedResponse = await res.json()

      // 从 sessionStorage 获取已完成的绘本 ID
      const completedIds = getCompletedIds()
      const enrichedData = result.data.map((story: StoryBook) => ({
        ...story,
        completed: completedIds.has(story.id),
      }))

      setStorybooks(enrichedData)
      setTotalPages(result.totalPages)
      setTotal(result.total)
    } catch (error) {
      console.error('加载绘本列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    setPage(1)
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setPage(1)
  }

  const loadProgress = async () => {
    try {
      const res = await fetch('/api/storybooks/progress')
      if (res.ok) {
        const data = await res.json()
        setProgress(data)
      }
    } catch (error) {
      console.error('加载阅读进度失败:', error)
    }
  }

  const getCompletedIds = (): Set<string> => {
    try {
      const stored = sessionStorage.getItem('storybook_completed')
      if (stored) {
        return new Set(JSON.parse(stored))
      }
    } catch {
    }
    return new Set()
  }

  return (
    <Layout>
      {/* 标题区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                绘本阅读 📖
              </h1>
              <p className="text-gray-500 mt-0.5">
                通过阅读小故事提升语言能力
              </p>
            </div>
          </div>
        </div>

        {/* 阅读统计 */}
        {progress && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-700">
              <BookMarked className="h-4 w-4" />
              <span>已读 <strong>{progress.readCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-green-700">
              <Sparkles className="h-4 w-4" />
              <span>已完成 <strong>{progress.completedCount}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* 语言筛选 */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 font-medium">语言：</label>
            <div className="flex gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                    selectedLanguage === lang
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {lang === 'all' ? '全部' : getLanguageLabel(lang)}
                </button>
              ))}
            </div>
          </div>

          {/* 等级筛选 */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 font-medium">等级：</label>
            <div className="flex gap-1.5">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLevelChange(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                    selectedLevel === option.value
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-2 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent"></div>
          </div>
          <p className="text-gray-500 mt-4">加载绘本中...</p>
        </div>
      ) : storybooks.length === 0 ? (
        /* 空状态 */
        <div className="text-center py-20">
          <div className="p-4 bg-gray-50 rounded-full inline-flex mb-4">
            <BookOpen className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            暂无绘本
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {selectedLanguage !== 'all' || selectedLevel !== 'all'
              ? '当前筛选条件下没有找到绘本，请尝试调整筛选条件'
              : '绘本内容正在准备中，敬请期待'}
          </p>
        </div>
      ) : (
        <>
          {/* 绘本列表网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {storybooks.map((story) => {
              const unlocked = isStorybookUnlocked(story.language, story.level)
              return (
                <div key={story.id} className="relative group">
                  <StoryBookCard
                    story={story}
                    onClick={() => unlocked && router.push(`/storybooks/${story.id}`)}
                  />
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
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                const isActive = pageNum === page
                const isNearby = Math.abs(pageNum - page) <= 2
                const isEdge = pageNum === 1 || pageNum === totalPages
                if (!isNearby && !isEdge) {
                  if (pageNum === page - 3 || pageNum === page + 3) {
                    return <span key={pageNum} className="text-gray-400 px-1">...</span>
                  }
                  return null
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">绘本未解锁</h3>
              <p className="text-gray-500 mb-6">该绘本需要先通过对应等级的考试才能阅读</p>
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
