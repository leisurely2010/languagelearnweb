interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Xuanwu({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `xuanwu-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#0a1a2e" />
          <stop offset="60%" stopColor="#050d18" />
          <stop offset="100%" stopColor="#00050a" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A7A9A" />
          <stop offset="30%" stopColor="#7BA0C4" />
          <stop offset="50%" stopColor="#4A6A8A" />
          <stop offset="70%" stopColor="#2A4A6A" />
          <stop offset="100%" stopColor="#5A7A9A" />
        </linearGradient>
        <radialGradient id={`${filterId}-shell`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#5A7A9A" />
          <stop offset="50%" stopColor="#3A5A7A" />
          <stop offset="100%" stopColor="#1A2A4A" />
        </radialGradient>
        <radialGradient id={`${filterId}-head`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#7BA0C4" />
          <stop offset="100%" stopColor="#3A5A7A" />
        </radialGradient>
        <radialGradient id={`${filterId}-snake`} cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#4AB87A" />
          <stop offset="50%" stopColor="#2A8A5A" />
          <stop offset="100%" stopColor="#1A5A3A" />
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
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#5A7A9A" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#1A2A4A" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#A0C4E8" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 角落云纹 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#7BA0C4" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#7BA0C4" strokeWidth="0.8" opacity="0.2" />

      {/* 蛇身 - 缠绕在画框左侧 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        <path d="M96,36 C102,44 100,54 94,58 C88,62 84,56 86,50 C88,44 92,46 90,52" fill="none" stroke={`url(#${filterId}-snake)`} strokeWidth="4" strokeLinecap="round" />
        {/* 蛇头凸出画框 */}
        <ellipse cx="96" cy="36" rx="7" ry="5" fill={`url(#${filterId}-snake)`} transform="rotate(-20 96 36)" />
        <circle cx="100" cy="34" r="2" fill="#0A0A0A" />
        <circle cx="101" cy="33" r="1" fill="white" opacity="0.6" />
        <path d="M102,38 L108,40 L104,42" fill="none" stroke="#FF6B6B" strokeWidth="1" strokeLinecap="round" />

        {/* 龟壳 */}
        <ellipse cx="52" cy="68" rx="26" ry="22" fill={`url(#${filterId}-shell)`} />
        {/* 壳纹 */}
        <ellipse cx="52" cy="68" rx="18" ry="14" fill="none" stroke="#7BA0C4" strokeWidth="1" opacity="0.4" />
        <ellipse cx="52" cy="68" rx="10" ry="8" fill="none" stroke="#7BA0C4" strokeWidth="0.8" opacity="0.3" />
        <path d="M52,54 L62,60 L62,72 L52,78 L42,72 L42,60Z" fill="none" stroke="#7BA0C4" strokeWidth="0.8" opacity="0.3" />

        {/* 龟头 */}
        <ellipse cx="52" cy="42" rx="10" ry="8" fill={`url(#${filterId}-head)`} />
        <circle cx="46" cy="40" r="2.5" fill="#0A0A0A" />
        <circle cx="58" cy="40" r="2.5" fill="#0A0A0A" />
        <circle cx="47" cy="39" r="1" fill="white" opacity="0.6" />
        <circle cx="59" cy="39" r="1" fill="white" opacity="0.6" />
        <path d="M48,46 Q52,49 56,46" fill="none" stroke="#1A2A4A" strokeWidth="1" strokeLinecap="round" />

        {/* 四足 */}
        <ellipse cx="30" cy="84" rx="6" ry="4" fill="#3A5A7A" />
        <ellipse cx="46" cy="86" rx="6" ry="4" fill="#3A5A7A" />
        <ellipse cx="58" cy="86" rx="6" ry="4" fill="#3A5A7A" />
        <ellipse cx="74" cy="84" rx="6" ry="4" fill="#3A5A7A" />

        {/* 尾巴 */}
        <path d="M26,68 C18,66 14,72 18,76" fill="none" stroke="#3A5A7A" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#00050A" stroke="#7BA0C4" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#7BA0C4" fontWeight="bold" letterSpacing="2">玄 武</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#4A6A8A" letterSpacing="1">XUANWU · 镇岳之龟</text>
      <circle cx="36" cy="97" r="1" fill="#7BA0C4" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#7BA0C4" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#7BA0C4" strokeWidth="0.5"
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
