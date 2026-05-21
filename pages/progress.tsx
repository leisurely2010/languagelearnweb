import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import ProgressBar from '@/components/ProgressBar'
import AchievementBadge from '@/components/AchievementBadge'
import { Trophy, TrendingUp, Calendar, Award, Zap } from 'lucide-react'
import { WRONG_QUESTION_ACHIEVEMENTS } from '@/lib/achievements'
import { Course, Progress, Achievement } from '@/types'

export default function Progress() {
  const { data: session } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState({ level: 1, totalXP: 0, currentStreak: 0, totalWrongQuestions: 0, totalCorrectedQuestions: 0 })
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const fetchData = () => {
    if (session) {
      fetch('/api/user', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            console.error('Failed to fetch user data:', data.message)
            return
          }
          setUserData({
            level: data.level || 1,
            totalXP: data.totalXP || 0,
            currentStreak: data.currentStreak || 0,
            totalWrongQuestions: data.totalWrongQuestions || 0,
            totalCorrectedQuestions: data.totalCorrectedQuestions || 0,
          })
          setAchievements(data.achievements || [])
        })
        .catch(err => {
          console.error('Error fetching user data:', err)
        })

      fetch('/api/courses', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setCourses(data))
        .catch(err => console.error('Error fetching courses:', err))

      fetch('/api/progress', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setProgress(data))
        .catch(err => console.error('Error fetching progress:', err))
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

  const calculateCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (!course) return 0
    const completedLessons = progress.filter(p => p.courseId === courseId && p.completed).length
    return (completedLessons / course.lessons.length) * 100
  }

  const totalProgress = courses.length > 0 
    ? courses.reduce((acc, course) => acc + calculateCourseProgress(course.id), 0) / courses.length
    : 0

  // 计算等级所需经验值，难度递增：
  // 等级1：0-1000 XP
  // 等级2：1000-2500 XP (+1500)
  // 等级3：2500-4500 XP (+2000)
  // 等级4：4500-7000 XP (+2500)
  // 等级5：7000-10000 XP (+3000)
  // 等级6：10000-13500 XP (+3500)
  // ... 以此类推，每级递增500 XP
  const getLevelInfo = (totalXP: number) => {
    let level = 1
    let accumulatedXP = 0
    let xpForCurrentLevel = 1000 // 第1级需要1000 XP

    // 循环直到找到合适的等级
    while (totalXP >= accumulatedXP + xpForCurrentLevel) {
      accumulatedXP += xpForCurrentLevel
      xpForCurrentLevel += 500 // 每级需求递增500 XP
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
      nextLevelStartXP: accumulatedXP,
      nextLevelEndXP: accumulatedXP + xpForCurrentLevel
    }
  }

  const levelInfo = getLevelInfo(userData.totalXP)

  const allAchievements = [
    { 
      title: '初学者', 
      description: '完成第一次学习', 
      condition: '完成任意一门课程的第一节课',
      icon: '🌱',
      rarity: 'common' as const
    },
    { 
      title: '坚持就是胜利', 
      description: '连续学习3天', 
      condition: '连续3天每天至少完成一节课',
      icon: '⭐',
      rarity: 'common' as const
    },
    { 
      title: '连续学习者', 
      description: '连续学习7天', 
      condition: '连续7天每天至少完成一节课',
      icon: '🔥',
      rarity: 'rare' as const
    },
    { 
      title: '词汇达人', 
      description: '学习100个单词', 
      condition: '完成所有词汇类课程，累计学习100个单词',
      icon: '📚',
      rarity: 'rare' as const
    },
    { 
      title: '语法高手', 
      description: '完成所有语法课程', 
      condition: '完成所有语言的语法类课程',
      icon: '✅',
      rarity: 'epic' as const
    },
    { 
      title: '口语新星', 
      description: '完成口语练习', 
      condition: '完成任意一门口语类课程',
      icon: '🎤',
      rarity: 'common' as const
    },
    { 
      title: '听力专家', 
      description: '完成听力训练', 
      condition: '完成任意一门听力类课程',
      icon: '🎧',
      rarity: 'common' as const
    },
    { 
      title: '双语达人', 
      description: '同时学习英语和中文', 
      condition: '完成至少一门英语课程和一门中文课程',
      icon: '🌍',
      rarity: 'epic' as const
    },
    { 
      title: '全能学霸', 
      description: '完成所有课程', 
      condition: '完成平台上所有课程的所有课时',
      icon: '🏆',
      rarity: 'legendary' as const
    },
    { 
      title: '社区新人', 
      description: '发布第一篇帖子', 
      condition: '在社区发布你的第一篇帖子',
      icon: '💬',
      rarity: 'common' as const
    },
    { 
      title: '社区活跃', 
      description: '发布10篇帖子', 
      condition: '在社区累计发布10篇帖子',
      icon: '🌟',
      rarity: 'rare' as const
    },
    { 
      title: '经验大师', 
      description: '获得10000 XP', 
      condition: '累计获得10000点经验值',
      icon: '⭐',
      rarity: 'legendary' as const
    },
    // 山海经神兽专项成就
    { 
      title: '屠龙者 · 应龙', 
      description: '击败应龙，完成所有等级的看拼音写词语训练', 
      condition: '完成所有等级的看拼音写词语专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '噬灵者 · 饕餮', 
      description: '击败饕餮，完成所有等级的近义词训练', 
      condition: '完成所有等级的近义词专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '破虚者 · 混沌', 
      description: '击破混沌，完成所有等级的反义词训练', 
      condition: '完成所有等级的反义词专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '镇岳者 · 玄武', 
      description: '镇压玄武，完成所有等级的成语积累训练', 
      condition: '完成所有等级的成语积累专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '御火者 · 凤凰', 
      description: '驯服凤凰，完成所有等级的词语搭配训练', 
      condition: '完成所有等级的词语搭配专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '幻瞳者 · 九尾狐', 
      description: '看穿九尾狐，完成所有等级的选词填空训练', 
      condition: '完成所有等级的选词填空专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '踏云者 · 麒麟', 
      description: '驾驭麒麟，完成所有等级的量词使用训练', 
      condition: '完成所有等级的量词使用专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '通明者 · 白泽', 
      description: '领悟白泽，完成所有等级的标点用法训练', 
      condition: '完成所有等级的标点用法专项训练',
      icon: '⚔️',
      rarity: 'epic' as const
    },
    { 
      title: '八边形战士 · 山海至尊', 
      description: '击败全部8种山海经神兽，完成所有专项训练全部等级', 
      condition: '完成全部8种类型的专项训练所有等级',
      icon: '🏯',
      rarity: 'legendary' as const
    },
    // 错题相关成就
    { 
      title: '初遇错题', 
      description: '第一次遇到错题', 
      condition: '在练习中答错第一道题',
      icon: '❌',
      rarity: 'common' as const
    },
    { 
      title: '错题收集者', 
      description: '累计遇到10道错题', 
      condition: '在练习中累计答错10道题',
      icon: '📚',
      rarity: 'common' as const
    },
    { 
      title: '错题达人', 
      description: '累计遇到50道错题', 
      condition: '在练习中累计答错50道题',
      icon: '📖',
      rarity: 'rare' as const
    },
    { 
      title: '错题大师', 
      description: '累计遇到100道错题', 
      condition: '在练习中累计答错100道题',
      icon: '🎓',
      rarity: 'epic' as const
    },
    { 
      title: '知错能改', 
      description: '第一次纠正错题', 
      condition: '在错题本中成功纠正第一道错题',
      icon: '✅',
      rarity: 'common' as const
    },
    { 
      title: '改错小能手', 
      description: '累计纠正10道错题', 
      condition: '在错题本中累计纠正10道题',
      icon: '🔧',
      rarity: 'common' as const
    },
    { 
      title: '改错专家', 
      description: '累计纠正50道错题', 
      condition: '在错题本中累计纠正50道题',
      icon: '🛠️',
      rarity: 'rare' as const
    },
    { 
      title: '改错大师', 
      description: '累计纠正100道错题', 
      condition: '在错题本中累计纠正100道题',
      icon: '🏆',
      rarity: 'epic' as const
    },
    { 
      title: '错题终结者', 
      description: '累计纠正200道错题', 
      condition: '在错题本中累计纠正200道题',
      icon: '👑',
      rarity: 'legendary' as const
    },
    { 
      title: '平衡学习者', 
      description: '遇到和纠正的错题都超过50道', 
      condition: '累计遇到50道以上错题，并且累计纠正50道以上错题',
      icon: '⚖️',
      rarity: 'epic' as const
    },
  ]

  const getUnlockedAchievements = () => {
    return allAchievements.map(ach => {
      const unlocked = achievements.some(a => a.title === ach.title)
      return { ...ach, unlocked }
    })
  }

  const unlockedAchievementsList = getUnlockedAchievements()

  const calculateWeeklyStats = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - todayDayIndex);
    monday.setHours(0, 0, 0, 0);
    
    const weeklyStudyDays: number[] = [];
    
    progress.forEach(p => {
      if (p.completedAt) {
        const completedDate = new Date(p.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        
        if (completedDate >= monday) {
          const completedDayOfWeek = completedDate.getDay();
          const completedDayIndex = completedDayOfWeek === 0 ? 6 : completedDayOfWeek - 1;
          if (!weeklyStudyDays.includes(completedDayIndex)) {
            weeklyStudyDays.push(completedDayIndex);
          }
        }
      }
    });
    
    return { weeklyStudyDays, todayDayIndex };
  };

  if (!session) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请登录查看学习进度</h2>
          <p className="text-gray-500 mb-4">登录后可以查看您的学习数据和成就</p>
          <div className="flex justify-center space-x-4">
            <a href="/auth/login" className="px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
              登录
            </a>
            <a href="/auth/register" className="px-6 py-2 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-primary-300 transition-colors">
              注册
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学习进度</h1>
          <p className="text-gray-500">追踪你的学习成长和成就</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">学习等级</span>
            <Zap className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">Lv.{levelInfo.level}</div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">经验值进度</span>
              <span className="text-gray-700">
                {levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForNextLevel} XP
              </span>
            </div>
            <ProgressBar progress={levelInfo.progressPercent} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">总经验: {userData.totalXP} XP</p>
            <p className="text-sm font-medium text-primary-600">
              还差 {levelInfo.remainingXP} XP 升级到 Lv.{levelInfo.level + 1}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">连续学习</span>
            <Calendar className="h-6 w-6 text-primary-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{userData.currentStreak} 天</div>
          <p className="text-sm text-gray-500">保持学习热情，继续坚持！</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">成就解锁</span>
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {unlockedAchievementsList.filter(a => a.unlocked).length}/{allAchievements.length}
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">成就进度</span>
            </div>
            <ProgressBar 
              progress={(unlockedAchievementsList.filter(a => a.unlocked).length / allAchievements.length) * 100} 
              color="bg-yellow-500"
            />
          </div>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">课程进度</h2>
        <div className="space-y-4">
          {courses.map(course => {
            const courseProgress = calculateCourseProgress(course.id)
            return (
              <Card 
                key={course.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{course.language === 'English' ? '🇺🇸' : '🇨🇳'}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.lessons.length} 节课</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-primary-600">{Math.round(courseProgress)}%</span>
                </div>
                <ProgressBar progress={courseProgress} />
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">学习成就</h2>
          <span className="text-sm text-gray-500">
            已解锁 {unlockedAchievementsList.filter(a => a.unlocked).length}/{allAchievements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {unlockedAchievementsList.map((achievement, index) => (
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

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">学习趋势</h2>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <span className="text-gray-700">本周学习天数</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(() => {
                const { weeklyStudyDays } = calculateWeeklyStats();
                return `${weeklyStudyDays.length}/7 天`;
              })()}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {(() => {
              const { weeklyStudyDays, todayDayIndex } = calculateWeeklyStats();
              const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
              
              return weekDays.map((day, index) => {
                const hasStudied = weeklyStudyDays.includes(index);
                const isToday = index === todayDayIndex;
                
                return (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-full aspect-square rounded-lg mb-1 flex items-end justify-center ${
                        hasStudied ? 'bg-green-500' : 'bg-gray-200'
                      }`} 
                      style={{ 
                        height: hasStudied ? '20%' : '20%'
                      }}
                    >
                      {isToday && (
                        <div className="w-2 h-2 bg-white rounded-full mb-1" />
                      )}
                    </div>
                    <span className={`text-xs ${isToday ? 'font-bold text-primary-600' : 'text-gray-500'}`}>{day}</span>
                  </div>
                );
              });
            })()}
          </div>
        </Card>
      </section>
    </Layout>
  )
}
