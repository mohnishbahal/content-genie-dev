'use client'

import { Layers, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { GenerationMode } from '@/types/generate'
import { cn } from '@/lib/utils'

interface GenerationModeSelectorProps {
  mode: GenerationMode
  onModeChange: (mode: GenerationMode) => void
}

export function GenerationModeSelector({ mode, onModeChange }: GenerationModeSelectorProps) {
  return (
    <div className="mb-8">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Choose Generation Mode
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange('single')}
          className={cn(
            "h-32 relative overflow-hidden transition-all duration-200",
            mode === 'single' 
              ? "border-2 border-orange-500 bg-orange-50 text-orange-700" 
              : "border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50"
          )}
        >
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={cn(
              "p-2 rounded-full transition-colors",
              mode === 'single' ? "bg-orange-100" : "bg-gray-100"
            )}>
              <Zap className={cn(
                "h-6 w-6",
                mode === 'single' ? "text-orange-500" : "text-gray-500"
              )} />
            </div>
            <span className="font-medium">Single Product</span>
            <span className="text-xs text-gray-600">
              Generate content for one product
            </span>
          </div>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange('bulk')}
          className={cn(
            "h-32 relative overflow-hidden transition-all duration-200",
            mode === 'bulk' 
              ? "border-2 border-orange-500 bg-orange-50 text-orange-700" 
              : "border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50"
          )}
        >
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={cn(
              "p-2 rounded-full transition-colors",
              mode === 'bulk' ? "bg-orange-100" : "bg-gray-100"
            )}>
              <Layers className={cn(
                "h-6 w-6",
                mode === 'bulk' ? "text-orange-500" : "text-gray-500"
              )} />
            </div>
            <span className="font-medium">Bulk Generation</span>
            <span className="text-xs text-gray-600">
              Generate for multiple products (up to 10)
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
} 