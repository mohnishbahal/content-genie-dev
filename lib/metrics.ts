import { ContentMetrics } from '@/types/bulk-result'

export const calculateOverallScore = (metrics: ContentMetrics | undefined): number => {
  if (!metrics) return 0
  
  try {
    const scores = [
      metrics.aiConfidence,
      metrics.readabilityScore,
      metrics.seoScore,
      metrics.toneMatch,
      metrics.uniqueness
    ]
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  } catch (error) {
    console.error('Error calculating score:', error)
    return 0
  }
}

export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-orange-600'
  return 'text-red-600'
}

export const getScoreBackground = (score: number): string => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-orange-500'
  return 'bg-red-500'
} 