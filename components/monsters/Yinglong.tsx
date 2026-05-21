interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Yinglong({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `yinglong-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#1a1a3e" />
          <stop offset="60%" stopColor="#0d0d2b" />
          <stop offset="100%" stopColor="#050515" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A84B" />
          <stop offset="30%" stopColor="#F5D77B" />
          <stop offset="50%" stopColor="#C49B3C" />
          <stop offset="70%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#D4A84B" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#4A9E7A" />
          <stop offset="50%" stopColor="#2D7A5A" />
          <stop offset="100%" stopColor="#1A4A35" />
        </radialGradient>
        <radialGradient id={`${filterId}-belly`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C5E8D5" />
          <stop offset="100%" stopColor="#8BC4A8" />
        </radialGradient>
        <linearGradient id={`${filterId}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6BC4A0" />
          <stop offset="50%" stopColor="#3DA87C" />
          <stop offset="100%" stopColor="#1E6A4A" />
        </linearGradient>
        <linearGradient id={`${filterId}-horn`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D77B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <filter id={`${filterId}-shadow`}>
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <filter id={`${filterId}-glow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${filterId}-pop-shadow`}>
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* 画框外发光 */}
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#D4A84B" strokeWidth="1" opacity="0.3"
        filter={`url(#${filterId}-glow)`} />

      {/* 外框 - 主边框 */}
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      {/* 外框内阴影 */}
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#6B4E0A" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#F5D77B" strokeWidth="0.5" opacity="0.3" />

      {/* 画面背景 */}
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 云纹装饰 - 角落 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40 C28,36 30,42 26,46" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.25" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40 C92,36 90,42 94,46" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.25" />
      <path d="M11,92 C16,96 20,92 18,86 C22,90 26,86 24,80 C28,84 30,78 26,74" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.25" />
      <path d="M109,92 C104,96 100,92 102,86 C98,90 94,86 96,80 C92,84 90,78 94,74" fill="none" stroke="#D4A84B" strokeWidth="0.8" opacity="0.25" />

      {/* 应龙 - 身体主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 翅膀 - 展开在画框外 */}
        <path d="M25,48 C8,36 2,28 6,24 C10,20 16,26 14,32 C18,28 24,32 22,38 C26,34 30,40 28,44" fill={`url(#${filterId}-wing)`} opacity="0.8" stroke="#1E6A4A" strokeWidth="0.5" />
        <path d="M95,48 C112,36 118,28 114,24 C110,20 104,26 106,32 C102,28 96,32 98,38 C94,34 90,40 92,44" fill={`url(#${filterId}-wing)`} opacity="0.8" stroke="#1E6A4A" strokeWidth="0.5" />

        {/* 尾巴从画框延伸出去 */}
        <path d="M72,82 C82,90 90,96 94,100 C96,102 94,104 90,102 C86,100 80,96 74,90" fill="none" stroke={`url(#${filterId}-body)`} strokeWidth="4" strokeLinecap="round" />

        {/* 身体 */}
        <ellipse cx="60" cy="66" rx="20" ry="18" fill={`url(#${filterId}-body)`} />
        {/* 腹部亮部 */}
        <ellipse cx="60" cy="70" rx="12" ry="12" fill={`url(#${filterId}-belly)`} opacity="0.5" />

        {/* 脖子 */}
        <ellipse cx="60" cy="50" rx="14" ry="10" fill={`url(#${filterId}-body)`} />

        {/* 头部 */}
        <circle cx="60" cy="38" r="16" fill={`url(#${filterId}-body)`} />

        {/* 龙角 - 凸出画框 */}
        <path d="M50,24 C46,14 42,8 40,6 C44,10 46,16 48,22" fill={`url(#${filterId}-horn)`} stroke="#8B6914" strokeWidth="0.5" />
        <path d="M70,24 C74,14 78,8 80,6 C76,10 74,16 72,22" fill={`url(#${filterId}-horn)`} stroke="#8B6914" strokeWidth="0.5" />
        {/* 角的分枝 */}
        <path d="M44,14 C40,10 38,12 40,14" fill="none" stroke="#D4A84B" strokeWidth="1" />
        <path d="M76,14 C80,10 82,12 80,14" fill="none" stroke="#D4A84B" strokeWidth="1" />

        {/* 眼睛 - 写实龙眼 */}
        <ellipse cx="50" cy="36" rx="5" ry="4" fill="#0A0A0A" />
        <ellipse cx="50" cy="36" rx="3.5" ry="3" fill="#8B4513" />
        <circle cx="51" cy="35" r="1.2" fill="white" opacity="0.8" />
        <ellipse cx="70" cy="36" rx="5" ry="4" fill="#0A0A0A" />
        <ellipse cx="70" cy="36" rx="3.5" ry="3" fill="#8B4513" />
        <circle cx="71" cy="35" r="1.2" fill="white" opacity="0.8" />
        {/* 眉骨 */}
        <path d="M44,32 Q50,28 56,32" fill="none" stroke="#1A4A35" strokeWidth="1.5" />
        <path d="M64,32 Q70,28 76,32" fill="none" stroke="#1A4A35" strokeWidth="1.5" />

        {/* 鼻子 */}
        <ellipse cx="60" cy="42" rx="2" ry="1.5" fill="#0D2B1A" />
        <path d="M58,42 Q60,40 62,42" fill="none" stroke="#0D2B1A" strokeWidth="0.8" />

        {/* 嘴巴 */}
        <path d="M54,46 Q60,50 66,46" fill="none" stroke="#0D2B1A" strokeWidth="1.5" strokeLinecap="round" />

        {/* 龙须 */}
        <path d="M50,44 C44,42 38,44 36,48" fill="none" stroke="#4A9E7A" strokeWidth="0.8" opacity="0.6" />
        <path d="M70,44 C76,42 82,44 84,48" fill="none" stroke="#4A9E7A" strokeWidth="0.8" opacity="0.6" />

        {/* 爪子 - 凸出画框 */}
        <path d="M28,66 C22,64 18,66 16,70 M16,70 L14,74 M16,70 L18,74 M16,70 L12,72" fill="none" stroke="#2D7A5A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M92,66 C98,64 102,66 104,70 M104,70 L106,74 M104,70 L102,74 M104,70 L108,72" fill="none" stroke="#2D7A5A" strokeWidth="1.5" strokeLinecap="round" />

        {/* 鳞片纹理 */}
        <path d="M50,56 Q55,54 60,56 Q65,54 70,56" fill="none" stroke="#4A9E7A" strokeWidth="0.5" opacity="0.4" />
        <path d="M48,62 Q54,60 60,62 Q66,60 72,62" fill="none" stroke="#4A9E7A" strokeWidth="0.5" opacity="0.4" />
        <path d="M50,68 Q56,66 62,68" fill="none" stroke="#4A9E7A" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* 底部名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#0A0A1A" stroke="#D4A84B" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#D4A84B" fontWeight="bold" letterSpacing="2">应 龙</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#8B6914" letterSpacing="1">YINGLONG · 飞天之龙</text>

      {/* 装饰小点 */}
      <circle cx="36" cy="97" r="1" fill="#F5D77B" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#F5D77B" opacity="0.5" />

      {/* 旋转光环 */}
      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#D4A84B" strokeWidth="0.5"
          strokeDasharray="3 6" opacity="0.4"
          style={{ animation: 'spinSlow 8s linear infinite', transformOrigin: 'center' }} />
      )}

      {/* 击败状态 */}
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
