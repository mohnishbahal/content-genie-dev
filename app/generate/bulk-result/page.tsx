'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BulkResultProvider, useBulkResult } from '@/contexts/BulkResultContext'
import { Header } from '@/components/header'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw, ArrowUpDown, LayoutList, LayoutGrid, ChevronRight, Download, FileDown, Settings, CheckCircle2, Package, History, Medal, Lightbulb, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import new V3-specific components (we'll create these next)
import { CommandBar } from '@/components/bulk-result/CommandBar'
import { ProductList } from '@/components/bulk-result/ProductList'
import { ProductDetail } from '@/components/bulk-result/ProductDetail'
import { ErrorsPanel } from '@/components/bulk-result/ErrorsPanel'
import { StatsPanel } from '@/components/bulk-result/StatsPanel'
import { TipsPanel } from '@/components/bulk-result/TipsPanel'
import { HistoryPanel } from '@/components/bulk-result/HistoryPanel'

import { GeneratedContent } from '@/types/bulk-result'

// We'll keep the test data for now, but in a separate file later
interface FailedItem {
  originalTitle: string
  error: string
  timestamp: string
  errorType?: 'API Error' | 'Validation Error' | 'Network Error' | 'Unknown Error'
}

interface RegeneratingStates {
  [key: string]: boolean
}

const TEST_DATA: {
  successful: GeneratedContent[]
  failed: FailedItem[]
} = {
  successful: Array(5).fill(null).map((_, i) => ({
    brand: [
      "Nordstrom",
      "H&M",
      "Zara",
      "Mango",
      "Uniqlo"
    ][i],
    category: [
      "Dresses",
      "Evening Wear",
      "Casual Wear",
      "Maxi Dresses",
      "Office Wear"
    ][i],
    title: [
      "Women's V-Neck Long Sleeve A-Line Midi Dress",
      "Elegant Pleated Chiffon Evening Gown with Lace Detail",
      "Casual Knit Sweater Dress with Pockets",
      "Floral Print Wrap Maxi Dress with Ruffle Hem",
      "Classic Fitted Sheath Dress with Belt"
    ][i],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    images: {
      primary: `/product-image${i === 0 ? '' : `-${(i % 5) + 1}`}.jpg`,
      gallery: [
        `/product-image.jpg`,
        `/product-image-2.jpg`,
        `/product-image-3.jpg`,
        `/product-image-4.jpg`,
        `/product-image-5.jpg`
      ]
    },
    metrics: {
      aiConfidence: 75 + Math.floor(Math.random() * 20),
      readabilityScore: 75 + Math.floor(Math.random() * 20),
      seoScore: 75 + Math.floor(Math.random() * 20),
      toneMatch: 75 + Math.floor(Math.random() * 20),
      uniqueness: 75 + Math.floor(Math.random() * 20)
    },
    productFeatures: [
      "Premium Quality Material",
      "Durable Construction",
      "Modern Design",
      "Versatile Usage"
    ],
    seoKeywords: [
      "premium product",
      "high quality",
      "modern design",
      "durable",
      "versatile"
    ],
    highlights: [
      "Made with premium materials for lasting durability",
      "Contemporary design that fits any setting",
      "Versatile functionality for multiple use cases",
      "Easy maintenance and care"
    ],
    stylingTips: [
      "Pair with heels and statement jewelry for a special occasion",
      "Layer with a cardigan or jacket for a more casual look",
      "Dress it up or down with different shoes and accessories"
    ],
    attributes: {
      "Material": "Premium Jersey",
      "Color": "Burgundy",
      "Style": "A-line",
      "Length": "Midi",
      "Neckline": "Round Neck",
      "Sleeve Length": "Long Sleeve",
      "Pattern": "Solid",
      "Occasion": "Casual, Semi-formal"
    }
  })) as GeneratedContent[],
  failed: [
    {
      originalTitle: "Men's Classic Fit Dress Shirt",
      error: "Failed to generate content: API rate limit exceeded",
      timestamp: new Date().toISOString(),
      errorType: "API Error"
    },
    {
      originalTitle: "Women's Running Shoes",
      error: "Validation error: Invalid product category",
      timestamp: new Date().toISOString(),
      errorType: "Validation Error"
    },
    {
      originalTitle: "Kids' Baseball Cap",
      error: "Network error: Connection timeout",
      timestamp: new Date().toISOString(),
      errorType: "Network Error"
    }
  ]
}

// Add error display component
const ErrorSection = ({ errors }: { errors: any[] }) => {
  if (errors.length === 0) return null;

  return (
    <div className="border-t border-gray-200 mt-6 pt-6">
      <div className="mb-4">
        <h3 className="text-base font-medium text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Failed Items ({errors.length})
        </h3>
      </div>
      <div className="space-y-3">
        {errors.map((error, index) => (
          <div 
            key={index}
            className="bg-red-50 border border-red-100 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {error.originalTitle}
                </h4>
                <p className="text-sm text-red-600 mt-1">
                  {error.error}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Failed at: {new Date(error.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Add this type at the top of the file
type HistoryAction = {
  id: string
  type: 'review' | 'skip' | 'undo' | 'retry' | 'regenerate' | 'edit'
  productTitle: string
  timestamp: number
  details?: string
}

const BulkResultV3Content = () => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [sortBy, setSortBy] = useState('score')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isErrorsPanelOpen, setIsErrorsPanelOpen] = useState(false)
  const [isStatsPanelOpen, setIsStatsPanelOpen] = useState(false)
  const [isTipsPanelOpen, setIsTipsPanelOpen] = useState(false)
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)
  const [regeneratingStates, setRegeneratingStates] = useState<RegeneratingStates>({})
  
  const {
    results,
    setResults,
    activeIndex,
    setActiveIndex,
    reviewStates,
    setReviewStates,
  } = useBulkResult()

  // Initialize with test data
  useEffect(() => {
    if (!results) {
      setResults(TEST_DATA)
    }
  }, [results, setResults])

  // Calculate counts
  const reviewedCount = Object.keys(reviewStates).length
  const totalProducts = results?.successful.length ?? 0
  const remainingCount = totalProducts - reviewedCount

  // Filter products based on search
  const filteredProducts = results?.successful.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []

  // Add history state
  const [history, setHistory] = useState<HistoryAction[]>([])

  // Add mock stats data (you can replace this with real data)
  const mockStats = {
    // Core Quality Metrics
    writingQuality: 85,
    userValue: 78,
    contentAuthenticity: 92,
    technicalExcellence: 88,

    // Content Structure
    wordCounts: {
      description: 120,
      features: 85,
      stylingTips: 65
    },
    completenessScore: 92,
    missingFields: ['Size Guide', 'Care Instructions'],

    // SEO & Engagement
    keywordDensity: 2.1,
    readabilityScore: 75,
    toneAnalysis: {
      professional: 65,
      casual: 20,
      persuasive: 15
    },

    // Brand & Culture
    brandConsistency: {
      terminologyScore: 88,
      styleGuideScore: 92,
      preferredTermsUsed: 18,
      totalPreferredTerms: 20
    },
    culturalAdaptation: {
      relevanceScore: 85,
      translationQuality: 90,
      regionalTerms: {
        used: ['modest fashion', 'abaya', 'kaftan'],
        total: ['modest fashion', 'abaya', 'kaftan', 'thobe']
      }
    },

    // Efficiency
    generationStats: {
      averageTime: 2.5, // minutes
      approvalRate: 85,
      iterationsCount: 1.8,
      reviewDuration: 4.2 // hours
    }
  }

  // Modified review actions to record history
  const handleReview = useCallback((index: number) => {
    setReviewStates(prev => ({
      ...prev,
      [index]: { status: 'reviewed', timestamp: Date.now() }
    }))
    
    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      type: 'review',
      productTitle: results?.successful[index].title || 'Unknown Product',
      timestamp: Date.now(),
      details: 'Product reviewed and approved'
    }, ...prev])
  }, [setReviewStates, results])

  const handleSkip = useCallback((index: number) => {
    setReviewStates(prev => ({
      ...prev,
      [index]: { status: 'skipped', timestamp: Date.now() }
    }))
    
    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      type: 'skip',
      productTitle: results?.successful[index].title || 'Unknown Product',
      timestamp: Date.now(),
      details: 'Product skipped for later review'
    }, ...prev])
  }, [setReviewStates, results])

  const handleUndo = useCallback((index: number) => {
    setReviewStates(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
    
    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      type: 'undo',
      productTitle: results?.successful[index].title || 'Unknown Product',
      timestamp: Date.now(),
      details: 'Review status cleared'
    }, ...prev])
  }, [setReviewStates, results])

  // Add retry handler for failed items
  const handleRetry = useCallback((failedItem: any) => {
    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      type: 'retry',
      productTitle: failedItem.originalTitle,
      timestamp: Date.now(),
      details: 'Retrying failed generation'
    }, ...prev])
    
    // TODO: Implement actual retry logic
  }, [])

  const handleRetryAll = useCallback(() => {
    // TODO: Implement retry all functionality
    console.log('Retrying all failed items')
  }, [])

  const handleRetryItem = useCallback((index: number) => {
    // TODO: Implement single item retry functionality
    console.log('Retrying item at index:', index)
  }, [])

  const handleProductUpdate = (updatedProduct: GeneratedContent) => {
    setResults((prev: { successful: GeneratedContent[]; failed: FailedItem[]; } | null) => {
      if (!prev) return prev
      
      return {
        ...prev,
        successful: prev.successful.map((p: GeneratedContent, idx: number) => 
          idx === activeIndex ? updatedProduct : p
        )
      }
    })
  }

  const getSortDirectionLabel = (sortBy: string, direction: 'asc' | 'desc') => {
    switch (sortBy) {
      case 'score':
        return direction === 'asc' ? 'Low to High' : 'High to Low'
      case 'status':
        return direction === 'asc' ? 'Pending First' : 'Reviewed First'
      default:
        return direction === 'asc' ? 'A to Z' : 'Z to A'
    }
  }

  // Modified handleRegenerate to record history
  const handleRegenerate = useCallback(async (section: string, index: number) => {
    if (!results?.successful[index]) {
      console.error('Product not found')
      return
    }

    setRegeneratingStates(prev => ({ ...prev, [`${section}-${index}`]: true }))
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setResults(prev => {
        if (!prev) return prev
        const newResults = { ...prev }
        const product = { ...newResults.successful[index] }
        
        // Update content based on section
        switch(section) {
          case 'title':
            product.title = `${product.title} (Regenerated)`
            break
          case 'description':
            product.description = `${product.description} (Regenerated)`
            break
          // Add other cases as needed
        }
        
        newResults.successful[index] = product
        return newResults
      })

      // Add to history
      setHistory(prev => [{
        id: crypto.randomUUID(),
        type: 'regenerate',
        productTitle: results.successful[index].title,
        timestamp: Date.now(),
        details: `Regenerated ${section}`
      }, ...prev])
    } catch (err) {
      console.error('Failed to regenerate:', err)
    } finally {
      setRegeneratingStates(prev => ({ ...prev, [`${section}-${index}`]: false }))
    }
  }, [results, setResults])

  // Add handleEdit to record history
  const handleEdit = useCallback((index: number, field: string, newValue: any) => {
    if (!results?.successful[index]) {
      console.error('Product not found')
      return
    }

    setResults(prev => {
      if (!prev) return prev
      const newResults = { ...prev }
      const product = { ...newResults.successful[index] }
      
      // Update the field
      if (field in product) {
        (product as any)[field] = newValue
      }
      
      newResults.successful[index] = product
      return newResults
    })

    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      type: 'edit',
      productTitle: results.successful[index].title,
      timestamp: Date.now(),
      details: `Edited ${field}`
    }, ...prev])
  }, [results, setResults])

  if (!results) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">Loading results...</div>
            <div className="text-sm text-gray-500">Please wait while we prepare your content</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="shrink-0 border-b border-gray-200 bg-gray-50/50">
        <div className="h-14 px-6 flex items-center justify-between">
          {/* Left - Stats Group */}
          <div className="flex items-center gap-8">
            {/* Products Count */}
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{totalProducts} Products</span>
                <span className="text-xs text-gray-500">Bulk Generation</span>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Key Metrics */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-emerald-600">{results.successful.length}/{totalProducts}</span>
                <span className="text-xs text-gray-500">Success</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{reviewedCount}/{totalProducts}</span>
                <span className="text-xs text-gray-500">Reviewed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-red-600">{results.failed.length}</span>
                <span className="text-xs text-gray-500">Errors</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-emerald-600">{Math.round(((results.successful.length - results.failed.length) / results.successful.length) * 100)}%</span>
                <span className="text-xs text-gray-500">Quality</span>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {results.failed.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsErrorsPanelOpen(true)}
                >
                  <AlertCircle className="w-4 h-4" />
                </Button>
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-red-600 text-white rounded-full">
                  {results.failed.length}
                </span>
              </div>
            )}

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsStatsPanelOpen(true)}
              >
                <Medal className="w-4 h-4" />
              </Button>
              <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-gray-900 text-white rounded-full">
                {Math.round((mockStats.writingQuality + mockStats.userValue + mockStats.contentAuthenticity + mockStats.technicalExcellence) / 4)}
              </span>
            </div>

            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsTipsPanelOpen(true)}
              >
                <Lightbulb className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsHistoryPanelOpen(true)}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-gray-700 bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              onClick={() => {
                // TODO: Implement CSV download
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download CSV
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 flex overflow-hidden">
          <div className="w-1/3 flex-shrink-0 flex flex-col border-r border-gray-200">
            <div className="shrink-0 border-b border-gray-200 bg-white">
              <div className="h-14 px-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Product List</h2>
                <div className="flex items-center gap-4">
                  <Select
                    defaultValue="score_desc"
                    onValueChange={(value) => {
                      const [criteria, direction] = value.split('_')
                      setSortBy(criteria)
                      setSortDirection(direction as 'asc' | 'desc')
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-sm bg-white border-gray-200 hover:bg-gray-50 focus:ring-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score_desc">Score: High to Low</SelectItem>
                      <SelectItem value="score_asc">Score: Low to High</SelectItem>
                      <SelectItem value="title_asc">Title: A to Z</SelectItem>
                      <SelectItem value="title_desc">Title: Z to A</SelectItem>
                      <SelectItem value="brand_asc">Brand: A to Z</SelectItem>
                      <SelectItem value="brand_desc">Brand: Z to A</SelectItem>
                      <SelectItem value="category_asc">Category: A to Z</SelectItem>
                      <SelectItem value="category_desc">Category: Z to A</SelectItem>
                      <SelectItem value="status_desc">Status: Reviewed First</SelectItem>
                      <SelectItem value="status_asc">Status: Pending First</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "h-7 px-2.5 rounded-md",
                        viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      )}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-7 px-2.5 rounded-md",
                        viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-12 px-6 flex items-center bg-gray-50/50 border-t border-gray-200">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-md 
                    placeholder:text-gray-500 
                    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                    transition-colors duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ProductList 
                products={filteredProducts}
                viewMode={viewMode}
                activeIndex={activeIndex}
                reviewStates={reviewStates}
                onProductSelect={setActiveIndex}
                onReview={handleReview}
                onSkip={handleSkip}
                onUndo={handleUndo}
                sortBy={sortBy}
                sortDirection={sortDirection}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          <div className="w-2/3 flex-shrink-0 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ProductDetail 
                product={results.successful[activeIndex]}
                reviewState={reviewStates[activeIndex]}
                onReview={() => handleReview(activeIndex)}
                onSkip={() => handleSkip(activeIndex)}
                onUndo={() => handleUndo(activeIndex)}
                onUpdate={handleProductUpdate}
                onRegenerate={() => {
                  // Existing regenerate logic
                }}
                onNext={() => {
                  if (activeIndex < results.successful.length - 1) {
                    setActiveIndex(activeIndex + 1)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ErrorsPanel
        isOpen={isErrorsPanelOpen}
        onClose={() => setIsErrorsPanelOpen(false)}
        failedItems={results.failed.map(item => ({
          originalTitle: item.originalTitle,
          error: item.error,
          timestamp: item.timestamp,
          errorType: item.errorType || (
            item.error.toLowerCase().includes('api') ? 'API Error' : 
            item.error.toLowerCase().includes('validation') ? 'Validation Error' :
            item.error.toLowerCase().includes('network') ? 'Network Error' : 'Unknown Error'
          )
        }))}
        onRetryAll={handleRetryAll}
        onRetryItem={handleRetryItem}
      />
      <StatsPanel
        isOpen={isStatsPanelOpen}
        onClose={() => setIsStatsPanelOpen(false)}
        stats={mockStats}
      />
      <TipsPanel
        isOpen={isTipsPanelOpen}
        onClose={() => setIsTipsPanelOpen(false)}
        products={results.successful.map(product => ({
          ...product,
          stylingTips: product.stylingTips || [],
          metrics: {
            writingQuality: product.metrics.readabilityScore,
            userValue: product.metrics.seoScore,
            contentAuthenticity: product.metrics.toneMatch,
            technicalExcellence: product.metrics.aiConfidence
          }
        }))}
      />
      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        actions={history}
      />
    </div>
  )
}

const BulkResultV3Page = () => (
  <ErrorBoundary>
    <BulkResultProvider>
      <BulkResultV3Content />
    </BulkResultProvider>
  </ErrorBoundary>
)

export default BulkResultV3Page 