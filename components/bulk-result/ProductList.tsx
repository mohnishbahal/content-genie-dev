'use client'

import { useState, useMemo } from 'react'
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ReviewState, GeneratedContent } from "@/types/bulk-result"
import { calculateOverallScore } from "@/lib/metrics"
import { CheckCircle2, SkipForward, ChevronRight, Clock, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreBadge } from './ScoreBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductListProps {
  products: GeneratedContent[]
  viewMode: 'list' | 'grid'
  activeIndex: number
  reviewStates: Record<number, ReviewState>
  onProductSelect: (index: number) => void
  onReview: (index: number) => void
  onSkip: (index: number) => void
  onUndo: (index: number) => void
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchQuery: string
  onSearchChange: (value: string) => void
}

export const ProductList = ({
  products,
  viewMode,
  activeIndex,
  reviewStates,
  onProductSelect,
  onReview,
  onSkip,
  onUndo,
  sortBy,
  sortDirection,
  searchQuery,
  onSearchChange
}: ProductListProps) => {
  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'score':
          comparison = calculateOverallScore(b.metrics) - calculateOverallScore(a.metrics)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'brand':
          comparison = a.brand.localeCompare(b.brand)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'status':
          const getStatusPriority = (index: number) => {
            if (reviewStates[index]?.status === 'reviewed') return 1
            if (reviewStates[index]?.status === 'skipped') return 2
            return 3
          }
          comparison = getStatusPriority(products.indexOf(a)) - getStatusPriority(products.indexOf(b))
          break
      }
      return sortDirection === 'asc' ? comparison * -1 : comparison
    })
    return sorted
  }, [products, sortBy, sortDirection, reviewStates])

  return (
    <div className="h-full space-y-4">
      {/* Product List */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' 
          ? "grid-cols-2"
          : "grid-cols-1"
      )}>
        {sortedProducts.map((product, index) => (
          <div
            key={index}
            onClick={() => onProductSelect(index)}
            className={cn(
              "group relative",
              "bg-white rounded-lg border border-gray-200",
              "transition-all duration-200",
              "hover:border-blue-200 hover:shadow-md",
              "cursor-pointer",
              activeIndex === index && "ring-2 ring-blue-500"
            )}
          >
            {viewMode === 'grid' ? (
              // Grid View Layout
              <div className="space-y-3">
                {/* Image Container with Status Badge */}
                <div className="relative w-full" style={{ height: '180px' }}>
                  <Image
                    src={product.images.primary}
                    alt={product.title}
                    className="object-cover w-full h-full rounded-t-lg"
                    fill
                  />
                  {reviewStates[index]?.status && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      {reviewStates[index]?.status === 'reviewed' ? (
                        <div className="bg-green-50 text-green-700 rounded-full p-2">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="bg-gray-50 text-gray-500 rounded-full p-2">
                          <SkipForward className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="px-4 pb-4">
                  <div className="mb-1.5">
                    <ScoreBadge score={calculateOverallScore(product.metrics)} size="sm" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                </div>
              </div>
            ) : (
              // List View Layout
              <div className="flex items-center gap-4 p-4">
                {/* Image Container with Status Badge */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={product.images.primary}
                    alt={product.title}
                    className="object-cover rounded-lg"
                    fill
                  />
                  {reviewStates[index]?.status && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      {reviewStates[index]?.status === 'reviewed' ? (
                        <div className="bg-green-50 text-green-700 rounded-full p-1">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="bg-gray-50 text-gray-500 rounded-full p-1">
                          <SkipForward className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5">
                    <ScoreBadge score={calculateOverallScore(product.metrics)} size="sm" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 