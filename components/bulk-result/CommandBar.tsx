'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LayoutGrid,
  List,
  PanelLeft,
  Search,
  Download,
  HelpCircle,
  CheckCircle2,
  SkipForward,
  Clock,
  PlusCircle,
  X,
  LayoutList
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

interface CommandBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const CommandBar = ({
  searchQuery,
  onSearchChange
}: CommandBarProps) => {
  return (
    <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center">
      <div className="max-w-md w-full relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>
    </div>
  )
} 