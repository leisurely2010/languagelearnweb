interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Hundun({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `hundun-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={defeated ? { filter: 'grayscale(1) opacity(0.6)' } : undefined}
    >
      <defs>
        <radialGradient id={`${filterId}-bg`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="60%" stopColor="#0d0518" />
          <stop offset="100%" stopColor="#05000a" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6BC4" />
          <stop offset="30%" stopColor="#B89CE8" />
          <stop offset="50%" stopColor="#7B4FA8" />
          <stop offset="70%" stopColor="#5A2E8A" />
          <stop offset="100%" stopColor="#8B6BC4" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#9B6BC4" />
          <stop offset="50%" stopColor="#6B2FA0" />
          <stop offset="100%" stopColor="#3A0E5E" />
        </radialGradient>
        <radialGradient id={`${filterId}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4A8FF" />
          <stop offset="100%" stopColor="#6B2FA0" />
        </radialGradient>
        <radialGradient id={`${filterId}-eye`} cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FF6BFF" />
          <stop offset="60%" stopColor="#8B008B" />
          <stop offset="100%" stopColor="#2A002A" />
        </radialGradient>
        <filter id={`${filterId}-pop-shadow`}>
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
        </filter>
        <filter id={`${filterId}-glow`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 画框 */}
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#8B6BC4" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#3A0E5E" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#D4A8FF" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 角落云纹 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#B89CE8" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#B89CE8" strokeWidth="0.8" opacity="0.2" />

      {/* 混沌 - 圆球主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 混沌光晕 */}
        <circle cx="60" cy="56" r="34" fill="none" stroke="#9B6BC4" strokeWidth="0.5" opacity="0.3"
          style={animated && !defeated ? { animation: 'spinSlow 6s linear infinite', transformOrigin: '60px 56px' } : undefined} />
        <circle cx="60" cy="56" r="26" fill="none" stroke="#9B6BC4" strokeWidth="0.3" opacity="0.2"
          style={animated && !defeated ? { animation: 'spinSlow 4s linear infinite reverse', transformOrigin: '60px 56px' } : undefined} />

        {/* 主体 */}
        <circle cx="60" cy="56" r="24" fill={`url(#${filterId}-body)`} />
        {/* 内部光晕 */}
        <circle cx="60" cy="56" r="16" fill={`url(#${filterId}-core)`} opacity="0.3" />

        {/* 眼睛 */}
        <ellipse cx="48" cy="50" rx="6" ry="5" fill="#0A001A" />
        <ellipse cx="48" cy="50" rx="3.5" ry="3" fill={`url(#${filterId}-eye)`} />
        <circle cx="49" cy="48" r="1.2" fill="white" opacity="0.6" />
        <ellipse cx="72" cy="50" rx="6" ry="5" fill="#0A001A" />
        <ellipse cx="72" cy="50" rx="3.5" ry="3" fill={`url(#${filterId}-eye)`} />
        <circle cx="73" cy="48" r="1.2" fill="white" opacity="0.6" />

        {/* 嘴巴 */}
        <ellipse cx="60" cy="62" rx="5" ry="3" fill="#2A004A" />

        {/* 翅膀 */}
        <path d="M28,44 C16,36 8,40 12,48 C16,52 22,50 26,46" fill="#6B2FA0" opacity="0.7" />
        <path d="M92,44 C104,36 112,40 108,48 C104,52 98,50 94,46" fill="#6B2FA0" opacity="0.7" />

        {/* 小脚 */}
        <ellipse cx="40" cy="78" rx="6" ry="4" fill="#5A1E8A" />
        <ellipse cx="60" cy="80" rx="6" ry="4" fill="#5A1E8A" />
        <ellipse cx="80" cy="78" rx="6" ry="4" fill="#5A1E8A" />

        {/* 角 */}
        <path d="M50,34 C48,26 46,22 44,24" fill="#6B2FA0" />
        <path d="M70,34 C72,26 74,22 76,24" fill="#6B2FA0" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#0A001A" stroke="#B89CE8" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#B89CE8" fontWeight="bold" letterSpacing="2">混 沌</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#7B4FA8" letterSpacing="1">HUNDUN · 混沌之灵</text>
      <circle cx="36" cy="97" r="1" fill="#B89CE8" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#B89CE8" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#B89CE8" strokeWidth="0.5"
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
