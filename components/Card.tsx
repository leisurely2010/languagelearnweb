interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
