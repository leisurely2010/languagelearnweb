import { useEffect, useMemo, useRef, useState } from 'react'
import MonsterEmblem from './monsters'
import { SpecialTrainingType } from '@/types'
import { playCompleteSound, playCorrectSound, playIncorrectSound } from '@/utils/sounds'

interface BattleSceneProps {
  monsterType: SpecialTrainingType
  monsterName: string
  level: number
  currentQuestion: number
  totalQuestions: number
  score: number
  isCorrect: boolean | null
  isCompleted: boolean
  onStart?: () => void
  started: boolean
  answerEffectKey: number
}

function getHpColorClasses(hpPercent: number): string {
  if (hpPercent > 60) {
    return 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
  }
  if (hpPercent > 30) {
    return 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500'
  }
  return 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600'
}

function getHpGlowColor(hpPercent: number): string {
  if (hpPercent > 60) return 'rgba(34,197,94,0.3)'
  if (hpPercent > 30) return 'rgba(234,179,8,0.3)'
  return 'rgba(239,68,68,0.4)'
}

function getHpLabelColor(hpPercent: number): string {
  if (hpPercent > 60) return 'text-green-400'
  if (hpPercent > 30) return 'text-yellow-400'
  return 'text-red-400'
}

function CrossSlashEffect({
  tone,
  fullScreen = false,
}: {
  tone: 'hero' | 'beast'
  fullScreen?: boolean
}) {
  const palette =
    tone === 'hero'
      ? {
          glow: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(248,113,113,0.36), rgba(255,255,255,0))',
          core: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,247,214,0.95) 46%, rgba(255,87,87,0.95) 52%, rgba(255,255,255,0))',
          edge: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.96), rgba(255,255,255,0))',
          shadow: 'rgba(248,113,113,0.55)',
          burst: 'radial-gradient(circle, rgba(255,241,214,0.95) 0%, rgba(255,99,71,0.55) 42%, rgba(255,255,255,0) 78%)',
          veil: 'radial-gradient(circle at center, rgba(255,120,80,0.08) 0%, rgba(127,29,29,0.12) 44%, rgba(0,0,0,0) 72%)',
        }
      : {
          glow: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(96,165,250,0.32), rgba(255,255,255,0))',
          core: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.96) 46%, rgba(96,165,250,0.94) 54%, rgba(255,255,255,0))',
          edge: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(224,242,254,0.98), rgba(255,255,255,0))',
          shadow: 'rgba(96,165,250,0.55)',
          burst: 'radial-gradient(circle, rgba(224,242,254,0.9) 0%, rgba(96,165,250,0.45) 42%, rgba(255,255,255,0) 78%)',
          veil: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(30,41,59,0.18) 40%, rgba(15,23,42,0.56) 100%)',
        }

  const shellClass = fullScreen
    ? 'fixed inset-0 z-[90] pointer-events-none overflow-hidden'
    : 'absolute inset-0 z-10 pointer-events-none overflow-hidden'

  const canvasClass = fullScreen
    ? 'absolute left-1/2 top-1/2 h-[160vh] w-[160vw] -translate-x-1/2 -translate-y-1/2'
    : 'absolute inset-0'

  const beamWidth = fullScreen ? '190%' : '148%'
  const lineWidth = fullScreen ? '126%' : '92%'
  const glowHeight = fullScreen ? 28 : 18
  const coreHeight = fullScreen ? 10 : 7
  const edgeHeight = fullScreen ? 3 : 2
  const burstSize = fullScreen ? 240 : 96
  const glowBlur = fullScreen ? 20 : 10
  const coreShadow = fullScreen ? 36 : 22

  const renderSlash = (direction: 'forward' | 'reverse', rotationClass: string, delay = '0s') => {
    const animationName = direction === 'forward' ? 'slashSweepForward' : 'slashSweepReverse'
    const animation = `${animationName} 0.56s cubic-bezier(0.2, 0.82, 0.25, 1) ${delay} forwards`

    return (
      <div className={`absolute inset-0 flex items-center justify-center ${rotationClass}`}>
        <div className="relative flex h-full w-full items-center justify-center">
          <div
            className="absolute rounded-full mix-blend-screen"
            style={{
              width: beamWidth,
              height: `${glowHeight}px`,
              background: palette.glow,
              filter: `blur(${glowBlur}px)`,
              animation,
            }}
          />
          <div
            className="absolute rounded-full mix-blend-screen"
            style={{
              width: beamWidth,
              height: `${coreHeight}px`,
              background: palette.core,
              boxShadow: `0 0 ${coreShadow}px ${palette.shadow}`,
              animation,
            }}
          />
          <div
            className="absolute rounded-full mix-blend-screen"
            style={{
              width: lineWidth,
              height: `${edgeHeight}px`,
              background: palette.edge,
              animation,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={shellClass}>
      <div
        className="absolute inset-0"
        style={{
          background: palette.veil,
          animation: fullScreen ? 'playerHitFlash 0.6s ease-out forwards' : 'playerHitFlash 0.46s ease-out forwards',
        }}
      />
      <div className={canvasClass}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
          style={{
            width: `${burstSize}px`,
            height: `${burstSize}px`,
            background: palette.burst,
            filter: `blur(${fullScreen ? 14 : 8}px)`,
            animation: 'centerBurst 0.42s ease-out forwards',
          }}
        />
        {renderSlash('forward', 'rotate-[36deg]')}
        {renderSlash('reverse', '-rotate-[36deg]', '0.06s')}
      </div>
    </div>
  )
}

export default function BattleScene({
  monsterType,
  monsterName,
  level,
  currentQuestion,
  totalQuestions,
  score,
  isCorrect,
  isCompleted,
  onStart,
  started,
  answerEffectKey,
}: BattleSceneProps) {
  const [flashRed, setFlashRed] = useState(false)
  const [monsterSlashActive, setMonsterSlashActive] = useState(false)
  const [playerSlashActive, setPlayerSlashActive] = useState(false)
  const [cardPop, setCardPop] = useState(false)
  const [tremor, setTremor] = useState(false)
  const [monsterRoar, setMonsterRoar] = useState(false)
  const [showMonsterDamage, setShowMonsterDamage] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const processedEffectKeyRef = useRef(0)

  const startParticles = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 80}%`,
        duration: `${2 + Math.random() * 2}s`,
        delay: `${Math.random() * 2}s`,
      })),
    []
  )

  const sceneParticles = useMemo(
    () =>
      Array.from({ length: 4 }, () => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 80}%`,
        duration: `${2.5 + Math.random() * 2}s`,
        delay: `${Math.random() * 3}s`,
      })),
    []
  )

  const hpPercent = useMemo(() => {
    if (totalQuestions === 0) return 100
    return Math.round(((totalQuestions - score) / totalQuestions) * 100)
  }, [score, totalQuestions])

  const hpColorClass = useMemo(() => getHpColorClasses(hpPercent), [hpPercent])
  const hpGlowColor = useMemo(() => getHpGlowColor(hpPercent), [hpPercent])
  const hpLabelColor = useMemo(() => getHpLabelColor(hpPercent), [hpPercent])

  const borderColorClass = useMemo(() => {
    if (isCompleted) return 'border-yellow-500/60 shadow-lg shadow-yellow-500/10'
    if (hpPercent <= 30) return 'border-red-500/40 shadow-lg shadow-red-500/10'
    if (hpPercent <= 60) return 'border-amber-500/40 shadow-lg shadow-amber-500/10'
    return 'border-gray-700/50'
  }, [hpPercent, isCompleted])

  const bgGlowClass = useMemo(() => {
    if (isCompleted) return 'bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5'
    if (hpPercent <= 30) return 'bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5'
    if (hpPercent <= 60) return 'bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5'
    return ''
  }, [hpPercent, isCompleted])

  useEffect(() => {
    if (!started || answerEffectKey === 0 || answerEffectKey === processedEffectKeyRef.current || isCorrect === null) {
      return
    }

    processedEffectKeyRef.current = answerEffectKey

    if (isCorrect) {
      setComboCount(prev => prev + 1)
      setCardPop(true)
      setMonsterSlashActive(true)
      setTremor(true)
      setMonsterRoar(false)
      setFlashRed(false)
      setShowMonsterDamage(true)
      playCorrectSound()

      const popTimer = setTimeout(() => setCardPop(false), 420)
      const slashTimer = setTimeout(() => setMonsterSlashActive(false), 620)
      const tremorTimer = setTimeout(() => setTremor(false), 560)
      const damageTimer = setTimeout(() => setShowMonsterDamage(false), 760)

      return () => {
        clearTimeout(popTimer)
        clearTimeout(slashTimer)
        clearTimeout(tremorTimer)
        clearTimeout(damageTimer)
      }
    }

    setComboCount(0)
    setFlashRed(true)
    setMonsterRoar(true)
    setPlayerSlashActive(true)
    setCardPop(false)
    setTremor(false)
    setShowMonsterDamage(false)
    playIncorrectSound()

    if (typeof document !== 'undefined') {
      const appRoot = document.getElementById('__next')
      if (appRoot) {
        appRoot.classList.remove('battle-screen-shake')
        void appRoot.offsetWidth
        appRoot.classList.add('battle-screen-shake')
      }
    }

    const flashTimer = setTimeout(() => setFlashRed(false), 520)
    const roarTimer = setTimeout(() => setMonsterRoar(false), 430)
    const slashTimer = setTimeout(() => setPlayerSlashActive(false), 620)
    const shakeTimer = setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.getElementById('__next')?.classList.remove('battle-screen-shake')
      }
    }, 460)

    return () => {
      clearTimeout(flashTimer)
      clearTimeout(roarTimer)
      clearTimeout(slashTimer)
      clearTimeout(shakeTimer)
    }
  }, [answerEffectKey, isCorrect, started])

  useEffect(() => {
    if (isCompleted) {
      playCompleteSound()
    }
  }, [isCompleted])

  const hpText = useMemo(() => {
    if (isCompleted) return '讨伐完成'
    if (hpPercent <= 0) return '濒危'
    if (hpPercent <= 30) return '残血'
    if (hpPercent <= 60) return '受伤'
    return '满血'
  }, [hpPercent, isCompleted])

  if (!started) {
    return (
      <div className="fixed inset-0 z-[70] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.45),_rgba(15,23,42,0.96)_42%,_rgba(2,6,23,1)_78%)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(147,51,234,0.10),transparent_32%,rgba(59,130,246,0.10)_68%,transparent)]" />
        <div className="absolute -right-32 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/5 to-transparent" />

        <div
          className="absolute inset-0 animate-card-shine"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            pointerEvents: 'none',
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {startParticles.map((particle, index) => (
            <div
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-purple-300/40"
              style={{
                top: particle.top,
                left: particle.left,
                animation: `particleFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16 text-center">
          <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]">
            <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/10" />
          </div>

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-purple-200/90 uppercase backdrop-blur-sm">
            Final Preparation
          </div>

          <div className="animate-float">
            <MonsterEmblem
              type={monsterType}
              size={196}
              animated
              className="drop-shadow-[0_0_48px_rgba(168,85,247,0.38)]"
            />
          </div>

          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-[0.25em] text-cyan-200/80 uppercase">
              Lv.{level} Mythic Hunt
            </p>
            <h2 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">
              讨伐 · {monsterName}
            </h2>
            <p className="mt-5 text-lg text-gray-300 sm:text-xl">
              准备好你的知识武器，然后点击开始讨伐。
            </p>
          </div>

          {onStart && (
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 px-10 py-4 text-lg font-bold text-white shadow-[0_18px_48px_rgba(147,51,234,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:from-purple-500 hover:via-fuchsia-500 hover:to-blue-500 hover:shadow-[0_24px_56px_rgba(147,51,234,0.42)] active:scale-95"
            >
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <span>开始讨伐</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}

          <p className="text-sm text-gray-500">
            进入后将开始当前试炼的正式战斗。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 transition-all duration-500 sm:p-6 ${borderColorClass}`}
    >
      {playerSlashActive && <CrossSlashEffect tone="beast" fullScreen />}

      <div className={`absolute inset-0 transition-opacity duration-500 ${bgGlowClass}`} />

      <div
        className="absolute inset-0 animate-card-shine rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          pointerEvents: 'none',
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sceneParticles.map((particle, index) => (
          <div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-purple-400/30"
            style={{
              top: particle.top,
              left: particle.left,
              animation: `particleFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
            }}
          />
        ))}
      </div>

      {monsterSlashActive && (
        <div className="absolute inset-y-2 left-1 top-1/2 z-10 w-40 max-w-[42%] -translate-y-1/2 sm:left-3 sm:w-52">
          <CrossSlashEffect tone="hero" />
        </div>
      )}

      {(showMonsterDamage || flashRed) && (
        <div
          className="absolute inset-0 z-[5] pointer-events-none rounded-2xl transition-opacity duration-300"
          style={{
            backgroundColor: showMonsterDamage ? 'rgba(255,0,0,0.08)' : 'rgba(255,0,0,0.12)',
            boxShadow: showMonsterDamage ? 'inset 0 0 40px rgba(255,0,0,0.16)' : 'inset 0 0 30px rgba(255,0,0,0.2)',
          }}
        />
      )}

      <div className="relative flex items-center gap-4 sm:gap-6">
        <div className={cardPop ? 'animate-card-pop' : ''}>
          <div
            className={
              tremor
                ? 'animate-tremor'
                : monsterRoar
                  ? 'animate-roar'
                  : isCompleted
                    ? 'animate-victory'
                    : ''
            }
          >
            <div className="relative">
              <MonsterEmblem
                type={monsterType}
                size={96}
                animated={!isCompleted}
                defeated={isCompleted}
                className={`transition-all duration-500 ${
                  isCompleted
                    ? 'opacity-80 drop-shadow-[0_0_25px_rgba(234,179,8,0.5)] grayscale-[30%]'
                    : showMonsterDamage
                      ? 'drop-shadow-[0_0_25px_rgba(255,50,50,0.5)] brightness-110'
                      : flashRed
                        ? 'drop-shadow-[0_0_30px_rgba(96,165,250,0.35)]'
                        : hpPercent <= 30
                          ? 'drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                }`}
              />

              {showMonsterDamage && (
                <div
                  className="absolute -right-2 -top-2 text-lg font-extrabold text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                  style={{ animation: 'damageFloat 0.8s ease-out forwards' }}
                >
                  -1
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              <span className="text-sm font-medium text-gray-300">屠龙少年</span>
              <span className="text-xs text-gray-500">VS</span>
              <span className="text-sm font-bold text-white">{monsterName}</span>
              <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-xs font-semibold text-purple-300">
                Lv.{level}
              </span>
            </div>

            {comboCount >= 2 && !isCompleted && (
              <span className="animate-fade-in-up rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                {comboCount} 连击
              </span>
            )}

            {isCompleted && (
              <span className="animate-fade-in-up rounded-full bg-yellow-500/20 px-3 py-0.5 text-xs font-bold text-yellow-400">
                讨伐成功
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${hpLabelColor}`}>HP</span>
                <span className={`text-[10px] ${hpLabelColor}`}>({hpText})</span>
              </div>
              <span className={`font-mono font-bold ${hpLabelColor}`}>{hpPercent}%</span>
            </div>
            <div
              className="relative h-3 overflow-hidden rounded-full bg-gray-700"
              style={{
                boxShadow: `0 0 12px ${hpGlowColor}`,
              }}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${hpColorClass} ${
                  hpPercent <= 30 && !isCompleted ? 'animate-hp-pulse' : ''
                }`}
                style={{ width: `${Math.min(hpPercent, 100)}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
              {hpPercent > 30 && (
                <div
                  className="absolute bottom-0 top-0 w-0.5 bg-white/20"
                  style={{ left: '60%' }}
                />
              )}
              {hpPercent > 60 && (
                <div
                  className="absolute bottom-0 top-0 w-0.5 bg-white/20"
                  style={{ left: '30%' }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              得分: <span className="font-bold text-white">{score}</span>
            </span>
            <span className="text-gray-400">
              <span className="font-bold text-gray-200">{Math.min(currentQuestion + 1, totalQuestions)}</span>
              <span className="text-gray-500">/{totalQuestions} 题</span>
            </span>
          </div>
        </div>
      </div>

      {isCompleted && (
        <div className="relative mt-3 flex items-center justify-center gap-2 text-xs text-yellow-400/80">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
          <span className="flex items-center gap-1">
            <span>🏆</span>
            <span>讨伐完成</span>
            <span>🏆</span>
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        </div>
      )}

      <style jsx>{`
        @keyframes slashSweepForward {
          0% {
            opacity: 0;
            transform: translateX(-130%) scaleX(0.58);
          }
          16% {
            opacity: 1;
          }
          56% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(130%) scaleX(1);
          }
        }

        @keyframes slashSweepReverse {
          0% {
            opacity: 0;
            transform: translateX(130%) scaleX(0.58);
          }
          16% {
            opacity: 1;
          }
          56% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(-130%) scaleX(1);
          }
        }

        @keyframes centerBurst {
          0% {
            opacity: 0.92;
            transform: translate(-50%, -50%) scale(0.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.35);
          }
        }

        @keyframes playerHitFlash {
          0% {
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes damageFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(1.5);
          }
        }
      `}</style>
    </div>
  )
}
