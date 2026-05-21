import { useEffect, useState } from 'react'
import { X, Trophy } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
}

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-2xl p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
              {achievement.icon}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider opacity-90">成就解锁！</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full bg-white animate-progress" />
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </div>
  )
}
