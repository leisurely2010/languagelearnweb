interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Fenghuang({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `fenghuang-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#2a0a0a" />
          <stop offset="60%" stopColor="#1a0505" />
          <stop offset="100%" stopColor="#0a0000" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C45A3A" />
          <stop offset="30%" stopColor="#E87A5A" />
          <stop offset="50%" stopColor="#B84A2A" />
          <stop offset="70%" stopColor="#8A3A1A" />
          <stop offset="100%" stopColor="#C45A3A" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#E87A5A" />
          <stop offset="50%" stopColor="#C45A3A" />
          <stop offset="100%" stopColor="#8A3A1A" />
        </radialGradient>
        <radialGradient id={`${filterId}-face`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#F09A7A" />
          <stop offset="100%" stopColor="#D46A4A" />
        </radialGradient>
        <linearGradient id={`${filterId}-tail`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D77B" />
          <stop offset="40%" stopColor="#E87A5A" />
          <stop offset="70%" stopColor="#C45A3A" />
          <stop offset="100%" stopColor="#8A3A1A" />
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
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#C45A3A" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#5A1A0A" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#F5D77B" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 角落装饰 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#E87A5A" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#E87A5A" strokeWidth="0.8" opacity="0.2" />

      {/* 凤凰主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 尾羽 - 从画框底部延伸 */}
        <path d="M56,72 C50,86 42,94 36,98 C32,100 34,96 38,92" fill="none" stroke="#F5D77B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60,72 C60,88 56,100 52,104 C48,106 50,100 52,96" fill="none" stroke="#E87A5A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64,72 C70,86 78,94 84,98 C88,100 86,96 82,92" fill="none" stroke="#C45A3A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="96" r="2" fill="#F5D77B" />
        <circle cx="52" cy="102" r="2" fill="#E87A5A" />
        <circle cx="82" cy="96" r="2" fill="#C45A3A" />

        {/* 翅膀 */}
        <path d="M34,54 C20,46 14,52 18,58 C22,62 28,60 34,56" fill={`url(#${filterId}-body)`} opacity="0.7" />
        <path d="M86,54 C100,46 106,52 102,58 C98,62 92,60 86,56" fill={`url(#${filterId}-body)`} opacity="0.7" />

        {/* 身体 */}
        <ellipse cx="60" cy="62" rx="16" ry="14" fill={`url(#${filterId}-body)`} />
        {/* 脖子 */}
        <ellipse cx="60" cy="48" rx="10" ry="8" fill={`url(#${filterId}-body)`} />
        {/* 头部 */}
        <circle cx="60" cy="38" r="14" fill={`url(#${filterId}-face)`} />

        {/* 凤冠 */}
        <path d="M56,26 C52,16 48,10 46,14 C48,18 50,22 54,26" fill="#F5D77B" opacity="0.9" />
        <path d="M60,24 C58,14 56,8 54,10 C56,14 58,18 60,26" fill="#F5D77B" opacity="0.7" />
        <path d="M64,26 C68,16 72,10 74,14 C72,18 70,22 66,26" fill="#F5D77B" opacity="0.9" />

        {/* 眼睛 */}
        <ellipse cx="54" cy="36" rx="4" ry="3.5" fill="#0A0A0A" />
        <circle cx="55" cy="35" r="1.2" fill="white" opacity="0.7" />
        <ellipse cx="66" cy="36" rx="4" ry="3.5" fill="#0A0A0A" />
        <circle cx="67" cy="35" r="1.2" fill="white" opacity="0.7" />

        {/* 喙 */}
        <path d="M60,42 L66,44 L60,46" fill="#D4A84B" stroke="#8B6914" strokeWidth="0.5" />

        {/* 腮红 */}
        <ellipse cx="46" cy="42" rx="4" ry="2" fill="#FF6B6B" opacity="0.3" />
        <ellipse cx="74" cy="42" rx="4" ry="2" fill="#FF6B6B" opacity="0.3" />

        {/* 爪子 */}
        <path d="M48,72 L44,80 L46,78" fill="none" stroke="#8A3A1A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M72,72 L76,80 L74,78" fill="none" stroke="#8A3A1A" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#0A0000" stroke="#E87A5A" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#E87A5A" fontWeight="bold" letterSpacing="2">凤 凰</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#B84A2A" letterSpacing="1">FENGHUANG · 涅槃之火</text>
      <circle cx="36" cy="97" r="1" fill="#E87A5A" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#E87A5A" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#E87A5A" strokeWidth="0.5"
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
