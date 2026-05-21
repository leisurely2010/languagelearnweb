interface Props {
  size?: number
  animated?: boolean
  defeated?: boolean
  className?: string
}

export default function Qilin({
  size = 120,
  animated = true,
  defeated = false,
  className = '',
}: Props) {
  const filterId = `qilin-${Math.random().toString(36).slice(2, 8)}`

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
          <stop offset="0%" stopColor="#0a2a1a" />
          <stop offset="60%" stopColor="#051a0e" />
          <stop offset="100%" stopColor="#000a05" />
        </radialGradient>
        <linearGradient id={`${filterId}-frame`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ABC7A" />
          <stop offset="30%" stopColor="#6BDE9A" />
          <stop offset="50%" stopColor="#3A9A5A" />
          <stop offset="70%" stopColor="#2A7A4A" />
          <stop offset="100%" stopColor="#4ABC7A" />
        </linearGradient>
        <radialGradient id={`${filterId}-body`} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#5ADE8A" />
          <stop offset="50%" stopColor="#3ABA6A" />
          <stop offset="100%" stopColor="#1A8A4A" />
        </radialGradient>
        <radialGradient id={`${filterId}-face`} cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#7BE8A0" />
          <stop offset="100%" stopColor="#4AC47A" />
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
      <rect x="4" y="4" width="112" height="112" rx="8" fill="none" stroke="#4ABC7A" strokeWidth="1" opacity="0.3" filter={`url(#${filterId}-glow)`} />
      <rect x="5" y="5" width="110" height="110" rx="6" fill={`url(#${filterId}-frame)`} />
      <rect x="7" y="7" width="106" height="106" rx="4" fill="none" stroke="#1A5A3A" strokeWidth="1.5" opacity="0.5" />
      <rect x="9" y="9" width="102" height="102" rx="3" fill="none" stroke="#A8F0C8" strokeWidth="0.5" opacity="0.3" />
      <rect x="11" y="11" width="98" height="98" rx="2" fill={`url(#${filterId}-bg)`} />

      {/* 云纹装饰 */}
      <path d="M11,28 C16,24 20,28 18,34 C22,30 26,34 24,40" fill="none" stroke="#6BDE9A" strokeWidth="0.8" opacity="0.2" />
      <path d="M109,28 C104,24 100,28 102,34 C98,30 94,34 96,40" fill="none" stroke="#6BDE9A" strokeWidth="0.8" opacity="0.2" />

      {/* 麒麟主体 */}
      <g filter={`url(#${filterId}-pop-shadow)`}>
        {/* 角凸出画框 */}
        <path d="M56,18 C52,6 48,0 46,2 C48,6 50,12 54,18" fill={`url(#${filterId}-horn)`} stroke="#8B6508" strokeWidth="0.5" />
        <path d="M64,18 C68,6 72,0 74,2 C72,6 70,12 66,18" fill={`url(#${filterId}-horn)`} stroke="#8B6508" strokeWidth="0.5" />
        <path d="M50,8 C46,4 44,6 46,8" fill="none" stroke="#F5D77B" strokeWidth="1" />
        <path d="M70,8 C74,4 76,6 74,8" fill="none" stroke="#F5D77B" strokeWidth="1" />

        {/* 身体 */}
        <ellipse cx="60" cy="64" rx="20" ry="16" fill={`url(#${filterId}-body)`} />
        {/* 脖子 */}
        <ellipse cx="60" cy="48" rx="12" ry="10" fill={`url(#${filterId}-body)`} />
        {/* 头部 */}
        <circle cx="60" cy="36" r="18" fill={`url(#${filterId}-face)`} />

        {/* 耳朵 */}
        <ellipse cx="38" cy="26" rx="5" ry="7" fill="#3ABA6A" transform="rotate(-15 38 26)" />
        <ellipse cx="82" cy="26" rx="5" ry="7" fill="#3ABA6A" transform="rotate(15 82 26)" />

        {/* 眼睛 */}
        <ellipse cx="48" cy="34" rx="5" ry="4.5" fill="#0A0A0A" />
        <circle cx="49" cy="32" r="1.5" fill="white" opacity="0.7" />
        <ellipse cx="72" cy="34" rx="5" ry="4.5" fill="#0A0A0A" />
        <circle cx="73" cy="32" r="1.5" fill="white" opacity="0.7" />
        {/* 眉骨 */}
        <path d="M42,30 Q48,26 54,30" fill="none" stroke="#1A6A3A" strokeWidth="1" />
        <path d="M66,30 Q72,26 78,30" fill="none" stroke="#1A6A3A" strokeWidth="1" />

        {/* 鼻子 */}
        <ellipse cx="60" cy="42" rx="2.5" ry="1.5" fill="#0A3A1A" />

        {/* 嘴巴 */}
        <path d="M56,46 Q60,50 64,46" fill="none" stroke="#0A3A1A" strokeWidth="1.2" strokeLinecap="round" />

        {/* 金色鬃毛 */}
        <path d="M40,50 C36,54 38,60 42,58" fill="none" stroke="#F5D77B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M80,50 C84,54 82,60 78,58" fill="none" stroke="#F5D77B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M42,54 C38,58 40,64 44,62" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78,54 C82,58 80,64 76,62" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />

        {/* 四蹄 */}
        <ellipse cx="36" cy="78" rx="7" ry="5" fill="#2A8A4A" />
        <ellipse cx="52" cy="80" rx="7" ry="5" fill="#2A8A4A" />
        <ellipse cx="68" cy="80" rx="7" ry="5" fill="#2A8A4A" />
        <ellipse cx="84" cy="78" rx="7" ry="5" fill="#2A8A4A" />

        {/* 尾巴 */}
        <path d="M60,76 C64,84 70,88 76,86" fill="none" stroke="#2A8A4A" strokeWidth="3" strokeLinecap="round" />
        <path d="M74,84 L78,88 L76,82" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />

        {/* 额头印记 */}
        <path d="M58,20 L60,16 L62,20" fill="none" stroke="#FCD34D" strokeWidth="1.2" />
        <circle cx="60" cy="18" r="1.2" fill="#FCD34D" opacity="0.6" />
      </g>

      {/* 名牌 */}
      <rect x="32" y="90" width="56" height="16" rx="3" fill="#000A05" stroke="#6BDE9A" strokeWidth="0.8" opacity="0.85" />
      <text x="60" y="97" textAnchor="middle" fontSize="6" fill="#6BDE9A" fontWeight="bold" letterSpacing="2">麒 麟</text>
      <text x="60" y="103" textAnchor="middle" fontSize="4" fill="#3A9A5A" letterSpacing="1">QILIN · 祥瑞之兽</text>
      <circle cx="36" cy="97" r="1" fill="#6BDE9A" opacity="0.5" />
      <circle cx="84" cy="97" r="1" fill="#6BDE9A" opacity="0.5" />

      {animated && !defeated && (
        <rect x="8" y="8" width="104" height="104" rx="4" fill="none" stroke="#6BDE9A" strokeWidth="0.5"
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
