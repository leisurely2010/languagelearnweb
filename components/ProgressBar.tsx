interface ProgressBarProps {
  progress: number
  color?: string
  height?: string
}

export default function ProgressBar({ progress = 0, color = 'bg-primary-500', height = 'h-2' }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height }}>
      <div
        className={`${color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  )
}
