import { TrendingUp, MinusCircle, TrendingDown } from 'lucide-react'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export const ScoreBadge = ({ score, size = 'md', showLabel = true }: ScoreBadgeProps) => {
  const getScoreConfig = (score: number) => {
    if (score >= 85) return {
      icon: TrendingUp,
      colors: 'text-green-600 bg-green-50 border-green-100',
      label: 'Excellent'
    }
    if (score >= 70) return {
      icon: MinusCircle,
      colors: 'text-yellow-600 bg-yellow-50 border-yellow-100',
      label: 'Good'
    }
    return {
      icon: TrendingDown,
      colors: 'text-red-600 bg-red-50 border-red-100',
      label: 'Needs Work'
    }
  }

  const config = getScoreConfig(score)
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs gap-1 px-1.5 py-0.5',
    md: 'text-sm gap-1.5 px-2 py-0.5',
    lg: 'text-sm gap-1.5 px-2.5 py-1'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  }

  return (
    <div 
      className={`
        inline-flex items-center
        rounded-full border
        ${config.colors}
        ${sizeClasses[size]}
      `}
      title={`${config.label} score: ${score}`}
    >
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{score}</span>
      {showLabel && (
        <>
          <span className="font-medium opacity-75">·</span>
          <span className="font-medium">{config.label}</span>
        </>
      )}
    </div>
  )
} 