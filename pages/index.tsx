import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import CourseCard from '@/components/CourseCard'
import ProgressBar from '@/components/ProgressBar'
import AchievementBadge from '@/components/AchievementBadge'
import { BookOpen, Users, Trophy, TrendingUp, Zap, Star, Heart } from 'lucide-react'
import { Course } from '@/types'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [userStats, setUserStats] = useState({ level: 1, totalXP: 0, currentStreak: 0 })

  const fetchData = () => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setCourses(data.slice(0, 4)))
      .catch(err => console.error('Error fetching courses:', err))

    if (session) {
      fetch('/api/user', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            console.error('Failed to fetch user data:', data.message)
            return
          }
          setUserStats({
            level: data.level || 1,
            totalXP: data.totalXP || 0,
            currentStreak: data.currentStreak || 0,
          })
        })
        .catch(err => console.error('Error fetching user data:', err))
    }
  }

  useEffect(() => {
    fetchData()
    const handleRouteChange = () => {
      fetchData()
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [session, router])

  // 同样的等级计算函数，保持与进度页面一致
  const getLevelInfo = (totalXP: number) => {
    let level = 1
    let accumulatedXP = 0
    let xpForCurrentLevel = 1000

    while (totalXP >= accumulatedXP + xpForCurrentLevel) {
      accumulatedXP += xpForCurrentLevel
      xpForCurrentLevel += 500
      level++
    }

    const xpInCurrentLevel = totalXP - accumulatedXP
    const xpNeededForNextLevel = xpForCurrentLevel
    const remainingXP = xpNeededForNextLevel - xpInCurrentLevel
    const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100

    return {
      level,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      remainingXP,
      progressPercent,
    }
  }

  const levelInfo = getLevelInfo(userStats.totalXP)

  const achievements = [
    { title: '初学者', description: '完成第一次学习', condition: '完成任意一门课程的第一节课', icon: '🌱', unlocked: userStats.totalXP > 0, rarity: 'common' as const },
    { title: '连续学习者', description: '连续学习7天', condition: '连续7天每天至少完成一节课', icon: '🔥', unlocked: userStats.currentStreak >= 7, rarity: 'rare' as const },
    { title: '词汇达人', description: '学习100个单词', condition: '完成所有词汇类课程，累计学习100个单词', icon: '📚', unlocked: userStats.totalXP >= 500, rarity: 'rare' as const },
    { title: '全能学霸', description: '完成所有课程', condition: '完成平台上所有课程的所有课时', icon: '🏆', unlocked: false, rarity: 'legendary' as const },
  ]

  const features = [
    { icon: BookOpen, title: '分级课程体系', description: '从入门到精通的完整学习路径' },
    { icon: Users, title: '互动式学习', description: '单词记忆、语法练习、口语跟读' },
    { icon: Trophy, title: '成就激励', description: '解锁成就，激励学习动力' },
    { icon: TrendingUp, title: '进度追踪', description: '实时追踪学习进度和成长' },
  ]

  return (
    <Layout>
      <section className="gradient-primary text-white rounded-3xl p-8 md:p-12 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            开启你的语言学习之旅
          </h1>
          <p className="text-lg text-white/80 mb-6">
            沉浸式多语种学习体验，支持英语、中文等多种语言，助你轻松掌握新语言
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/courses"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              开始学习
            </a>
            <a
              href="/community"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              加入社区
            </a>
          </div>
        </div>
      </section>

      {session && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">我的学习概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">等级</span>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Lv.{levelInfo.level}</p>
              <p className="text-sm text-gray-500">还差 {levelInfo.remainingXP} XP 升级</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">经验值进度</span>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalXP} XP</p>
              <p className="text-xs text-gray-500 mb-2">
                {levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForNextLevel} XP for Lv.{levelInfo.level + 1}
              </p>
              <div>
                <ProgressBar progress={levelInfo.progressPercent} height="h-1.5" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">连续天数</span>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} 天</p>
              <p className="text-sm text-gray-500">保持学习热情</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">成就</span>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </p>
              <p className="text-sm text-gray-500">解锁更多成就</p>
            </Card>
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">平台特色</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-5">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">热门课程</h2>
          <a href="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            查看全部 →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => window.location.href = `/courses/${course.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">成就展示</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={index}
              title={achievement.title}
              description={achievement.description}
              condition={achievement.condition}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
              rarity={achievement.rarity}
            />
          ))}
        </div>
      </section>
    </Layout>
  )
}
