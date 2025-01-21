'use client'

import { Button } from '@/components/ui/button'
import { Copy, Check, RefreshCw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  title: string;
  content: React.ReactNode;
  onCopy: () => void;
  onRegenerate: () => void;
  copied: boolean;
  loading?: boolean;
  error: string | null;
}

export function ContentSection({
  title,
  content,
  onCopy,
  onRegenerate,
  copied,
  loading,
  error
}: ContentSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className={cn(
              "text-gray-500 hover:text-gray-700",
              copied && "text-green-500 hover:text-green-700"
            )}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="rounded-lg border p-4">
        {content}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 