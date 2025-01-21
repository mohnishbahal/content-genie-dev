import { BarChart, Info, Clock, CheckCircle2, Repeat, BookOpen, Languages, Zap, TrendingUp, Target, Sparkles, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'
import { SidePanel } from '@/components/ui/side-panel'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface StatsPanelProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    // Core Quality Metrics
    writingQuality: number
    userValue: number
    contentAuthenticity: number
    technicalExcellence: number

    // Content Structure
    wordCounts: {
      description: number
      features: number
      stylingTips: number
    }
    completenessScore: number
    missingFields: string[]

    // SEO & Engagement
    keywordDensity: number
    readabilityScore: number
    toneAnalysis: {
      professional: number
      casual: number
      persuasive: number
    }

    // Brand & Culture
    brandConsistency: {
      terminologyScore: number
      styleGuideScore: number
      preferredTermsUsed: number
      totalPreferredTerms: number
    }
    culturalAdaptation: {
      relevanceScore: number
      translationQuality: number
      regionalTerms: {
        used: string[]
        total: string[]
      }
    }

    // Efficiency
    generationStats: {
      averageTime: number // in minutes
      approvalRate: number
      iterationsCount: number
      reviewDuration: number // in hours
    }
  }
}

interface MetricCardProps {
  label: string
  value: number | string
  tooltip: string
  icon?: React.ReactNode
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  trend?: {
    direction: 'up' | 'down'
    value: number
  }
}

const MetricCard = ({ label, value, tooltip, icon, color = 'blue', trend }: MetricCardProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className={cn(
            'bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-4 border shadow-sm hover:shadow-md transition-all cursor-help',
            color === 'emerald' && 'border-emerald-100',
            color === 'blue' && 'border-blue-100',
            color === 'purple' && 'border-purple-100',
            color === 'amber' && 'border-amber-100',
            color === 'rose' && 'border-rose-100',
            'group relative overflow-hidden'
          )}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                {icon}
                {label}
              </div>
              {trend && (
                <span className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  trend.direction === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                )}>
                  {trend.direction === 'up' ? '+' : '-'}{trend.value}%
                </span>
              )}
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
          </div>
          <div 
            className={cn(
              'absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out opacity-50 group-hover:opacity-100',
              color === 'emerald' && 'bg-emerald-500',
              color === 'blue' && 'bg-blue-500',
              color === 'purple' && 'bg-purple-500',
              color === 'amber' && 'bg-amber-500',
              color === 'rose' && 'bg-rose-500'
            )}
            style={{ width: typeof value === 'number' ? `${value}%` : '100%' }}
          />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const SectionHeader = ({ title, description, calculation }: { title: string; description?: string; calculation?: string }) => (
  <div className="mb-4">
    <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
      {title}
    </h3>
    {description && (
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    )}
    {calculation && (
      <div className="mt-2 flex items-start gap-2 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
        <Calculator className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <p className="text-gray-600">{calculation}</p>
      </div>
    )}
  </div>
)

