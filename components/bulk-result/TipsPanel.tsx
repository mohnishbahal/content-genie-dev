import { useState } from 'react'
import { BarChart, ChevronRight, Lightbulb, TrendingUp, FileText, Target, Sparkles, Zap, CheckCircle2, RefreshCw, X, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidePanel } from '@/components/ui/side-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TipsPanelProps {
  isOpen: boolean
  onClose: () => void
  products: Array<{
    brand: string
    category: string
    title: string
    description: string
    images: {
      primary: string
      gallery: string[]
    }
    metrics: {
      writingQuality: number
      userValue: number
      contentAuthenticity: number
      technicalExcellence: number
    }
    productFeatures: string[]
    seoKeywords: string[]
    highlights: string[]
    stylingTips: string[]
    attributes: Record<string, string>
  }>
}

type Tip = {
  id: string
  type: 'single' | 'multi'
  language: 'en' | 'ar' | 'both'
  category: 'title' | 'description' | 'features' | 'styling' | 'full'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  icon: React.ReactNode
  color: 'blue' | 'purple' | 'emerald' | 'rose' | 'orange' | 'indigo'
  products: Array<{ title: string; id?: string }>
  estimatedTime: number
}

export function TipsPanel({
  isOpen,
  onClose,
  products
}: TipsPanelProps) {
  const [dismissedTips, setDismissedTips] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // Mock tips data - in real app, this would come from props or API
  const allTips: Tip[] = [
    {
      id: '1',
      type: 'single',
      language: 'en',
      category: 'title',
      priority: 'high',
      title: 'Make Your Title Pop! 🚀',
      description: 'Your title could work harder for you! Let\'s add key features and style elements to make it more engaging and SEO-friendly. This helps shoppers find your product faster.',
      icon: <Target className="w-4 h-4" />,
      color: 'blue',
      products: [{ title: "Women's V-Neck Long Sleeve Dress" }],
      estimatedTime: 1
    },
    {
      id: '2',
      type: 'multi',
      language: 'en',
      category: 'description',
      priority: 'critical',
      title: 'Enhance Product Stories 📝',
      description: 'Let\'s make your product descriptions more compelling! We\'ll highlight unique features, materials, and benefits to help customers make confident buying decisions.',
      icon: <FileText className="w-4 h-4" />,
      color: 'purple',
      products: [
        { title: "Classic Fitted Sheath Dress" },
        { title: "Casual Summer Maxi" },
        { title: "Evening Cocktail Dress" }
      ],
      estimatedTime: 3
    },
    {
      id: '3',
      type: 'multi',
      language: 'en',
      category: 'features',
      priority: 'high',
      title: 'Highlight Key Features ✨',
      description: 'Stand out from the crowd! We\'ll enhance your product features with detailed specifications, unique selling points, and customer benefits.',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'emerald',
      products: [
        { title: "Evening Gown" },
        { title: "Casual Knit Sweater" },
        { title: "Maxi Dress" },
        { title: "Summer Dress" }
      ],
      estimatedTime: 5
    },
    {
      id: '4',
      type: 'single',
      language: 'ar',
      category: 'description',
      priority: 'high',
      title: 'Arabic Description Enhancement 🌟',
      description: 'Let\'s perfect your Arabic product story with culturally relevant details and regional style references. This helps connect better with your Arabic-speaking customers.',
      icon: <FileText className="w-4 h-4" />,
      color: 'rose',
      products: [{ title: "Elegant Pleated Chiffon Evening Gown" }],
      estimatedTime: 2
    },
    {
      id: '5',
      type: 'multi',
      language: 'ar',
      category: 'styling',
      priority: 'medium',
      title: 'Regional Style Guide 👗',
      description: 'Elevate your styling tips with local fashion trends and cultural preferences. We\'ll add regional context to help customers envision how to wear your pieces.',
      icon: <Zap className="w-4 h-4" />,
      color: 'orange',
      products: [
        { title: "فستان سهرة أنيق" },
        { title: "فستان كاجوال" },
        { title: "فستان صيفي" }
      ],
      estimatedTime: 3
    },
    {
      id: '6',
      type: 'multi',
      language: 'both',
      category: 'full',
      priority: 'critical',
      title: 'Complete Content Refresh 🔄',
      description: 'Time for a full makeover! We\'ll revamp all content in both languages to ensure consistency, quality, and cultural relevance across your product listings.',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'indigo',
      products: [
        { title: "Classic Fitted Sheath Dress / فستان كلاسيكي" },
        { title: "Casual Knit Sweater / سترة محبوكة" }
      ],
      estimatedTime: 8
    },
    {
      id: '7',
      type: 'multi',
      language: 'en',
      category: 'styling',
      priority: 'medium',
      title: 'Style Inspiration Update 💫',
      description: 'Let\'s inspire your customers! We\'ll add fresh styling ideas, occasion suggestions, and mix-and-match recommendations to boost engagement.',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'blue',
      products: [
        { title: "Boho Maxi Dress" },
        { title: "Floral Summer Dress" },
        { title: "Casual Day Dress" }
      ],
      estimatedTime: 4
    },
    {
      id: '8',
      type: 'single',
      language: 'both',
      category: 'features',
      priority: 'high',
      title: 'Seasonal Update 🌞',
      description: 'Perfect timing for a seasonal refresh! We\'ll update your content to highlight seasonal features, materials, and styling tips for current weather.',
      icon: <Zap className="w-4 h-4" />,
      color: 'emerald',
      products: [{ title: "Summer Collection Maxi Dress / فستان صيفي طويل" }],
      estimatedTime: 2
    },
    {
      id: '9',
      type: 'multi',
      language: 'both',
      category: 'description',
      priority: 'medium',
      title: 'Size & Fit Guide 📏',
      description: 'Help customers find their perfect fit! We\'ll enhance size information, fit descriptions, and measurement guides in both languages.',
      icon: <Target className="w-4 h-4" />,
      color: 'rose',
      products: [
        { title: "Fitted Evening Gown / فستان سهرة" },
        { title: "Wrap Dress / فستان لف" }
      ],
      estimatedTime: 3
    }
  ]

  const filteredTips = allTips.filter(tip => !dismissedTips.includes(tip.id))

  const handleDismiss = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId])
  }

  const handleAction = async (tipId: string) => {
    setIsLoading(prev => ({ ...prev, [tipId]: true }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(prev => ({ ...prev, [tipId]: false }))
    handleDismiss(tipId)
  }

  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-amber-100 text-amber-700'
      case 'medium':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Tips & Recommendations"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">AI-powered suggestions to improve your content quality and performance.</p>
          
          {/* Progress */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tips Progress</span>
              <span className="text-sm text-gray-500">{dismissedTips.length}/{allTips.length} Completed</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(dismissedTips.length / allTips.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'bg-gradient-to-r border rounded-lg overflow-hidden',
                  tip.color === 'blue' && 'from-blue-50/80 to-blue-50 border-blue-100/50',
                  tip.color === 'purple' && 'from-purple-50/80 to-purple-50 border-purple-100/50',
                  tip.color === 'emerald' && 'from-emerald-50/80 to-emerald-50 border-emerald-100/50',
                  tip.color === 'rose' && 'from-rose-50/80 to-rose-50 border-rose-100/50',
                  tip.color === 'orange' && 'from-orange-50/80 to-orange-50 border-orange-100/50',
                  tip.color === 'indigo' && 'from-indigo-50/80 to-indigo-50 border-indigo-100/50'
                )}
              >
                <div className={cn(
                  'px-4 py-3 border-b bg-opacity-50',
                  tip.color === 'blue' && 'border-blue-100/50 bg-blue-50/50',
                  tip.color === 'purple' && 'border-purple-100/50 bg-purple-50/50',
                  tip.color === 'emerald' && 'border-emerald-100/50 bg-emerald-50/50',
                  tip.color === 'rose' && 'border-rose-100/50 bg-rose-50/50',
                  tip.color === 'orange' && 'border-orange-100/50 bg-orange-50/50',
                  tip.color === 'indigo' && 'border-indigo-100/50 bg-indigo-50/50'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'p-1.5 rounded-md',
                        tip.color === 'blue' && 'bg-blue-100',
                        tip.color === 'purple' && 'bg-purple-100',
                        tip.color === 'emerald' && 'bg-emerald-100',
                        tip.color === 'rose' && 'bg-rose-100',
                        tip.color === 'orange' && 'bg-orange-100',
                        tip.color === 'indigo' && 'bg-indigo-100'
                      )}>
                        {tip.icon}
                      </div>
                      <span className={cn(
                        'text-sm font-medium',
                        tip.color === 'blue' && 'text-blue-900',
                        tip.color === 'purple' && 'text-purple-900',
                        tip.color === 'emerald' && 'text-emerald-900',
                        tip.color === 'rose' && 'text-rose-900',
                        tip.color === 'orange' && 'text-orange-900',
                        tip.color === 'indigo' && 'text-indigo-900'
                      )}>{tip.title}</span>
                      {tip.type === 'multi' && (
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1.5',
                          tip.color === 'blue' && 'bg-blue-100 text-blue-700',
                          tip.color === 'purple' && 'bg-purple-100 text-purple-700',
                          tip.color === 'emerald' && 'bg-emerald-100 text-emerald-700',
                          tip.color === 'rose' && 'bg-rose-100 text-rose-700',
                          tip.color === 'orange' && 'bg-orange-100 text-orange-700',
                          tip.color === 'indigo' && 'bg-indigo-100 text-indigo-700'
                        )}>
                          <Layers className="w-3 h-3" />
                          {tip.products.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        getPriorityBadgeStyles(tip.priority)
                      )}>{tip.priority}</span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                        ~{tip.estimatedTime}m
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-6 w-6 text-gray-400 hover:text-gray-600',
                          tip.color === 'blue' && 'hover:bg-blue-100',
                          tip.color === 'purple' && 'hover:bg-purple-100',
                          tip.color === 'emerald' && 'hover:bg-emerald-100',
                          tip.color === 'rose' && 'hover:bg-rose-100',
                          tip.color === 'orange' && 'hover:bg-orange-100',
                          tip.color === 'indigo' && 'hover:bg-indigo-100'
                        )}
                        onClick={() => handleDismiss(tip.id)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className={cn(
                        'text-sm',
                        tip.color === 'blue' && 'text-blue-800',
                        tip.color === 'purple' && 'text-purple-800',
                        tip.color === 'emerald' && 'text-emerald-800',
                        tip.color === 'rose' && 'text-rose-800',
                        tip.color === 'orange' && 'text-orange-800',
                        tip.color === 'indigo' && 'text-indigo-800'
                      )}>{tip.description}</p>
                      {tip.products.length > 0 && (
                        <div className={cn(
                          'mt-2 p-2 rounded-md',
                          tip.color === 'blue' && 'bg-blue-100/50',
                          tip.color === 'purple' && 'bg-purple-100/50',
                          tip.color === 'emerald' && 'bg-emerald-100/50',
                          tip.color === 'rose' && 'bg-rose-100/50',
                          tip.color === 'orange' && 'bg-orange-100/50',
                          tip.color === 'indigo' && 'bg-indigo-100/50'
                        )}>
                          <p className={cn(
                            'text-xs font-medium',
                            tip.color === 'blue' && 'text-blue-800',
                            tip.color === 'purple' && 'text-purple-800',
                            tip.color === 'emerald' && 'text-emerald-800',
                            tip.color === 'rose' && 'text-rose-800',
                            tip.color === 'orange' && 'text-orange-800',
                            tip.color === 'indigo' && 'text-indigo-800'
                          )}>Affected Products:</p>
                          <div className={cn(
                            'mt-1 text-xs',
                            tip.color === 'blue' && 'text-blue-700',
                            tip.color === 'purple' && 'text-purple-700',
                            tip.color === 'emerald' && 'text-emerald-700',
                            tip.color === 'rose' && 'text-rose-700',
                            tip.color === 'orange' && 'text-orange-700',
                            tip.color === 'indigo' && 'text-indigo-700'
                          )}>
                            {tip.products.map((product, i) => (
                              <div key={i}>• {product.title}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'w-full justify-center h-8 border',
                        isLoading[tip.id] && 'opacity-50 cursor-not-allowed',
                        tip.color === 'blue' && 'text-blue-700 hover:text-blue-800 hover:bg-blue-100 border-blue-200/50',
                        tip.color === 'purple' && 'text-purple-700 hover:text-purple-800 hover:bg-purple-100 border-purple-200/50',
                        tip.color === 'emerald' && 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 border-emerald-200/50',
                        tip.color === 'rose' && 'text-rose-700 hover:text-rose-800 hover:bg-rose-100 border-rose-200/50',
                        tip.color === 'orange' && 'text-orange-700 hover:text-orange-800 hover:bg-orange-100 border-orange-200/50',
                        tip.color === 'indigo' && 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100 border-indigo-200/50'
                      )}
                      onClick={() => handleAction(tip.id)}
                      disabled={isLoading[tip.id]}
                    >
                      <RefreshCw className={cn(
                        'w-3.5 h-3.5 mr-2',
                        isLoading[tip.id] && 'animate-spin'
                      )} />
                      {tip.category === 'title' ? 'Regenerate Title' :
                       tip.category === 'description' ? 'Regenerate Description' :
                       tip.category === 'features' ? 'Enhance Features' :
                       tip.category === 'styling' ? 'Update Styling Tips' :
                       'Regenerate Content'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-sm text-gray-500">
              {dismissedTips.length > 0 
                ? "You've addressed all the current recommendations. Great job!"
                : "No recommendations match your current filters."}
            </p>
          </div>
        )}
      </div>
    </SidePanel>
  )
} 