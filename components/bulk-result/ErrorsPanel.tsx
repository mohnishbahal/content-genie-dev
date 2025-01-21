import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidePanel } from '@/components/ui/side-panel'
import { motion } from 'framer-motion'

interface ErrorsPanelProps {
  isOpen: boolean
  onClose: () => void
  failedItems: Array<{
    originalTitle: string
    error: string
    timestamp: string
    errorType?: 'API Error' | 'Validation Error' | 'Network Error' | 'Unknown Error'
  }>
  onRetryAll: () => void
  onRetryItem: (index: number) => void
}

export function ErrorsPanel({
  isOpen,
  onClose,
  failedItems,
  onRetryAll,
  onRetryItem
}: ErrorsPanelProps) {
  // Group errors by type
  const errorsByType = failedItems.reduce((acc, item) => {
    const type = item.errorType || 'Unknown Error'
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {} as Record<string, typeof failedItems>)

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Errors"
    >
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-red-50/50 rounded-lg p-4 mb-6 group hover:bg-red-50/80 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="text-base font-semibold text-gray-900">
              {failedItems.length} Failed Generation{failedItems.length === 1 ? '' : 's'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-100/80 h-8 px-3 flex items-center gap-1.5 transition-all hover:gap-2"
            onClick={onRetryAll}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry All
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Don't worry! We can retry these failed items. Click 'Retry All' to attempt all at once, or retry individual items below.
        </p>
      </motion.div>

      {/* Error Categories */}
      <div className="space-y-6">
        {Object.entries(errorsByType).map(([type, items], typeIndex) => (
          <motion.div 
            key={type} 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: typeIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold text-gray-900">
                {type} ({items.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: (typeIndex * items.length + index) * 0.05 }}
                  className="group bg-gray-50/80 hover:bg-gray-100/80 rounded-lg p-3.5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 min-w-0 flex-1 mr-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.originalTitle}
                        </h4>
                        <p className="text-sm text-red-600 mt-1">
                          {item.error}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>Failed at: {new Date(item.timestamp).toLocaleString()}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600 group-hover:text-gray-900">Click retry to try again</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:rotate-180 duration-300"
                      onClick={() => onRetryItem(index)}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Help Text */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          If errors persist after retrying, try checking your product details or contact support for assistance.
        </p>
      </div>
    </SidePanel>
  )
} 