import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function SidePanel({
  isOpen,
  onClose,
  title,
  children,
  className
}: SidePanelProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        onTransitionEnd={() => {
          if (!isOpen) {
            setIsAnimating(false)
          }
        }}
      >
        {/* Header */}
        <div className="h-14 px-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 