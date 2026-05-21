interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function NineTailFox({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `nineTailFox-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="60%" stopColor="#0d0d1a" />
          <stop offset="100%" stopColor="#05050a" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8BA0C8" />
          <stop offset="30%" stopColor="#B0C5E8" />
          <stop offset="50%" stopColor="#7A8FB0" />
          <stop offset="70%" stopColor="#5A6F90" />
          <stop offset="100%" stopColor="#8BA0C8" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#E8E8F0" />
          <stop offset="50%" stopColor="#D0D0E0" />
          <stop offset="100%" stopColor="#B0B0C8" />
        </radialGradient>
        <radialGradient id={`${filterId}-face`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F0F0F8" />
          <stop offset="100%" stopColor="#D8D8E8" />
        </radialGradient>
        <linearGradient id={`${filterId}-tail`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8F0" />
          <stop offset="60%" stopColor="#C8C8D8" />
          <stop offset="100%" stopColor="#B0B0C8" />
        </linearGradient>
        <radialGradient id={`${filterId}-eye`} cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFB84D" />
          <stop offset="60%" stopColor="#D4943A" />
          <stop offset="100%" stopColor="#8B5E14" />
        </radialGradient>
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
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#8BA0C8" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#3A4A6A" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#E0E8F8" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 角落云纹 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#B0C5E8" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#B0C5E8" strokeWidth="0.8" opacity="0.2" />

      {/* 九尾狐主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 九尾 */}
        <path d="M26,58 C16,46 10,36 14,28 C18,24 22,30 20,38" fill="none" stroke="#C8C8D8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22,62 C10,52 4,40 8,32 C12,26 16,32 14,42" fill="none" stroke="#D0D0E0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18,66 C6,58 0,46 4,38 C8,32 12,38 10,48" fill="none" stroke="#C8C8D8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M94,58 C104,46 110,36 106,28 C102,24 98,30 100,38" fill="none" stroke="#C8C8D8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M98,62 C110,52 116,40 112,32 C108,26 104,32 106,42" fill="none" stroke="#D0D0E0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M102,66 C114,58 120,46 116,38 C112,32 108,38 110,48" fill="none" stroke="#C8C8D8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28,70 C18,66 12,56 14,50 C16,46 20,50 20,56" fill="none" stroke="#D0D0E0" strokeWidth="2" strokeLinecap="round" />
        <path d="M92,70 C102,66 108,56 106,50 C104,46 100,50 100,56" fill="none" stroke="#D0D0E0" strokeWidth="2" strokeLinecap="round" />
        <path d="M60,78 C60,68 58,62 62,58 C66,54 64,60 62,66" fill="none" stroke="#C8C8D8" strokeWidth="2" strokeLinecap="round" />

        {/* 尾尖金色 */}
        <circle cx="14" cy="30" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="8" cy="34" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="4" cy="40" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="106" cy="30" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="112" cy="34" r="1.5" fill="#FCD34D" opacity="0.6" />
        <circle cx="116" cy="40" r="1.5" fill="#FCD34D" opacity="0.6" />

        {/* 身体 */}
        <ellipse cx="60" cy="62" rx="18" ry="16" fill={`url(#${filterId}-body)`} />
        {/* 头部 */}
        <circle cx="60" cy="38" r="18" fill={`url(#${filterId}-face)`} />

        {/* 耳朵 */}
        <path d="M44,24 L38,10 L50,20Z" fill={`url(#${filterId}-body)`} stroke="#B0B0C8" strokeWidth="0.8" />
        <path d="M76,24 L82,10 L70,20Z" fill={`url(#${filterId}-body)`} stroke="#B0B0C8" strokeWidth="0.8" />
        <path d="M45,22 L41,14 L49,20Z" fill="#FCD34D" opacity="0.4" />
        <path d="M75,22 L79,14 L71,20Z" fill="#FCD34D" opacity="0.4" />

        {/* 眼睛 - 狐媚眼 */}
        <ellipse cx="48" cy="36" rx="5" ry="4.5" fill="#0A0A0A" />
        <ellipse cx="48" cy="36" rx="3.5" ry="3" fill={`url(#${filterId}-eye)`} />
        <circle cx="49" cy="34" r="1.2" fill="white" opacity="0.7" />
        <ellipse cx="72" cy="36" rx="5" ry="4.5" fill="#0A0A0A" />
        <ellipse cx="72" cy="36" rx="3.5" ry="3" fill={`url(#${filterId}-eye)`} />
        <circle cx="73" cy="34" r="1.2" fill="white" opacity="0.7" />

        {/* 鼻子 */}
        <ellipse cx="60" cy="44" rx="2.5" ry="1.8" fill="#1A1A2E" />
        <path d="M58,44 Q60,42 62,44" fill="none" stroke="#1A1A2E" strokeWidth="0.8" />

        {/* 嘴巴 */}
        <path d="M56,48 Q60,52 64,48" fill="none" stroke="#6B6B8A" strokeWidth="1" strokeLinecap="round" />

        {/* 胡须 */}
        <path d="M44,44 L34,40" fill="none" stroke="#B0B0C8" strokeWidth="0.8" opacity="0.5" />
        <path d="M44,46 L34,46" fill="none" stroke="#B0B0C8" strokeWidth="0.8" opacity="0.5" />
        <path d="M76,44 L86,40" fill="none" stroke="#B0B0C8" strokeWidth="0.8" opacity="0.5" />
        <path d="M76,46 L86,46" fill="none" stroke="#B0B0C8" strokeWidth="0.8" opacity="0.5" />

        {/* 腮红 */}
        <ellipse cx="40" cy="44" rx="4" ry="2" fill="#FF9EB5" opacity="0.2" />
        <ellipse cx="80" cy="44" rx="4" ry="2" fill="#FF9EB5" opacity="0.2" />

        {/* 额头纹 */}
        <path d="M58,24 L60,20 L62,24" fill="none" stroke="#FCD34D" strokeWidth="1" opacity="0.6" />

        {/* 爪子 */}
        <ellipse cx="40" cy="76" rx="6" ry="4" fill="#D0D0E0" />
        <ellipse cx="80" cy="76" rx="6" ry="4" fill="#D0D0E0" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#05050A" stroke="#B0C5E8" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#B0C5E8" fontWeight="bold" letterSpacing="2">九 尾 狐</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#7A8FB0" letterSpacing="1">JIUWEIHU · 九尾之灵</text>
      <circle cx="36" cy="97" r="1" fill="#B0C5E8" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#B0C5E8" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#B0C5E8" strokeWidth="0.5"
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
