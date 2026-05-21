import { CheckCircle, Trophy, RotateCcw, ChevronLeft, Medal } from 'lucide-react'
import { Achievement } from '@/types'
import ProgressBar from './ProgressBar'

interface StoryResultProps {
  score: number
  correctCount: number
  totalCount: number
  isPerfect: boolean
  newAchievements?: Achievement[]
  onRetry: () => void
  onBackToList: () => void
}

export default function StoryResult({
  score,
  correctCount,
  totalCount,
  isPerfect,
  newAchievements,
  onRetry,
  onBackToList,
}: StoryResultProps) {
  const percentage = Math.round((correctCount / totalCount) * 100)

  const getGradeInfo = () => {
    if (percentage >= 100) return { label: '完美通关！', color: 'text-yellow-500', icon: '🏆' }
    if (percentage >= 80) return { label: '非常棒！', color: 'text-emerald-500', icon: '🌟' }
    if (percentage >= 60) return { label: '做得不错！', color: 'text-blue-500', icon: '👍' }
    return { label: '继续加油！', color: 'text-gray-500', icon: '💪' }
  }

  const grade = getGradeInfo()

  return (
    <div className="max-w-lg mx-auto">
      {/* 顶部庆祝 */}
      {isPerfect && (
        <div className="text-center mb-6 animate-bounce">
          <span className="text-6xl">🎉</span>
        </div>
      )}

      {/* 成绩卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
        {/* 大号分数 */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#9ca3af'}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 54 * (percentage / 100)} ${2 * Math.PI * 54 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{score}</span>
          </div>
        </div>

        {/* 评级 */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-2xl">{grade.icon}</span>
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
        </div>

        {/* 统计数据 */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>
              正确 <span className="font-semibold text-gray-900">{correctCount}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>
              总分 <span className="font-semibold text-gray-900">{totalCount}</span>
            </span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">正确率</span>
            <span className="font-medium text-gray-900">{percentage}%</span>
          </div>
          <ProgressBar
            progress={percentage}
            color={percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-blue-500' : 'bg-gray-400'}
          />
        </div>
      </div>

      {/* 新成就 */}
      {newAchievements && newAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Medal className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">新解锁成就</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-xl border border-yellow-100 p-4 text-center"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onRetry}
          className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重新答题</span>
        </button>
        <button
          onClick={onBackToList}
          className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>返回列表</span>
        </button>
      </div>
    </div>
  )
}
