import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Award, ChevronRight, CheckCircle, Lock, Calendar, Check, X } from 'lucide-react'

interface Exam {
  id: string
  language: string
  level: number
  title: string
  description: string
  passingScore: number
  totalQuestions: number
}

interface UnlockedLevel {
  level: number
  language: string
}

interface ExamAttempt {
  examId: string
  passed: boolean
  score: number
  completedAt: string
}

export default function Exams() {
  const { data: session } = useSession()
  const router = useRouter()
  const [exams, setExams] = useState<Exam[]>([])
  const [unlockedLevels, setUnlockedLevels] = useState<UnlockedLevel[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([])

  useEffect(() => {
    if (session) {
      fetch('/api/exams')
        .then(res => res.json())
        .then(data => {
          setExams(data)
          setLoading(false)
        })
      // 获取用户解锁的等级
      fetch('/api/user/unlocked-levels')
        .then(res => res.json())
        .then(data => setUnlockedLevels(data))
      // 获取用户考试记录
      fetch('/api/exams/attempts')
        .then(res => res.json())
        .then(data => setExamAttempts(data))
    }
  }, [session])

  const isExamUnlocked = (language: string, level: number) => {
    if (level === 1) return true
    return unlockedLevels.some(ul => ul.language === language && ul.level === level)
  }

  const isExamPassed = (examId: string) => {
    return examAttempts.some(a => a.examId === examId && a.passed)
  }

  const languages = ['all', 'English', 'Chinese']
  const levelNames = ['', '入门', '初级', '中级', '高级']

  const filteredExams = exams.filter(exam => {
    const matchesLanguage = selectedLanguage === 'all' || exam.language === selectedLanguage
    return matchesLanguage
  })

  const getLanguageLabel = (lang: string) => {
    return lang === 'English' ? '🇺🇸 英语' : '🇨🇳 中文'
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">水平考试</h1>
          <p className="text-gray-500">通过考试解锁更高等级的课程</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
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
                {lang === 'all' ? '全部' : getLanguageLabel(lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map(exam => {
            const unlocked = isExamUnlocked(exam.language, exam.level)
            const passed = isExamPassed(exam.id)
            return (
              <div key={exam.id} className="relative group">
                <div
                  className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md cursor-pointer ${
                    unlocked 
                      ? 'border-gray-200 hover:border-primary-300' 
                      : 'border-gray-100'
                  }`}
                  onClick={() => unlocked && router.push(`/exams/${exam.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {getLanguageLabel(exam.language)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {levelNames[exam.level]}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{exam.totalQuestions} 道题目</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>及格分: {exam.passingScore}分</span>
                    </div>
                  </div>
                </div>
                {passed && (
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">考试未解锁</h3>
              <p className="text-gray-500 mb-6">该考试需要先通过对应等级的考试才能参加</p>
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
                    window.location.href = `/courses`
                  }}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  去学习
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
