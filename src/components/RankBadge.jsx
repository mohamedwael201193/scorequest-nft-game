import { Badge } from '@/components/ui/badge.jsx'
import { Crown, Medal, Award, Star } from 'lucide-react'

const RankBadge = ({ rank, score, className = '' }) => {
  const getRankInfo = (position) => {
    switch (position) {
      case 1:
        return {
          icon: Crown,
          label: 'Champion',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          borderColor: 'border-yellow-400/30'
        }
      case 2:
        return {
          icon: Medal,
          label: 'Runner-up',
          color: 'text-gray-300',
          bgColor: 'bg-gray-300/10',
          borderColor: 'border-gray-300/30'
        }
      case 3:
        return {
          icon: Award,
          label: 'Third Place',
          color: 'text-orange-400',
          bgColor: 'bg-orange-400/10',
          borderColor: 'border-orange-400/30'
        }
      default:
        if (position <= 10) {
          return {
            icon: Star,
            label: 'Top 10',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/30'
          }
        }
        return null
    }
  }

  const getScoreBadge = (playerScore) => {
    if (playerScore >= 100) {
      return {
        icon: Crown,
        label: 'Legend',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        borderColor: 'border-purple-400/30'
      }
    } else if (playerScore >= 50) {
      return {
        icon: Award,
        label: 'Expert',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/30'
      }
    } else if (playerScore >= 20) {
      return {
        icon: Medal,
        label: 'Skilled',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/30'
      }
    } else if (playerScore >= 10) {
      return {
        icon: Star,
        label: 'Rising',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
        borderColor: 'border-cyan-400/30'
      }
    }
    return null
  }

  // Prioritize rank badge over score badge
  const badgeInfo = getRankInfo(rank) || getScoreBadge(score)

  if (!badgeInfo) return null

  const { icon: Icon, label, color, bgColor, borderColor } = badgeInfo

  return (
    <Badge
      variant="outline"
      className={`${color} ${bgColor} ${borderColor} flex items-center gap-1 text-xs ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  )
}

export default RankBadge

