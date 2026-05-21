interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Baize({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `baize-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={defeated ? { filter: 'grayscale(1) opacity(0.6)' } : undefined}
    >
      <defs>
        <radialGradient id={`${filterId}-bg`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1A1A2A" />
          <stop offset="60%" stopColor="#0A0A18" />
          <stop offset="100%" stopColor="#00000A" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D0C8B0" />
          <stop offset="30%" stopColor="#E8E0D0" />
          <stop offset="50%" stopColor="#C0B8A0" />
          <stop offset="70%" stopColor="#A09880" />
          <stop offset="100%" stopColor="#D0C8B0" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#F0ECE4" />
          <stop offset="50%" stopColor="#E0DCD4" />
          <stop offset="100%" stopColor="#C8C0B8" />
        </radialGradient>
        <radialGradient id={`${filterId}-face`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#F8F4F0" />
          <stop offset="100%" stopColor="#E0DCD4" />
        </radialGradient>
        <linearGradient id={`${filterId}-horn`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D77B" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <filter id={`${filterId}-pop-shadow`}>
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
        </filter>
        <filter id={`${filterId}-glow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 画框 */}
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#D0C8B0" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#7A7268" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#F0ECE4" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 云纹 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#D0C8B0" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#D0C8B0" strokeWidth="0.8" opacity="0.2" />

      {/* 白泽主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 鬃毛 */}
        <path d="M38,42 C28,34 20,42 28,50 C32,54 36,50 34,46" fill="none" stroke="#D0C8B0" strokeWidth="2" strokeLinecap="round" />
        <path d="M82,42 C92,34 100,42 92,50 C88,54 84,50 86,46" fill="none" stroke="#D0C8B0" strokeWidth="2" strokeLinecap="round" />
        <path d="M34,28 C24,24 16,32 24,40 C28,44 32,40 30,34" fill="none" stroke="#C0B8A0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M86,28 C96,24 104,32 96,40 C92,44 88,40 90,34" fill="none" stroke="#C0B8A0" strokeWidth="1.5" strokeLinecap="round" />

        {/* 身体 */}
        <ellipse cx="60" cy="66" rx="22" ry="18" fill={`url(#${filterId}-body)`} />
        {/* 脖子 */}
        <ellipse cx="60" cy="48" rx="14" ry="12" fill={`url(#${filterId}-body)`} />
        {/* 头部 */}
        <circle cx="60" cy="36" r="20" fill={`url(#${filterId}-face)`} />

        {/* 独角 - 凸出画框 */}
        <path d="M58,18 C56,8 52,0 50,-2 C52,2 54,8 56,16" fill={`url(#${filterId}-horn)`} stroke="#8B6508" strokeWidth="0.5" />
        <path d="M62,18 C64,8 68,0 70,-2 C68,2 66,8 64,16" fill={`url(#${filterId}-horn)`} stroke="#8B6508" strokeWidth="0.5" />
        {/* 角纹 */}
        <path d="M57,12 L59,10 M61,10 L63,8" stroke="#F5D77B" strokeWidth="0.5" opacity="0.7" />

        {/* 耳朵 */}
        <ellipse cx="36" cy="24" rx="5" ry="7" fill="#E0DCD4" transform="rotate(-20 36 24)" stroke="#C0B8A0" strokeWidth="0.8" />
        <ellipse cx="84" cy="24" rx="5" ry="7" fill="#E0DCD4" transform="rotate(20 84 24)" stroke="#C0B8A0" strokeWidth="0.8" />

        {/* 眼睛 */}
        <ellipse cx="46" cy="34" rx="5" ry="5.5" fill="#0A0A0A" />
        <circle cx="47" cy="32" r="1.8" fill="white" opacity="0.7" />
        <ellipse cx="74" cy="34" rx="5" ry="5.5" fill="#0A0A0A" />
        <circle cx="75" cy="32" r="1.8" fill="white" opacity="0.7" />
        {/* 眉骨 */}
        <path d="M40,29 Q46,25 52,29" fill="none" stroke="#A09880" strokeWidth="1" />
        <path d="M68,29 Q74,25 80,29" fill="none" stroke="#A09880" strokeWidth="1" />

        {/* 狮子鼻 */}
        <ellipse cx="60" cy="44" rx="3.5" ry="2.5" fill="#8A8278" />
        <circle cx="58" cy="43" r="1" fill="#5A5248" />
        <circle cx="62" cy="43" r="1" fill="#5A5248" />

        {/* 嘴巴 */}
        <path d="M54,48 Q60,54 66,48" fill="none" stroke="#8A8278" strokeWidth="1.5" strokeLinecap="round" />

        {/* 胡须 */}
        <path d="M42,44 L30,40" fill="none" stroke="#C0B8A0" strokeWidth="0.8" opacity="0.5" />
        <path d="M42,46 L30,46" fill="none" stroke="#C0B8A0" strokeWidth="0.8" opacity="0.5" />
        <path d="M78,44 L90,40" fill="none" stroke="#C0B8A0" strokeWidth="0.8" opacity="0.5" />
        <path d="M78,46 L90,46" fill="none" stroke="#C0B8A0" strokeWidth="0.8" opacity="0.5" />

        {/* 腮红 */}
        <ellipse cx="36" cy="46" rx="5" ry="3" fill="#FFB5B5" opacity="0.15" />
        <ellipse cx="84" cy="46" rx="5" ry="3" fill="#FFB5B5" opacity="0.15" />

        {/* 四蹄 */}
        <ellipse cx="36" cy="82" rx="7" ry="5" fill="#D0C8B0" />
        <ellipse cx="52" cy="84" rx="7" ry="5" fill="#D0C8B0" />
        <ellipse cx="68" cy="84" rx="7" ry="5" fill="#D0C8B0" />
        <ellipse cx="84" cy="82" rx="7" ry="5" fill="#D0C8B0" />

        {/* 尾巴 */}
        <path d="M60,80 C66,90 72,94 78,92" fill="none" stroke="#D0C8B0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="78" cy="92" r="3" fill="#C0B8A0" />

        {/* 额头智慧纹 */}
        <path d="M58,18 L60,14 L62,18" fill="none" stroke="#FCD34D" strokeWidth="1.2" />
        <circle cx="60" cy="16" r="1.5" fill="#FCD34D" opacity="0.5" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#00000A" stroke="#D0C8B0" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#D0C8B0" fontWeight="bold" letterSpacing="2">白 泽</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#A09880" letterSpacing="1">BAIZE · 通晓万物</text>
      <circle cx="36" cy="97" r="1" fill="#D0C8B0" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#D0C8B0" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#D0C8B0" strokeWidth="0.5"
          strokeDasharray="3 6" opacity="0.4"
          style={{ animation: 'spinSlow 8s linear infinite', transformOrigin: 'center' }} />
      )}

      {defeated && (
        <g opacity="0.6">
          <rect x="11" y="11" width="98" height="98" rx="2" fill="rgba(0,0,0,0.4)" />
          <text x="60" y="55" textAnchor="middle" fontSize="14" fill="#6B7280" fontWeight="bold" fontFamily="serif">封</text>
          <text x="60" y="68" textAnchor="middle" fontSize="6" fill="#6B7280">已讨伐</text>
          <line x1="30" y1="45" x2="90" y2="75" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
          <line x1="90" y1="45" x2="30" y2="75" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
        </g>
      )}
    </svg>
  )
}
