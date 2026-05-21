interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Taotie({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `taotie-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#2a1a0a" />
          <stop offset="60%" stopColor="#1a0f05" />
          <stop offset="100%" stopColor="#0a0500" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C49B3C" />
          <stop offset="30%" stopColor="#E8C84A" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="70%" stopColor="#8B6508" />
          <stop offset="100%" stopColor="#C49B3C" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#C49B3C" />
          <stop offset="50%" stopColor="#8B6508" />
          <stop offset="100%" stopColor="#5A3E00" />
        </radialGradient>
        <radialGradient id={`${filterId}-face`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#8B6508" />
        </radialGradient>
        <radialGradient id={`${filterId}-eye`} cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="60%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#2A0000" />
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

      {/* 画框外发光 */}
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#D4A84B" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      {/* 外框 */}
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#5A3E00" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#F5D77B" strokeWidth="0.5" opacity="0.3" />
      {/* 画面背景 */}
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 云纹装饰 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.2" />
      <path d="M11,88 C16,92 20,88 18,82 C22,86 26,82 24,76" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,88 C104,92 100,88 102,82 C98,86 94,82 96,76" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.2" />

      {/* 饕餮主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 耳朵/角 - 凸出画框 */}
        <path d="M28,24 C20,14 14,10 12,14 C16,18 20,22 24,26" fill={`url(#${filterId}-body)`} stroke="#5A3E00" strokeWidth="0.5" />
        <path d="M92,24 C100,14 106,10 108,14 C104,18 100,22 96,26" fill={`url(#${filterId}-body)`} stroke="#5A3E00" strokeWidth="0.5" />

        {/* 身体 */}
        <ellipse cx="60" cy="70" rx="22" ry="20" fill={`url(#${filterId}-body)`} />
        {/* 头部 */}
        <circle cx="60" cy="44" r="24" fill={`url(#${filterId}-body)`} />
        {/* 面部 */}
        <circle cx="60" cy="44" r="20" fill={`url(#${filterId}-face)`} />

        {/* 眼睛 - 饕餮特征 巨大眼睛 */}
        <ellipse cx="46" cy="40" rx="8" ry="7" fill="#1A0A00" />
        <ellipse cx="46" cy="40" rx="5" ry="4.5" fill={`url(#${filterId}-eye)`} />
        <circle cx="48" cy="38" r="1.5" fill="white" opacity="0.7" />
        <ellipse cx="74" cy="40" rx="8" ry="7" fill="#1A0A00" />
        <ellipse cx="74" cy="40" rx="5" ry="4.5" fill={`url(#${filterId}-eye)`} />
        <circle cx="76" cy="38" r="1.5" fill="white" opacity="0.7" />

        {/* 眉骨 */}
        <path d="M36,34 Q46,28 54,34" fill="none" stroke="#5A3E00" strokeWidth="1.5" />
        <path d="M66,34 Q74,28 84,34" fill="none" stroke="#5A3E00" strokeWidth="1.5" />

        {/* 鼻子 */}
        <ellipse cx="60" cy="48" rx="3" ry="2" fill="#3A2A00" />
        <path d="M58,48 Q60,46 62,48" fill="none" stroke="#3A2A00" strokeWidth="1" />

        {/* 大嘴 */}
        <path d="M42,54 Q60,66 78,54" fill="#3A2A00" stroke="#2A1A00" strokeWidth="1.5" />
        <path d="M46,54 Q60,62 74,54" fill="#8B0000" opacity="0.5" />

        {/* 獠牙 */}
        <path d="M44,56 L42,64 L48,58" fill="#E8D8C8" stroke="#B0A090" strokeWidth="0.5" />
        <path d="M76,56 L78,64 L72,58" fill="#E8D8C8" stroke="#B0A090" strokeWidth="0.5" />
        <path d="M54,58 L52,66 L58,60" fill="#E8D8C8" stroke="#B0A090" strokeWidth="0.5" />
        <path d="M66,58 L68,66 L62,60" fill="#E8D8C8" stroke="#B0A090" strokeWidth="0.5" />

        {/* 爪子 */}
        <path d="M30,66 C24,64 20,66 18,70 M18,70 L16,74 M18,70 L20,74" fill="none" stroke="#8B6508" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M90,66 C96,64 100,66 102,70 M102,70 L104,74 M102,70 L100,74" fill="none" stroke="#8B6508" strokeWidth="1.5" strokeLinecap="round" />

        {/* 腿部 */}
        <ellipse cx="36" cy="84" rx="7" ry="5" fill="#8B6508" />
        <ellipse cx="84" cy="84" rx="7" ry="5" fill="#8B6508" />
      </g>

      {/* 底部名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#0A0500" stroke="#D4A84B" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#D4A84B" fontWeight="bold" letterSpacing="2">饕 餮</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#8B6914" letterSpacing="1">TAOTIE · 贪噬之兽</text>
      <circle cx="36" cy="97" r="1" fill="#F5D77B" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#F5D77B" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#D4A84B" strokeWidth="0.5"
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
