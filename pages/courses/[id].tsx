import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import ProgressBar from '@/components/ProgressBar'
import WordPractice from '@/components/WordPractice'
import GrammarExercise from '@/components/GrammarExercise'
import SpeakingPractice from '@/components/SpeakingPractice'
import ListeningPractice from '@/components/ListeningPractice'
import AchievementNotification from '@/components/AchievementNotification'
import { Play, Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Course, Progress, Achievement } from '@/types'

export default function CourseDetail() {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showExercise, setShowExercise] = useState(false)
  const [currentExerciseType, setCurrentExerciseType] = useState('')
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    if (id) {
      fetch('/api/courses', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          const foundCourse = data.find((c: Course) => c.id === id)
          setCourse(foundCourse || null)
        })
        .catch(err => console.error('Error fetching courses:', err))

      if (session) {
        fetch(`/api/progress?courseId=${id}`, { cache: 'no-store' })
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch progress')
            }
            return res.json()
          })
          .then(data => {
            if (data.message) {
              console.error('API returned error:', data.message)
              return
            }
            
            const completed = data
              .filter((p: Progress) => p.completed && p.lessonId)
              .map((p: Progress) => p.lessonId!)
            setCompletedLessons(completed)
          })
          .catch(err => console.error('Error fetching progress:', err))
      }
    }
  }, [id, session])

  const handleCompleteExercise = (score: number) => {
    const lessonId = selectedLesson !== null && course ? course.lessons[selectedLesson].id : null
    
    const updateProgressAndReturn = () => {
      if (lessonId && !completedLessons.includes(lessonId)) {
        setCompletedLessons(prev => [...prev, lessonId])
      }
      setShowExercise(false)
    }
    
    if (session && lessonId && course) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          lessonId,
          completed: true,
          score,
        }),
      })
        .then(res => {
          if (!res.ok) {
            console.error('Failed to save progress:', res.status, res.statusText)
          }
          return res.json()
        })
        .then(data => {
          if (data && !data.message) {
            updateProgressAndReturn()
          } else {
            console.error('API returned error:', data?.message)
            updateProgressAndReturn()
          }
        })
        .catch(err => {
          console.error('Network error saving progress:', err)
          updateProgressAndReturn()
        })
    } else {
      updateProgressAndReturn()
    }
  }

  const handleStartLesson = (index: number) => {
    setSelectedLesson(index)
    const lesson = course?.lessons[index]
    if (lesson) {
      setCurrentExerciseType(lesson.type)
      setShowExercise(true)
    }
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </Layout>
    )
  }

  const languageFlag = course.language === 'English' ? '🇺🇸' : '🇨🇳'
  const levelLabel = ['', '入门', '初级', '中级', '高级', '精通'][course.level]
  const progress = completedLessons.length / course.lessons.length * 100

  const getExerciseData = () => {
    if (!course || selectedLesson === null) return []
    const lesson = course.lessons[selectedLesson]
    
    const parseOptions = (options: string): string[] => {
      try {
        return JSON.parse(options) as string[]
      } catch {
        return []
      }
    }
    
    if (lesson.type === 'vocabulary') {
      return lesson.exercises.map(ex => ({
        word: ex.question.split('?')[0].trim(),
        meaning: ex.answer,
        options: parseOptions(ex.options),
        exerciseId: ex.id,
      }))
    } else if (lesson.type === 'grammar') {
      return lesson.exercises.map(ex => ({
        question: ex.question,
        options: parseOptions(ex.options),
        answer: ex.answer,
        feedback: ex.feedback,
        exerciseId: ex.id,
      }))
    } else if (lesson.type === 'speaking') {
      return [{ text: lesson.content, hint: '请跟读以上内容' }]
    } else if (lesson.type === 'listening') {
      return lesson.exercises.map(ex => ({
        question: ex.question,
        options: parseOptions(ex.options),
        answer: ex.answer,
        feedback: ex.feedback,
        exerciseId: ex.id,
      }))
    }
    return []
  }

  return (
    <Layout>
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
      {showExercise ? (
        <div className="animate-fadeIn">
          <button
            onClick={() => setShowExercise(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            <span>返回课程</span>
          </button>
          
          {currentExerciseType === 'vocabulary' && (
            <WordPractice 
              words={getExerciseData()} 
              onComplete={handleCompleteExercise} 
              courseId={course.id}
              lessonId={course.lessons[selectedLesson].id}
              onNewAchievement={setNewAchievement}
            />
          )}
          {currentExerciseType === 'grammar' && (
            <GrammarExercise 
              questions={getExerciseData()} 
              onComplete={handleCompleteExercise} 
              courseId={course.id}
              lessonId={course.lessons[selectedLesson].id}
              onNewAchievement={setNewAchievement}
            />
          )}
          {currentExerciseType === 'speaking' && (
            <SpeakingPractice exercises={getExerciseData()} onComplete={handleCompleteExercise} />
          )}
          {currentExerciseType === 'listening' && (
            <ListeningPractice 
              questions={getExerciseData()} 
              onComplete={handleCompleteExercise} 
              courseId={course.id}
              lessonId={course.lessons[selectedLesson].id}
              onNewAchievement={setNewAchievement}
            />
          )}
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl">{languageFlag}</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-sm">{course.language}</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-sm">{levelLabel}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-white/80">{course.description}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>课程进度</span>
                <span>{completedLessons.length}/{course.lessons.length} 节课</span>
              </div>
              <ProgressBar progress={progress} color="bg-white" height="h-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">课程时长</p>
                  <p className="font-semibold text-gray-900">{course.duration} 分钟</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">课程节数</p>
                  <p className="font-semibold text-gray-900">{course.lessons.length} 节</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">完成奖励</p>
                  <p className="font-semibold text-gray-900">{course.lessons.length * 100} XP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">课程大纲</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {course.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const exerciseType = lesson.type === 'vocabulary' ? '单词记忆' :
                                     lesson.type === 'grammar' ? '语法练习' :
                                     lesson.type === 'speaking' ? '口语跟读' : '听力训练'
                
                return (
                  <div
                    key={lesson.id}
                    className="px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                            {index + 1}
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-500">{exerciseType}</p>
                        </div>
                      </div>
                      {!session ? (
                        <a
                          href="/auth/login"
                          className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          登录学习
                        </a>
                      ) : (
                        <button
                          onClick={() => handleStartLesson(index)}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>{isCompleted ? '复习' : '开始学习'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}