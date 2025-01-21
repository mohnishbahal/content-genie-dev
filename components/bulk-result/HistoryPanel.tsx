import { Check, Clock, Filter, RotateCcw, SkipForward, RefreshCw, ChevronDown, Search, Pencil, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidePanel } from '@/components/ui/side-panel'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

type ActionType = HistoryAction['type'] | 'all'

interface HistoryAction {
  id: string
  type: 'review' | 'skip' | 'undo' | 'retry' | 'regenerate' | 'edit'
  productTitle: string
  timestamp: number
  details?: string
}

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  actions: HistoryAction[]
  onLoadMore?: () => void
  hasMore?: boolean
}

const ActionIcon = ({ type }: { type: HistoryAction['type'] }) => {
  switch (type) {
    case 'review':
      return <Check className="w-4 h-4 text-emerald-500" />
    case 'skip':
      return <SkipForward className="w-4 h-4 text-amber-500" />
    case 'undo':
      return <RotateCcw className="w-4 h-4 text-purple-500" />
    case 'retry':
      return <RefreshCw className="w-4 h-4 text-blue-500" />
    case 'regenerate':
      return <RefreshCw className="w-4 h-4 text-orange-500" />
    case 'edit':
      return <Pencil className="w-4 h-4 text-gray-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const ActionLabel = ({ type }: { type: HistoryAction['type'] }) => {
  switch (type) {
    case 'review':
      return 'Approved'
    case 'skip':
      return 'Skipped'
    case 'undo':
      return 'Undone'
    case 'retry':
      return 'Retried'
    case 'regenerate':
      return 'Regenerated'
    case 'edit':
      return 'Edited'
    default:
      return type
  }
}

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center h-full min-h-[400px] p-1"
  >
    <div className="w-full max-w-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl border border-blue-100/50 p-10 shadow-sm mb-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mb-4 mx-auto">
        <History className="w-10 h-10 text-blue-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Activity Timeline</h3>
      <p className="text-base text-gray-600 max-w-md mx-auto">
        Track your content journey here! We'll record all your actions as you review, edit, and perfect your product content.
      </p>
    </div>

    <div className="w-full max-w-lg bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h4 className="text-sm font-medium text-gray-900 mb-6">What you'll see here:</h4>
      <div className="grid gap-4">
        {[
          { 
            icon: <Check className="w-5 h-5 text-emerald-500" />, 
            label: 'Content approvals',
            description: "Track products you have reviewed and approved"
          },
          { 
            icon: <RefreshCw className="w-5 h-5 text-orange-500" />, 
            label: 'Content regeneration',
            description: "See when you have requested fresh content"
          },
          { 
            icon: <Pencil className="w-5 h-5 text-blue-500" />, 
            label: 'Manual edits',
            description: "Keep track of your content refinements"
          },
          { 
            icon: <SkipForward className="w-5 h-5 text-amber-500" />, 
            label: 'Skipped items',
            description: "Monitor products saved for later review"
          }
        ].map(({ icon, label, description }) => (
          <div 
            key={label}
            className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200"
          >
            <div className="p-2.5 bg-gray-50 rounded-full">
              {icon}
            </div>
            <div className="flex-1 text-left">
              <span className="text-base font-medium text-gray-900 block mb-1">{label}</span>
              <span className="text-sm text-gray-500">{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <p className="text-sm text-gray-400 mt-8">
      Start reviewing your products to see your activity history
    </p>
  </motion.div>
)

type FilterOption = {
  type: ActionType
  label: string
  icon: JSX.Element
}

export function HistoryPanel({
  isOpen,
  onClose,
  actions,
  onLoadMore,
  hasMore = false
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<Set<ActionType>>(() => new Set<ActionType>(['all']))
  const [displayCount, setDisplayCount] = useState(50)

  const filterOptions: FilterOption[] = [
    { type: 'all', label: 'All', icon: <Clock className="w-4 h-4 text-gray-500" /> },
    { type: 'review', label: 'Review', icon: <Check className="w-4 h-4 text-emerald-500" /> },
    { type: 'skip', label: 'Skip', icon: <SkipForward className="w-4 h-4 text-amber-500" /> },
    { type: 'undo', label: 'Undo', icon: <RotateCcw className="w-4 h-4 text-purple-500" /> },
    { type: 'retry', label: 'Retry', icon: <RefreshCw className="w-4 h-4 text-blue-500" /> },
    { type: 'regenerate', label: 'Regenerate', icon: <RefreshCw className="w-4 h-4 text-orange-500" /> },
    { type: 'edit', label: 'Edit', icon: <Pencil className="w-4 h-4 text-gray-500" /> },
  ]

  // Group actions by date
  const groupedActions = useMemo(() => {
    const filtered = actions
      .filter(action => 
        (selectedTypes.has('all') || selectedTypes.has(action.type)) &&
        (searchQuery === '' || 
          action.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          action.details?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .slice(0, displayCount)

    const groups: { [key: string]: HistoryAction[] } = {}
    
    filtered.forEach(action => {
      const date = new Date(action.timestamp)
      const key = date.toLocaleDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push(action)
    })

    return groups
  }, [actions, selectedTypes, searchQuery, displayCount])

  const handleTypeToggle = (type: ActionType) => {
    setSelectedTypes(prev => {
      const next = new Set<ActionType>(prev)
      
      if (type === 'all') {
        return new Set<ActionType>(['all'])
      } else {
        next.delete('all')
        if (next.has(type)) {
          next.delete(type)
          if (next.size === 0) {
            next.add('all')
          }
        } else {
          next.add(type)
        }
      }
      
      return next
    })
  }

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Activity History"
    >
      <div className="space-y-6">
        {actions.length > 0 ? (
          <>
            {/* Search and Filter */}
            <div className="space-y-4 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-100 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(({ type, label, icon }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTypeToggle(type)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border-gray-100 shadow-sm transition-all duration-200',
                      selectedTypes.has(type)
                        ? 'bg-white shadow-md border-gray-200'
                        : 'bg-white hover:shadow-md hover:border-gray-200'
                    )}
                  >
                    {icon}
                    <span className="text-sm text-gray-700">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Activity List */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {Object.entries(groupedActions).map(([date, dateActions]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    <div className="sticky top-[140px] bg-white z-10 py-2">
                      <h3 className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
                        {date}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {dateActions.map(action => (
                        <motion.div
                          key={action.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="mt-1">
                            <ActionIcon type={action.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {action.productTitle}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(action.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {action.details}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4"
              >
                <Button
                  variant="outline"
                  className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-full border-gray-100"
                  onClick={() => setDisplayCount(prev => prev + 50)}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </SidePanel>
  )
} 