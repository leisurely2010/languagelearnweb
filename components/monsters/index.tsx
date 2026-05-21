import { SpecialTrainingType } from '@/types'
import Yinglong from './Yinglong'
import Taotie from './Taotie'
import Hundun from './Hundun'
import Xuanwu from './Xuanwu'
import Fenghuang from './Fenghuang'
import NineTailFox from './NineTailFox'
import Qilin from './Qilin'
import Baize from './Baize'

interface MonsterEmblemProps {
  type: SpecialTrainingType
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

function MonsterSvg({ type, ...props }: { type: SpecialTrainingType; size?: number; animated?: boolean; defeated?: boolean; className?: string }) {
  switch (type) {
    case 'PINYIN_TO_WORDS': return <Yinglong {...props} />
    case 'SYNONYMS': return <Taotie {...props} />
    case 'ANTONYMS': return <Hundun {...props} />
    case 'IDIOMS': return <Xuanwu {...props} />
    case 'WORD_COLLOCATION': return <Fenghuang {...props} />
    case 'FILL_IN_BLANK': return <NineTailFox {...props} />
    case 'QUANTIFIERS': return <Qilin {...props} />
    case 'PUNCTUATION': return <Baize {...props} />
  }
}

export default function MonsterEmblem({
  type,
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: MonsterEmblemProps) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 卡牌背景光晕 */}
      {animated && !defeated && (
        <div
          className="absolute rounded-full opacity-30 blur-xl"
          style={{
            width: size * 1.2,
            height: size * 1.2,
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            animation: 'breathe 4s ease-in-out infinite',
          }}
        />
      )}

      {/* 卡牌外圈装饰 - 动态旋转光环 */}
      {animated && !defeated && (
        <div
          className="absolute rounded-full"
          style={{
            width: size + 8,
            height: size + 8,
            border: '2px solid transparent',
            borderImage: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.2), rgba(168,85,247,0.4)) 1',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'spinSlow 4s linear infinite',
          }}
        />
      )}

      {/* 暗影卡牌底座 */}
      <div
        className="absolute"
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2), transparent)',
          filter: 'blur(4px)',
          transform: 'translateY(4px)',
        }}
      />

      {/* 神兽主体 */}
      <div className="relative z-10">
        <MonsterSvg type={type} size={size} animated={animated} defeated={defeated} className={className} />
      </div>

      {/* 全息卡牌光泽 - 动态扫描 */}
      {animated && !defeated && (
        <div
          className="absolute inset-0 z-20 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'cardShine 4s ease-in-out infinite',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* 卡牌角落装饰粒子 */}
      {animated && !defeated && (
        <>
          <div
            className="absolute rounded-full bg-purple-400/30"
            style={{
              width: 3,
              height: 3,
              top: '8%',
              left: '15%',
              animation: `particleFloat 3s ease-in-out 0.5s infinite`,
            }}
          />
          <div
            className="absolute rounded-full bg-blue-400/20"
            style={{
              width: 2,
              height: 2,
              top: '12%',
              right: '18%',
              animation: `particleFloat 2.5s ease-in-out 1s infinite`,
            }}
          />
          <div
            className="absolute rounded-full bg-purple-400/25"
            style={{
              width: 2.5,
              height: 2.5,
              bottom: '10%',
              left: '20%',
              animation: `particleFloat 3.5s ease-in-out 0.2s infinite`,
            }}
          />
          <div
            className="absolute rounded-full bg-blue-400/20"
            style={{
              width: 2,
              height: 2,
              bottom: '15%',
              right: '12%',
              animation: `particleFloat 2.8s ease-in-out 1.5s infinite`,
            }}
          />
          {/* 底部高光线 */}
          <div
            className="absolute bottom-0 left-1/4 right-1/4 h-px rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
              animation: 'cardShine 3s ease-in-out 1s infinite',
            }}
          />
        </>
      )}
    </div>
  )
}