export function StatsPanel({
  isOpen,
  onClose,
  stats
}: StatsPanelProps) {
  const overallScore = Math.round(
    (stats.writingQuality + stats.userValue + stats.contentAuthenticity + stats.technicalExcellence) / 4
  )

  const getScoreQuality = (score: number) => {
    if (score >= 90) return 'Exceptional'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Content Analytics"
    >
      {/* Overview Section - Now with more emphasis */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-white rounded-xl p-6 mb-8 border border-blue-100/50 shadow-sm"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Overall Quality Score</h3>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl font-bold text-blue-900">{overallScore}</span>
              <div className="flex flex-col">
                <span className="text-sm text-blue-900/60">out of 100</span>
                <span className={cn(
                  'mt-1 px-2.5 py-0.5 text-sm font-medium rounded-full self-start',
                  overallScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  overallScore >= 70 ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                )}>
                  {getScoreQuality(overallScore)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-blue-900/70 max-w-md">
              Your content demonstrates {getScoreQuality(overallScore).toLowerCase()} quality based on our comprehensive analysis of writing, value, authenticity, and technical accuracy.
            </p>
          </div>
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-[6px] border-blue-100/50" />
            <div 
              className="absolute inset-0 rounded-full border-[6px] border-blue-500 transition-all duration-1000 ease-out"
              style={{ 
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                transform: `rotate(${(overallScore / 100) * 360}deg)`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-2.5 shadow-sm">
                <TrendingUp className="w-7 h-7 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Quality Analysis */}
      <div className="space-y-6 mb-8">
        <SectionHeader 
          title="Content Quality Analysis"
          description="Detailed breakdown of your content's quality attributes"
          calculation="Each metric is scored from 0-100 based on AI analysis of specific criteria, focusing on clarity, accuracy, and originality."
        />
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Writing Quality"
            value={stats.writingQuality}
            color="emerald"
            tooltip="Evaluates grammar, clarity, and overall writing style. Score reflects natural language flow and professional tone."
            icon={<BookOpen className="w-4 h-4" />}
            trend={{ direction: 'up', value: 5 }}
          />
          <MetricCard
            label="Content Authenticity"
            value={stats.contentAuthenticity}
            color="purple"
            tooltip="Assesses content uniqueness and originality. High scores indicate distinctive, plagiarism-free content."
            icon={<Sparkles className="w-4 h-4" />}
          />
          <MetricCard
            label="Technical Excellence"
            value={stats.technicalExcellence}
            color="amber"
            tooltip="Evaluates technical accuracy and attention to detail in product specifications and features."
            icon={<Info className="w-4 h-4" />}
          />
          <MetricCard
            label="Readability Score"
            value={stats.readabilityScore}
            tooltip={`Flesch-Kincaid score: ${stats.readabilityScore}. ${
              stats.readabilityScore >= 60
                ? 'Content is easy to understand for your target audience.'
                : 'Consider simplifying the language.'
            }`}
            color="blue"
          />
        </div>
      </div>

      {/* Content Distribution */}
      <div className="space-y-6 mb-8 pt-6 border-t border-gray-100">
        <SectionHeader 
          title="Average Word Count Distribution"
          description="Analysis of content length across different sections"
          calculation="Word counts are averaged across all products to show typical content distribution patterns."
        />
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
          <div className="space-y-4">
            {Object.entries(stats.wordCounts).map(([section, count]) => (
              <div key={section} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{section}</span>
                    <span className="text-sm font-medium text-gray-900">{count} words</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500/50 rounded-full transition-all duration-500"
                      style={{ width: `${(count / Math.max(...Object.values(stats.wordCounts))) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {section === 'description' ? 'Recommended: 100-150 words' :
                     section === 'features' ? 'Recommended: 60-100 words' :
                     'Recommended: 50-80 words'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand & Market Fit */}
      <div className="space-y-6 mb-8 pt-6 border-t border-gray-100">
        <SectionHeader 
          title="Brand & Market Fit"
          description="Analysis of brand alignment and market optimization"
          calculation="Combines brand consistency metrics with SEO and cultural adaptation scores."
        />
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Brand Consistency"
            value={stats.brandConsistency.terminologyScore}
            tooltip={`Using ${stats.brandConsistency.preferredTermsUsed} out of ${stats.brandConsistency.totalPreferredTerms} preferred brand terms. ${
              stats.brandConsistency.terminologyScore >= 85
                ? '✓ Strong brand alignment!'
                : 'Room for improving brand voice.'
            }`}
            color="amber"
          />
          <MetricCard
            label="Cultural Relevance"
            value={stats.culturalAdaptation.relevanceScore}
            tooltip={`Using ${stats.culturalAdaptation.regionalTerms.used.length}/${stats.culturalAdaptation.regionalTerms.total.length} regional terms. Content is well-adapted for your target market.`}
            color="rose"
            icon={<Languages className="w-4 h-4" />}
          />
          <MetricCard
            label="Keyword Optimization"
            value={stats.keywordDensity}
            tooltip={`Current density is ${stats.keywordDensity}% (Optimal: 1.5-2.5%). ${
              stats.keywordDensity >= 1.5 && stats.keywordDensity <= 2.5
                ? '✓ Perfect range!'
                : 'Consider adjusting for better SEO'
            }`}
            color="blue"
          />
        </div>

        {/* Tone Analysis */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100/50">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" />
            Content Tone Profile
          </h4>
          <div className="space-y-3">
            {Object.entries(stats.toneAnalysis).map(([tone, score]) => (
              <div key={tone} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 capitalize">{tone}</span>
                    <span className="text-sm font-medium text-gray-900">{score}%</span>
                  </div>
                  <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500/50 rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Efficiency */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <SectionHeader 
          title="Generation Performance"
          description="Efficiency metrics for content generation workflow"
          calculation="Time-based metrics showing the efficiency of content creation and review process."
        />
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="First-Time Approval"
            value={`${stats.generationStats.approvalRate}%`}
            tooltip={`${stats.generationStats.approvalRate}% of content is approved without revisions. ${
              stats.generationStats.approvalRate >= 80
                ? '✓ Excellent first-time quality!'
                : 'Consider adjusting generation parameters.'
            }`}
            color="emerald"
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
          <MetricCard
            label="Generation Time"
            value={`${stats.generationStats.averageTime}m`}
            tooltip={`Average content generation time is ${stats.generationStats.averageTime} minutes per product.`}
            color="blue"
            icon={<Clock className="w-4 h-4" />}
          />
          <MetricCard
            label="Review Duration"
            value={`${stats.generationStats.reviewDuration}h`}
            tooltip={`Average time from generation to final approval is ${stats.generationStats.reviewDuration} hours.`}
            color="purple"
            icon={<Clock className="w-4 h-4" />}
          />
          <MetricCard
            label="Revision Cycles"
            value={stats.generationStats.iterationsCount.toFixed(1)}
            tooltip={`Average number of revisions needed before approval. Lower is better.`}
            color="amber"
            icon={<Repeat className="w-4 h-4" />}
          />
        </div>
      </div>
    </SidePanel>
  )
} 