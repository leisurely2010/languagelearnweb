import { useEffect, useState } from 'react'
import MonsterEmblem from './monsters'
import { SpecialTrainingType } from '@/types'

interface DungeonTransitionProps {
  show: boolean
  monsterType: SpecialTrainingType
  monsterName: string
  level: number
  onComplete: () => void
}

export default function DungeonTransition({
  show,
  monsterType,
  monsterName,
  level,
  onComplete,
}: DungeonTransitionProps) {
  const [phase, setPhase] = useState<'enter' | 'ready' | 'exit'>('enter')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      setPhase('enter')

      const enterTimer = setTimeout(() => {
        setPhase('ready')
      }, 600)

      const readyTimer = setTimeout(() => {
        setPhase('exit')
      }, 1400)

      const exitTimer = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 2200)

      return () => {
        clearTimeout(enterTimer)
        clearTimeout(readyTimer)
        clearTimeout(exitTimer)
      }
    } else {
      setVisible(false)
    }
  }, [show, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* 背景粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-purple-500/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `dungeon-particle ${1.5 + Math.random()}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* 进入阶段 */}
        {phase === 'enter' && (
          <div className="animate-fade-in text-center">
            <div className="mb-4 text-4xl font-bold text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              🏯 进入副本
            </div>
            <div className="text-lg text-gray-300">
              挑战 <span className="font-bold text-white">{monsterName}</span> · Lv.{level}
            </div>
          </div>
        )}

        {/* 准备阶段 */}
        {phase === 'ready' && (
          <div className="animate-fade-in-up text-center">
            <div className="mb-4 animate-pulse">
              <MonsterEmblem
                type={monsterType}
                size={160}
                animated
                className="drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              />
            </div>
            <div className="text-2xl font-bold text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              ⚔️ {monsterName} 出现了！
            </div>
            <div className="mt-2 text-sm text-gray-400">准备好你的知识武器...</div>
          </div>
        )}

        {/* 退出阶段 */}
        {phase === 'exit' && (
          <div className="animate-zoom-in text-center">
            <div className="mb-2 text-6xl">⚔️</div>
            <div className="text-xl font-bold text-white">战斗开始！</div>
          </div>
        )}
      </div>

      {/* 底部加载条 */}
      <div className="absolute bottom-20 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-gray-700">
        <div className="h-full animate-dungeon-progress rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
      </div>

      <style jsx>{`
        @keyframes dungeon-particle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes dungeon-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-dungeon-progress {
          animation: dungeon-progress 2.2s linear forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
