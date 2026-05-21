import { useState } from 'react'
import { Unlock } from 'lucide-react'

interface AchievementBadgeProps {
  title: string
  description: string
  condition: string
  icon: string
  unlocked: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

const rarityStyles = {
  common: {
    bg: 'from-gray-50 to-gray-100',
    border: 'border-gray-300',
    ring: 'ring-green-100',
    iconColor: 'text-gray-600'
  },
  rare: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    ring: 'ring-blue-100',
    iconColor: 'text-blue-600'
  },
  epic: {
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    ring: 'ring-purple-100',
    iconColor: 'text-purple-600'
  },
  legendary: {
    bg: 'from-yellow-50 to-orange-100',
    border: 'border-yellow-300',
    ring: 'ring-yellow-100',
    iconColor: 'text-yellow-600'
  }
}

export default function AchievementBadge({ 
  title, 
  description, 
  condition, 
  icon, 
  unlocked, 
  rarity = 'common' 
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const style = rarityStyles[rarity] || rarityStyles.common

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
        unlocked 
          ? `bg-gradient-to-br ${style.bg} ${style.border} ring-4 ${style.ring}` 
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}>
        {unlocked ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-4xl filter drop-shadow-sm">{icon}</div>
              <Unlock className={`h-4 w-4 ${style.iconColor}`} />
            </div>
            <h4 className={`font-bold text-gray-900 ${style.iconColor}`}>{title}</h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
            {rarity !== 'common' && (
              <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {rarity === 'rare' ? '稀有' : rarity === 'epic' ? '史诗' : '传说'}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-4xl opacity-30 grayscale">{icon}</div>
              <div className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-400">{title}</h4>
            <p className="text-xs text-gray-400 mt-1">成就未解锁</p>
          </>
        )}
      </div>
      
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-xs text-sm">
            <div className="font-bold mb-1">{title}</div>
            <div className="text-gray-300 text-xs mb-2">{description}</div>
            <div className="border-t border-gray-700 pt-2">
              <div className="text-gray-400 text-xs">解锁条件：</div>
              <div className="text-gray-200 text-xs mt-0.5">{condition}</div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
