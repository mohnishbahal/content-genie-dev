'use client'

import { useState, useEffect } from 'react'
import { GeneratedContent, ReviewState } from "@/types/bulk-result"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImageGallery } from '@/components/bulk-result/ImageGallery'
import { calculateOverallScore } from "@/lib/metrics"
import { CheckCircle2, SkipForward, ChevronRight, Copy, RotateCcw, Pencil, ZoomIn, FileText, Sparkles, Zap, Target, X, Plus, ChevronLeft, Bold, Italic, List, ListOrdered, Heading2, Check, MessageSquare, Eye, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ImageViewer } from './ImageViewer'
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ScoreBadge } from './ScoreBadge'

interface ProductDetailProps {
  product: GeneratedContent
  reviewState: ReviewState | undefined
  onReview: () => void
  onSkip: () => void
  onUndo: () => void
  onUpdate: (updatedProduct: GeneratedContent) => void
  onRegenerate: () => void
  onNext: () => void
}

interface SectionHeaderProps {
  title: string
  onCopy?: () => void
  onRegenerate?: () => void
}

interface FeedbackState {
  contentQuality: number
  creativity: number
  generationSpeed: number
  contentAccuracy: number
  comments: string
}

interface ProductAttribute {
  label: string;
  value: string;
  isEditing?: boolean;
}

const SectionHeader = ({ title, onCopy, onRegenerate }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
    <div className="flex items-center gap-2">
      {onCopy && (
        <Button variant="ghost" size="sm" onClick={onCopy} className="h-8 w-8 p-0">
          <Copy className="h-4 w-4 text-gray-500" />
        </Button>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="sm" onClick={onRegenerate} className="h-8 w-8 p-0">
          <RotateCcw className="h-4 w-4 text-gray-500" />
        </Button>
      )}
    </div>
  </div>
)

const ActionButton = ({ onClick, icon: Icon }: { onClick: () => void, icon: any }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="h-6 w-6 p-0 hover:bg-gray-50 rounded-md"
  >
    <Icon className="h-3 w-3 text-gray-400 hover:text-gray-500" />
  </Button>
)

export const ProductDetail = ({
  product,
  reviewState,
  onReview,
  onSkip,
  onUndo,
  onUpdate,
  onRegenerate,
  onNext
}: ProductDetailProps) => {
  const [activeTab, setActiveTab] = useState('preview')
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)
  const [editableContent, setEditableContent] = useState<Record<string, string | string[]>>({})
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>({
    contentQuality: 0,
    creativity: 0,
    generationSpeed: 0,
    contentAccuracy: 0,
    comments: ''
  })
  const [editMode, setEditMode] = useState<Record<string, boolean>>({})
  const [editedContent, setEditedContent] = useState<Record<string, any>>({})
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState(`Elevate your evening wardrobe with this <span class="bg-orange-100 text-orange-700">black satin jumpsuit</span>, a versatile piece that seamlessly transitions from day to night. The <span class="bg-orange-100 text-orange-700">elegant black jumpsuit</span> features a sophisticated round neckline and long sleeves, crafted from premium jersey fabric for both style and comfort.

The <span class="bg-orange-100 text-orange-700">wide leg jumpsuit</span> design creates a flattering silhouette, while the midi length makes it perfect for any occasion from casual outings to semi-formal events. This <span class="bg-orange-100 text-orange-700">women's evening jumpsuit</span> combines timeless elegance with modern sophistication.`)
  const [editingAttribute, setEditingAttribute] = useState<string | null>(null)
  const [editedAttributeValue, setEditedAttributeValue] = useState("")
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState<Record<string, boolean>>({
    brandAlignment: false,
    seoOptimization: false,
    technicalDetails: false,
    contentStructure: false
  })
  const [selectedTone, setSelectedTone] = useState('professional')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  const stages = [
    { icon: Target, label: "Analyzing", status: "pending" },
    { icon: RotateCcw, label: "Adapting", status: "pending" },
    { icon: FileText, label: "Refining", status: "pending" },
    { icon: Sparkles, label: "Polishing", status: "pending" },
    { icon: Check, label: "Finalizing", status: "pending" }
  ]

  const regenerateContent = async () => {
    setIsRegenerating(true)
    setProgress(0)
    setCurrentStage(0)

    // Simulate the regeneration process through each stage
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i)
      const startProgress = (i / stages.length) * 100
      const endProgress = ((i + 1) / stages.length) * 100
      
      // Animate progress within each stage more smoothly
      for (let p = startProgress; p <= endProgress; p += 0.5) {
        setProgress(p)
        await new Promise(resolve => setTimeout(resolve, 25)) // Smoother updates (25ms per 0.5%)
      }
      // Add a small pause between stages
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Complete the process
    setIsRegenerating(false)
    setProgress(0)
    setCurrentStage(0)
    
    toast.success("Content regenerated", {
      description: "Content has been updated successfully",
      duration: 3000,
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  const handleRegenerate = (section: string) => {
    // TODO: Implement regeneration
    console.log('Regenerating:', section)
  }

  const handleStartEditing = (section: string, content: string | string[]) => {
    setEditableContent(prev => ({
      ...prev,
      [section]: content
    }))
    setEditingSections(prev => ({
      ...prev,
      [section]: true
    }))
  }

  const handleSaveEdit = (section: string) => {
    // TODO: Implement save functionality
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }))
  }

  const handleCopyAttribute = (label: string, value: string) => {
    navigator.clipboard.writeText(`${label}: ${value}`)
    // TODO: Add toast notification
  }

  const handleCopyAllAttributes = () => {
    const attributes: ProductAttribute[] = [
      { label: 'Closure', value: 'Pullover' },
      { label: 'Colour', value: 'Burgundy' },
      { label: 'Design', value: 'A-line' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Hemline', value: 'A-line' },
      { label: 'Length', value: 'Midi' },
      { label: 'Material', value: 'Jersey' },
      { label: 'Neck Line', value: 'Round Neck' },
      { label: 'Neck Type', value: 'Crew Neck' },
      { label: 'Occasion', value: 'Casual, semi-formal, evening' },
      { label: 'Pattern', value: 'Solid' },
      { label: 'Sleeve Length', value: 'Long Sleeve' },
      { label: 'Style', value: 'Casual, Elegant' },
      { label: 'Trend', value: 'Timeless Classic' }
    ]
    
    const attributeText = attributes
      .map(({ label, value }) => `${label}: ${value}`)
      .join('\n')
    navigator.clipboard.writeText(attributeText)
    // TODO: Add toast notification
  }

  const startEditing = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: true }))
    setEditedContent(prev => ({ ...prev, [section]: product[section] }))
  }

  const cancelEditing = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: false }))
    setEditedContent(prev => {
      const newContent = { ...prev }
      delete newContent[section]
      return newContent
    })
  }

  const saveEdits = (section: string) => {
    // Create a new product object with the updated content
    const updatedProduct = {
      ...product,
      [section]: editedContent[section]
    } as GeneratedContent

    // Call the onUpdate prop to notify parent component
    if (onUpdate) {
      onUpdate(updatedProduct)
    }

    // Update local state
    setEditMode(prev => ({ ...prev, [section]: false }))
    setEditedContent(prev => {
      const newContent = { ...prev }
      delete newContent[section]
      return newContent
    })

    // Add a toast notification
    toast.success(`Successfully updated ${section}`, {
      description: "Your changes have been saved",
      duration: 2000,
    })
  }

  const updateEditedContent = (section: string, value: any) => {
    setEditedContent(prev => ({ ...prev, [section]: value }))
  }

  const addArrayItem = (section: string) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: [...(prev[section] || product[section]), '']
    }))
  }

  const removeArrayItem = (section: string, index: number) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index)
    }))
  }

  const updateArrayItem = (section: string, index: number, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: prev[section].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const onSave = (updatedFields: Partial<GeneratedContent>) => {
    // Update the product with the new fields
    const updatedProduct = {
      ...product,
      ...updatedFields,
    }
    // Implement save functionality
    console.log('Saving product:', updatedProduct)
    toast.success("Product updated", {
      description: "Your changes have been saved successfully!",
      duration: 2000,
    })
  }

  const handleStartEditingAttribute = (label: string, value: string) => {
    setEditingAttribute(label)
    setEditedAttributeValue(value)
  }

  const handleSaveAttribute = (label: string) => {
    // TODO: Implement save functionality for attributes
    console.log('Saving attribute:', label, editedAttributeValue)
    setEditingAttribute(null)
    toast.success("Attribute updated", {
      description: `Successfully updated ${label}`,
      duration: 2000,
    })
  }

  const handleCancelEditingAttribute = () => {
    setEditingAttribute(null)
    setEditedAttributeValue("")
  }

  const getScoreColor = (score: number) => {
    return '#FF6A00' // Always return the brand orange color
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent'
    if (score >= 50) return 'Good'
    return 'Needs Improvement'
  }

  const handleOptimize = async (category: string) => {
    setIsOptimizing(prev => ({ ...prev, [category]: true }))
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsOptimizing(prev => ({ ...prev, [category]: false }))
    
    toast.success(`${category} Optimized`, {
      description: "Content has been improved based on our recommendations",
      duration: 3000,
    })
  }

  const handleFeedbackSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Submitting feedback:', feedback)
    
    // Show success message
    toast.success("Thank you for your feedback!", {
      description: "Your feedback helps us improve our content generation.",
      duration: 3000,
    })
    
    // Show thank you message
    setShowThankYou(true)
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFeedback({
        contentQuality: 0,
        creativity: 0,
        generationSpeed: 0,
        contentAccuracy: 0,
        comments: ''
      })
      setShowThankYou(false)
    }, 2000)
  }

  const getRecommendationType = (score: number) => {
    if (score >= 4.5) return 'excellent'
    if (score >= 4.0) return 'good'
    return 'improve'
  }

  const recommendations = {
    writingQuality: {
      score: 4.2,
      tips: {
        excellent: ['Clear and engaging narrative flow', 'Professional tone maintained throughout'],
        good: ['Good use of descriptive language', 'Well-structured paragraphs'],
        improve: ['Improve sentence structure', 'Enhance readability']
      }
    },
    userValue: {
      score: 4.1,
      tips: {
        excellent: ['Strong value proposition', 'Clear target audience focus'],
        good: ['Effective benefit communication', 'Good engagement elements'],
        improve: ['Strengthen value proposition', 'Add persuasive elements']
      }
    },
    contentAuthenticity: {
      score: 4.8,
      tips: {
        excellent: ['Perfect brand voice alignment', 'Consistent messaging throughout'],
        good: ['Good brand tone matching', 'Authentic content style'],
        improve: ['Match brand voice better', 'Ensure consistency']
      }
    },
    technicalExcellence: {
      score: 4.0,
      tips: {
        excellent: ['Comprehensive technical details', 'Perfect specification accuracy'],
        good: ['Detailed product information', 'Clear technical explanations'],
        improve: ['Add more product specs', 'Verify technical information']
      }
    }
  }

  useEffect(() => {
    if (activeTab === 'preview' && !isPreviewLoaded) {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsPreviewLoaded(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  // Add this helper function after the component's state declarations
  const getTextDirection = (lang: 'en' | 'ar') => {
    return lang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div className="h-full flex flex-col">
      <style jsx global>{`
        @keyframes optimize {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes scoreBar {
          from {
            width: 0%;
          }
          to {
            width: var(--score-width);
          }
        }

        @keyframes circleProgress {
          from {
            stroke-dashoffset: ${2 * Math.PI * 84};
          }
          to {
            stroke-dashoffset: var(--circle-offset);
          }
        }

        .score-bar {
          width: var(--score-width);
          animation: scoreBar 1.5s ease-out;
        }

        .circle-progress {
          stroke-dashoffset: var(--circle-offset);
          animation: circleProgress 2s ease-in-out;
        }

        .score-number {
          animation: countUp 2s ease-out;
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .metric-card {
          transition: all 0.2s ease-in-out;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .progress-ring circle {
          transition: stroke-dashoffset 1s ease-in-out;
        }

        .recommendation-card {
          transition: all 0.2s ease-in-out;
        }

        .recommendation-card:hover {
          transform: translateX(4px);
        }

        .action-bar-enter {
          transform: translateY(100%);
          opacity: 0;
        }
        .action-bar-enter-active {
          transform: translateY(0);
          opacity: 1;
          transition: all 0.3s ease-out;
        }
      `}</style>
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        if (value !== 'preview') {
          setIsPreviewLoaded(false)
        }
      }} className="h-full flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-gray-200 bg-white">
          {/* Main Header */}
          <div className="px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <ScoreBadge score={calculateOverallScore(product.metrics)} size="md" />
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    language === 'en' 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    language === 'ar' 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  AR
                </button>
              </div>
            </div>
            {reviewState ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {reviewState.status === 'reviewed' ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-green-600">Approved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <SkipForward className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Skipped</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className={cn(
                    "gap-2 h-9 border-2 transition-all duration-200 shadow-sm hover:shadow-md",
                    reviewState.status === 'reviewed' 
                      ? "border-green-600 text-green-600 hover:bg-green-50" 
                      : "border-gray-600 text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={onUndo}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Undo {reviewState.status === 'reviewed' ? 'Approval' : 'Skip'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 gap-2 h-9"
                  onClick={onRegenerate}
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 gap-2 h-9"
                  onClick={() => {
                    onSkip();
                    onNext();
                  }}
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 gap-2 h-9 px-4 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => {
                    onReview();
                    onNext();
                  }}
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
              </div>
            )}
          </div>

          {/* Sub Header (Tabs) */}
          <div className="px-4 h-12 flex items-center border-t border-gray-100 bg-gray-100">
            <TabsList className="w-full bg-gray-100 p-1 h-9 rounded-lg">
              <TabsTrigger 
                value="preview" 
                className="text-xs flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="quality" 
                className="text-xs flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Target className="w-3.5 h-3.5" />
                Quality & Feedback
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <TabsContent value="preview" className="mt-0">
              {!isPreviewLoaded ? (
                <div className="space-y-6">
                  {/* Loading skeleton for image gallery */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="h-[320px] bg-gray-100 rounded-lg animate-pulse" />
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Loading skeleton for content tone */}
                  <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                  
                  {/* Loading skeleton for other sections */}
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Existing preview content */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Image Banner */}
                    <section className="relative group">
                <div 
                        className="relative w-full h-[320px] cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => {
                    setFullscreenImageIndex(0)
                    setIsFullscreen(true)
                  }}
                >
                  <img
                    src={[product.images.primary, ...product.images.gallery][fullscreenImageIndex]}
                    alt={`Product image ${fullscreenImageIndex + 1}`}
                          className="w-full h-full object-cover object-top transition-transform duration-500"
                  />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Arrow Navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFullscreenImageIndex(prev => 
                      prev === 0 
                        ? product.images.gallery.length 
                        : prev - 1
                    )
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFullscreenImageIndex(prev => 
                      prev === product.images.gallery.length 
                        ? 0 
                        : prev + 1
                    )
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>

                {/* Image Navigation Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {[product.images.primary, ...product.images.gallery].map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setFullscreenImageIndex(index)
                      }}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        index === fullscreenImageIndex 
                          ? "bg-white w-2.5" 
                          : "bg-white/60 hover:bg-white/80"
                      )}
                    />
                  ))}
                    </div>
              </section>

                    {/* Product Information */}
                    <section className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-base font-semibold text-gray-900">Product Information</h3>
                            <p className="text-sm text-gray-500">Basic product details and identification</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-2.5 rounded-md shadow-sm">
                          <div className="text-sm font-medium text-gray-500 mb-0.5">Brand</div>
                          <div className="text-sm text-gray-900">{product.brand || 'No brand'}</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-md shadow-sm">
                          <div className="text-sm font-medium text-gray-500 mb-0.5">Category</div>
                          <div className="text-sm text-gray-900">Dresses & Jumpsuits</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-md shadow-sm">
                          <div className="text-sm font-medium text-gray-500 mb-0.5">Product ID</div>
                          <div className="text-sm text-gray-900">NLMAX240517-MXSS25073024</div>
                        </div>
                      </div>
                    </section>
                  </div>

              {/* Fullscreen Image Viewer */}
              {isFullscreen && (
                <ImageViewer
                  images={[product.images.primary, ...product.images.gallery]}
                  initialIndex={fullscreenImageIndex}
                  onClose={() => setIsFullscreen(false)}
                />
              )}

                  {/* Content Tone */}
                  <section className="bg-orange-50/50 rounded-lg p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="space-y-0.5">
                  <h3 className="text-base font-semibold text-gray-900">Content Tone</h3>
                          <p className="text-sm text-gray-500">Choose a tone of voice to shape how your product communicates with customers</p>
                        </div>
                      </div>
                    </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'professional', label: 'Professional', description: 'Formal and business-like tone' },
                      { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
                      { id: 'luxury', label: 'Luxury', description: 'Sophisticated and high-end' },
                      { id: 'persuasive', label: 'Persuasive', description: 'Compelling and action-oriented' }
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        onClick={async () => {
                          setSelectedTone(tone.id)
                          regenerateContent()
                        }}
                        className={cn(
                          "p-4 rounded-lg text-left transition-all duration-200 group",
                          selectedTone === tone.id
                            ? "bg-white ring-1 ring-orange-200 shadow-sm" 
                              : "bg-white/80 hover:bg-white hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-sm font-medium",
                            selectedTone === tone.id ? "text-[#FF6A00]" : "text-gray-900"
                          )}>
                            {tone.label}
                          </span>
                          {selectedTone === tone.id && (
                            <div className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{tone.description}</p>
                      </button>
                    ))}
                </div>
              </section>

              {/* Regeneration Popup */}
              {isRegenerating && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 transform transition-all animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Generating Content
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
                          <Sparkles className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            AI in progress
                          </span>
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="space-y-6">
                        {/* Status and Progress */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin duration-700" />
                            </div>
                            <div className="transition-all duration-300">
                              <p className="text-sm font-medium text-gray-900">{stages[currentStage].label}...</p>
                              <p className="text-sm text-gray-500">Using {selectedTone.toLowerCase()} tone</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-orange-600 tabular-nums transition-all duration-200">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        {/* Progress bar with gradient */}
                        <div className="relative">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-in-out"
                              style={{ 
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #FF6A00 0%, #FF8A3D 100%)'
                              }} 
                            />
                          </div>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-5 gap-2">
                          {stages.map((step, index) => (
                            <div key={step.label} className="flex flex-col items-center gap-2">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                index < currentStage ? "bg-orange-100" :
                                index === currentStage ? "bg-orange-50" :
                                "bg-gray-50"
                              )}>
                                <step.icon className={cn(
                                  "w-4 h-4 transition-all duration-300",
                                  index < currentStage ? "text-orange-600" :
                                  index === currentStage ? "text-orange-500" :
                                  "text-gray-400"
                                )} />
                              </div>
                              <span className={cn(
                                "text-xs text-center transition-all duration-300",
                                index < currentStage ? "text-orange-600" :
                                index === currentStage ? "text-gray-900" :
                                "text-gray-400"
                              )}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Activity indicator */}
                        <div className="flex justify-center gap-2 pt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_1.4s_ease-in-out_infinite]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_1.4s_ease-in-out_infinite_0.2s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_1.4s_ease-in-out_infinite_0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {!isRegenerating && (
                <div
                  id="regeneration-success"
                  className="fixed bottom-4 right-4 flex items-center gap-3 bg-white text-green-600 px-4 py-3 rounded-lg shadow-lg opacity-0 transition-opacity duration-300"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Content Updated Successfully!</p>
                    <p className="text-sm text-green-700">Your content has been regenerated with the new tone.</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                  {/* Title */}
                    <section className="bg-gray-50 rounded-lg p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Heading2 className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-base font-semibold text-gray-900">Product Title</h3>
                            <p className="text-sm text-gray-500">Main product title that appears in search results</p>
                          </div>
                        </div>
                      <div className="flex items-center gap-1">
                    {editMode.title ? (
                          <ActionButton icon={Check} onClick={() => saveEdits('title')} />
                        ) : (
                          <ActionButton icon={Pencil} onClick={() => startEditing('title')} />
                        )}
                        <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('title')} />
                        <ActionButton icon={Copy} onClick={() => handleCopy(product.title)} />
                      </div>
                    </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        {editMode.title ? (
                      <Input
                        value={editedContent.title}
                        onChange={(e) => updateEditedContent('title', e.target.value)}
                        className={cn(
                          "w-full bg-white border-transparent hover:border-gray-200 focus:border-gray-200 focus:ring-gray-200 font-semibold text-lg",
                          language === 'ar' && "text-right"
                        )}
                        dir={getTextDirection(language)}
                        placeholder="Enter product title..."
                      />
                        ) : (
                          <h3 className={cn(
                            "text-lg font-semibold text-gray-900",
                            language === 'ar' && "text-right"
                          )} dir={getTextDirection(language)}>
                            {product.title}
                          </h3>
                    )}
                </div>
                    </section>

                {/* SEO Keywords */}
                    <section className="bg-gray-50 rounded-lg p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Target className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">SEO Keywords</h3>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                                  <span className="text-sm text-gray-600">4 used</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  <span className="text-sm text-gray-600">3 unused</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">Keywords will be automatically highlighted in the description</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {editMode.seoKeywords ? (
                        <ActionButton icon={Check} onClick={() => saveEdits('seoKeywords')} />
                      ) : (
                        <ActionButton icon={Pencil} onClick={() => startEditing('seoKeywords')} />
                      )}
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('seoKeywords')} />
                      <ActionButton icon={Copy} onClick={() => handleCopy(product.seoKeywords.join(', '))} />
                    </div>
                  </div>
                    {editMode.seoKeywords ? (
                      <div className="space-y-2">
                          {editedContent.seoKeywords.map((keyword: string, index: number) => (
                          <div key={index} className="relative">
                              <Input
                                value={keyword}
                                onChange={(e) => updateArrayItem('seoKeywords', index, e.target.value)}
                                className={cn(
                                  "w-full pr-8 bg-white border-gray-200 focus:ring-gray-200",
                                  language === 'ar' && "text-right"
                                )}
                                dir={getTextDirection(language)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem('seoKeywords', index)}
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              >
                              <X className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addArrayItem('seoKeywords')}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1.5 text-sm font-medium"
                          >
                          <Plus className="h-3.5 w-3.5" />
                            Add Keyword
                          </Button>
                      </div>
                    ) : (
                        <div className={cn(
                          "bg-white p-4 rounded-md shadow-sm",
                          language === 'ar' && "text-right"
                        )} dir={getTextDirection(language)}>
                      <div className={cn(
                        "flex flex-wrap gap-2",
                        language === 'ar' && "justify-end flex-row-reverse"
                      )}>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          black satin jumpsuit
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          women's evening jumpsuit
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          premium quality jumpsuit
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          satin jumpsuit for special occasions
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          elegant black jumpsuit
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          wide leg jumpsuit
                        </Badge>
                        <Badge variant="secondary" className={cn(
                          "px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 text-sm font-medium transition-colors rounded",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          surplice jumpsuit
                        </Badge>
                      </div>
                  </div>
                    )}
                </section>

                {/* Description */}
                  <section className="bg-gray-50 rounded-lg p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-gray-900">Product Description</h3>
                      <p className="text-sm text-gray-500">Write a detailed product description with formatting</p>
                    </div>
                      </div>
                      <div className="flex items-center gap-1">
                      {isEditingDescription ? (
                        <ActionButton icon={Check} onClick={() => {
                          onSave({ description })
                          setIsEditingDescription(false)
                        }} />
                      ) : (
                        <ActionButton icon={Pencil} onClick={() => setIsEditingDescription(true)} />
                      )}
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('description')} />
                      <ActionButton icon={Copy} onClick={() => handleCopy(description)} />
                    </div>
                  </div>
                  {isEditingDescription ? (
                      <div className="space-y-2 bg-white p-3 rounded-md shadow-sm">
                        <div className={cn(language === 'ar' && "rtl")}>
                          <RichTextEditor
                            content={description}
                            onChange={(content) => setDescription(content)}
                            placeholder="Enter a detailed product description..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={cn(
                          "prose prose-sm max-w-none bg-white p-4 rounded-md shadow-sm",
                          language === 'ar' && "text-right"
                        )}
                        dir={getTextDirection(language)}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                </section>

                  {/* Product Features and Highlights */}
                  <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Product Features */}
                    <section className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <List className="w-4 h-4 text-orange-600" />
                          </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-gray-900">Product Features</h3>
                      <p className="text-sm text-gray-500">Key features and specifications</p>
                          </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {editMode.productFeatures ? (
                        <ActionButton icon={Check} onClick={() => saveEdits('productFeatures')} />
                      ) : (
                        <ActionButton icon={Pencil} onClick={() => startEditing('productFeatures')} />
                      )}
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('productFeatures')} />
                      <ActionButton icon={Copy} onClick={() => handleCopy(product.productFeatures.join('\n'))} />
                    </div>
                  </div>
                    {editMode.productFeatures ? (
                    <div className="space-y-2">
                        {editedContent.productFeatures.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5" />
                            <div className="flex-1">
                              <Input
                                value={feature}
                                onChange={(e) => updateArrayItem('productFeatures', index, e.target.value)}
                                className={cn(
                                  "w-full bg-white",
                                  language === 'ar' && "text-right"
                                )}
                                dir={getTextDirection(language)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('productFeatures', index)}
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addArrayItem('productFeatures')}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1.5 text-sm font-medium"
                        >
                        <Plus className="h-3.5 w-3.5" />
                          Add Feature
                        </Button>
                      </div>
                    ) : (
                        <ul className="space-y-3">
                        {product.productFeatures.map((feature, index) => (
                            <li key={index} className={cn(
                              "flex items-start gap-3 bg-white p-3 rounded-md shadow-sm",
                              language === 'ar' && "flex-row-reverse"
                            )}>
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                          <span className={cn(
                            "text-sm text-gray-700",
                            language === 'ar' && "text-right"
                          )} dir={getTextDirection(language)}>
                            {feature}
                          </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </section>

                {/* Product Highlights */}
                      <section className="bg-gray-50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-orange-600" />
                            </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-gray-900">Product Highlights</h3>
                      <p className="text-sm text-gray-500">Standout features and benefits</p>
                          </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {editMode.highlights ? (
                        <ActionButton icon={Check} onClick={() => saveEdits('highlights')} />
                      ) : (
                        <ActionButton icon={Pencil} onClick={() => startEditing('highlights')} />
                      )}
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('highlights')} />
                      <ActionButton icon={Copy} onClick={() => handleCopy(product.highlights.join('\n'))} />
                    </div>
                  </div>
                    {editMode.highlights ? (
                    <div className="space-y-2">
                        {editedContent.highlights.map((highlight: string, index: number) => (
                          <div key={index} className={cn(
                            "flex items-start gap-2",
                            language === 'ar' && "flex-row-reverse"
                          )}>
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <Input
                                value={highlight}
                                onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                                className={cn(
                                  "w-full bg-white",
                                  language === 'ar' && "text-right"
                                )}
                                dir={getTextDirection(language)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('highlights', index)}
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addArrayItem('highlights')}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1.5 text-sm font-medium"
                        >
                        <Plus className="h-3.5 w-3.5" />
                          Add Highlight
                        </Button>
                      </div>
                    ) : (
                    <div className="space-y-3">
                      {product.highlights.map((highlight, index) => (
                            <div key={index} className={cn(
                              "flex items-start gap-3 bg-white p-3 rounded-md shadow-sm",
                              language === 'ar' && "flex-row-reverse"
                            )}>
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className={cn(
                            "text-sm text-gray-700",
                            language === 'ar' && "text-right"
                          )} dir={getTextDirection(language)}>
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                    )}
                </section>
                  </div>

                {/* Styling Tips */}
                  <section className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-orange-600" />
                        </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-gray-900">Styling Tips</h3>
                      <p className="text-sm text-gray-500">Recommendations for styling the product</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {editMode.stylingTips ? (
                        <ActionButton icon={Check} onClick={() => saveEdits('stylingTips')} />
                      ) : (
                        <ActionButton icon={Pencil} onClick={() => startEditing('stylingTips')} />
                      )}
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('stylingTips')} />
                      <ActionButton icon={Copy} onClick={() => handleCopy(product.stylingTips?.join('\n') || '')} />
                    </div>
                  </div>
                    {editMode.stylingTips ? (
                    <div className="space-y-2">
                        {editedContent.stylingTips?.map((tip: string, index: number) => (
                          <div key={index} className={cn(
                            "flex items-start gap-2",
                            language === 'ar' && "flex-row-reverse"
                          )}>
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                            </svg>
                          </div>
                            <div className="flex-1">
                              <Input
                                value={tip}
                                onChange={(e) => updateArrayItem('stylingTips', index, e.target.value)}
                                className={cn(
                                  "w-full bg-white",
                                  language === 'ar' && "text-right"
                                )}
                                dir={getTextDirection(language)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('stylingTips', index)}
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addArrayItem('stylingTips')}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1.5 text-sm font-medium"
                        >
                        <Plus className="h-3.5 w-3.5" />
                          Add Styling Tip
                        </Button>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                      {product.stylingTips?.map((tip, index) => (
                          <li key={index} className={cn(
                            "flex items-start gap-3 bg-white p-3 rounded-md shadow-sm",
                            language === 'ar' && "flex-row-reverse"
                          )}>
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                            </svg>
                          </div>
                          <span className={cn(
                            "text-sm text-gray-700",
                            language === 'ar' && "text-right"
                          )} dir={getTextDirection(language)}>
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                    )}
                </section>

                {/* Product Attributes */}
                    <section className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <ListOrdered className="w-4 h-4 text-orange-600" />
                          </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-gray-900">Product Attributes</h3>
                      <p className="text-sm text-gray-500">Technical specifications and details</p>
                      </div>
                          </div>
                    <div className="flex items-center gap-1">
                      <ActionButton icon={Copy} onClick={handleCopyAllAttributes} />
                      <ActionButton icon={RotateCcw} onClick={() => handleRegenerate('attributes')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Closure', value: 'Pullover' },
                      { label: 'Colour', value: 'Burgundy' },
                      { label: 'Design', value: 'A-line' },
                      { label: 'Fit', value: 'Regular' },
                      { label: 'Hemline', value: 'A-line' },
                      { label: 'Length', value: 'Midi' },
                      { label: 'Material', value: 'Jersey' },
                      { label: 'Neck Line', value: 'Round Neck' },
                      { label: 'Neck Type', value: 'Crew Neck' },
                      { label: 'Occasion', value: 'Casual, semi-formal, evening' },
                      { label: 'Pattern', value: 'Solid' },
                      { label: 'Sleeve Length', value: 'Long Sleeve' },
                      { label: 'Style', value: 'Casual, Elegant' },
                      { label: 'Trend', value: 'Timeless Classic' }
                    ].map(({ label, value }) => (
                          <div key={label} className="flex flex-col bg-white p-3 rounded-md shadow-sm">
                        <div className={cn(
                          "flex items-center justify-between mb-1.5",
                          language === 'ar' && "flex-row-reverse"
                        )}>
                          <span className={cn(
                            "text-sm font-medium text-gray-500",
                            language === 'ar' && "text-right"
                          )}>
                            {label}
                          </span>
                          <div className="flex items-center gap-1">
                            {editingAttribute === label ? (
                              <ActionButton icon={Check} onClick={() => handleSaveAttribute(label)} />
                            ) : (
                              <ActionButton icon={Pencil} onClick={() => handleStartEditingAttribute(label, value)} />
                            )}
                            <ActionButton icon={RotateCcw} onClick={() => handleRegenerate(label.toLowerCase())} />
                            <ActionButton icon={Copy} onClick={() => handleCopyAttribute(label, value)} />
                          </div>
                        </div>
                        <div>
                          {editingAttribute === label ? (
                            <Input
                              value={editedAttributeValue}
                              onChange={(e) => setEditedAttributeValue(e.target.value)}
                              className={cn(
                                "h-7 text-sm w-full bg-gray-50",
                                language === 'ar' && "text-right"
                              )}
                              dir={getTextDirection(language)}
                            />
                          ) : (
                            <span className={cn(
                              "text-sm text-gray-900",
                              language === 'ar' && "text-right"
                            )} dir={getTextDirection(language)}>
                              {value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="quality" className="mt-0">
              <div className="space-y-6">
                {/* Score Overview Card */}
                <section className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-semibold text-gray-900">Content Quality Score</h3>
                        <p className="text-sm text-gray-500">A comprehensive evaluation of your product content's performance</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Score Circle */}
                    <div className="relative p-6 bg-gradient-to-br from-orange-50/90 to-white rounded-lg border border-orange-100">
                      <div className="absolute inset-0 bg-[radial-gradient(#FF6A00_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5" />
                      <div className="relative flex items-center justify-center">
                      <div className="relative">
                          <div className="w-[140px] h-[140px] rounded-full flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="70"
                                cy="70"
                                r="64"
                              className="stroke-[#f4f4f5] fill-none"
                              strokeWidth="6"
                            />
                            <circle
                                cx="70"
                                cy="70"
                                r="64"
                              className={cn(
                                  "stroke-current fill-none circle-progress text-[#FF6A00]"
                              )}
                              strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 64}`}
                              style={{ 
                                  '--circle-offset': `${2 * Math.PI * 64 * (1 - calculateOverallScore(product.metrics) / 100)}px`
                              } as React.CSSProperties}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="text-4xl font-semibold text-gray-900 whitespace-nowrap score-number">
                              {calculateOverallScore(product.metrics)}
                            </div>
                            <div className="text-sm text-gray-500">out of 100</div>
                          </div>
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                          <div className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium border",
                              "bg-orange-50 text-orange-700 border-orange-100"
                            )}>
                              {getScoreLabel(calculateOverallScore(product.metrics))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Quality Metrics Grid */}
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Writing Quality',
                        score: product.metrics.readabilityScore,
                        icon: FileText,
                        description: 'Clarity and readability'
                      },
                      {
                        label: 'User Value',
                        score: product.metrics.seoScore,
                        icon: Zap,
                        description: 'Impact and relevance'
                      },
                      {
                        label: 'Content Auth.',
                        score: product.metrics.toneMatch,
                        icon: Target,
                        description: 'Brand alignment'
                      },
                      {
                        label: 'Tech. Excellence',
                        score: product.metrics.aiConfidence,
                        icon: Sparkles,
                        description: 'Technical accuracy'
                      }
                    ].map((factor) => (
                      <div
                        key={factor.label}
                          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                              <factor.icon className="h-4 w-4 text-[#FF6A00]" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{factor.label}</div>
                            <div className="text-xs text-gray-500">{factor.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full score-bar transition-all duration-500 bg-[#FF6A00]"
                              style={{ 
                                  '--score-width': `${factor.score}%`
                              } as React.CSSProperties}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{factor.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </section>

                {/* Tips & Recommendations */}
                <section className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-semibold text-gray-900">Tips & Recommendations</h3>
                        <p className="text-sm text-gray-500">Actionable recommendations to enhance your content</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {/* Brand Alignment */}
                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Target className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                          <h4 className="text-sm font-medium text-gray-900">Brand Alignment</h4>
                          <p className="text-xs text-gray-600 mt-1">Tone and voice match</p>
                          </div>
                        </div>
                      <ul className="space-y-2 mb-3">
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Review brand guidelines
                        </li>
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Use brand keywords
                        </li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimize('brandAlignment')}
                        disabled={isOptimizing.brandAlignment}
                        className="w-full h-8 text-xs gap-1.5 border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        {isOptimizing.brandAlignment ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Fixing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Fix with AI
                          </>
                        )}
                      </Button>
                      </div>

                    {/* SEO Optimization */}
                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                          <h4 className="text-sm font-medium text-gray-900">SEO Optimization</h4>
                          <p className="text-xs text-gray-600 mt-1">Search visibility</p>
                          </div>
                        </div>
                      <ul className="space-y-2 mb-3">
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Add long-tail keywords
                        </li>
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Enhance meta data
                        </li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimize('seoOptimization')}
                        disabled={isOptimizing.seoOptimization}
                        className="w-full h-8 text-xs gap-1.5 border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        {isOptimizing.seoOptimization ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Fixing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Fix with AI
                          </>
                        )}
                      </Button>
                              </div>

                    {/* Technical Details */}
                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Technical Details</h4>
                          <p className="text-xs text-gray-600 mt-1">Product specifications</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-3">
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Add fabric details
                        </li>
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Include sizing info
                        </li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimize('technicalDetails')}
                        disabled={isOptimizing.technicalDetails}
                        className="w-full h-8 text-xs gap-1.5 border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        {isOptimizing.technicalDetails ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Fixing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Fix with AI
                          </>
                        )}
                      </Button>
                      </div>

                    {/* Content Structure */}
                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <List className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                          <h4 className="text-sm font-medium text-gray-900">Content Structure</h4>
                          <p className="text-xs text-gray-600 mt-1">Organization & flow</p>
                          </div>
                        </div>
                      <ul className="space-y-2 mb-3">
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Use clear sections
                        </li>
                        <li className="flex items-center gap-2 text-xs text-gray-700">
                          <div className="w-1 h-1 rounded-full bg-orange-400" />
                          Add subheadings
                        </li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimize('contentStructure')}
                        disabled={isOptimizing.contentStructure}
                        className="w-full h-8 text-xs gap-1.5 border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        {isOptimizing.contentStructure ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Fixing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Fix with AI
                          </>
                        )}
                      </Button>
                              </div>
                  </div>
                </section>

                {/* Detailed Analysis */}
                <section className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-semibold text-gray-900">Detailed Analysis</h3>
                        <p className="text-sm text-gray-500">In-depth evaluation of content quality factors</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Writing Quality Analysis */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Writing Quality</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Clarity, structure, and readability</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                            <span className="text-sm font-medium text-orange-600">{product.metrics.readabilityScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Narrative Flow', score: 4.5 },
                          { label: 'Language Precision', score: 4.2 },
                          { label: 'Grammar & Structure', score: 4.8 },
                          { label: 'Readability', score: 4.3 }
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 mb-1.5">{metric.label}</div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full score-bar bg-[#FF6A00]"
                                  style={{ '--score-width': `${(metric.score / 5) * 100}%` } as React.CSSProperties}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{metric.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Value Analysis */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">User Value</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Impact and relevance for users</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                            <span className="text-sm font-medium text-orange-600">{product.metrics.seoScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Value Proposition', score: 4.6 },
                          { label: 'Target Audience', score: 4.4 },
                          { label: 'Call to Action', score: 4.2 },
                          { label: 'Engagement', score: 4.5 }
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 mb-1.5">{metric.label}</div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full score-bar bg-[#FF6A00]"
                                  style={{ '--score-width': `${(metric.score / 5) * 100}%` } as React.CSSProperties}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{metric.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Authenticity Analysis */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Target className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Content Authenticity</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Brand alignment and consistency</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                            <span className="text-sm font-medium text-orange-600">{product.metrics.toneMatch}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Brand Voice', score: 4.7 },
                          { label: 'Consistency', score: 4.5 },
                          { label: 'Authority', score: 4.3 },
                          { label: 'Originality', score: 4.6 }
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 mb-1.5">{metric.label}</div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full score-bar bg-[#FF6A00]"
                                  style={{ '--score-width': `${(metric.score / 5) * 100}%` } as React.CSSProperties}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{metric.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Excellence Analysis */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Technical Excellence</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Accuracy and technical details</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                            <span className="text-sm font-medium text-orange-600">{product.metrics.aiConfidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Feature Accuracy', score: 4.4 },
                          { label: 'Detail Quality', score: 4.6 },
                          { label: 'SEO Optimization', score: 4.3 },
                          { label: 'Technical Clarity', score: 4.5 }
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-700 mb-1.5">{metric.label}</div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full score-bar bg-[#FF6A00]"
                                  style={{ '--score-width': `${(metric.score / 5) * 100}%` } as React.CSSProperties}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{metric.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Share Feedback Section */}
                <section className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                          </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-semibold text-gray-900">Share Your Experience</h3>
                        <p className="text-sm text-gray-500">Rate the content quality and provide feedback to help us improve</p>
                          </div>
                        </div>
                      </div>

                  <div className="space-y-6">
                    {/* Rating Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Content Quality', icon: FileText, key: 'contentQuality', description: 'Overall content effectiveness' },
                        { label: 'Creativity', icon: Sparkles, key: 'creativity', description: 'Uniqueness and innovation' },
                        { label: 'Performance', icon: Zap, key: 'generationSpeed', description: 'Generation speed and efficiency' },
                        { label: 'Accuracy', icon: Target, key: 'contentAccuracy', description: 'Information precision' }
                      ].map((category) => (
                        <div key={category.key} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                              <category.icon className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{category.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{category.description}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => {
                                  setFeedback(prev => ({ ...prev, [category.key as keyof FeedbackState]: rating }))
                                if (window.navigator.vibrate) {
                                  window.navigator.vibrate(50)
                                }
                              }}
                              className={cn(
                                  "flex-1 h-8 rounded-md text-xs font-medium transition-all duration-200",
                                  rating <= (feedback[category.key as keyof FeedbackState] as number)
                                    ? "bg-[#FF6A00] text-white shadow-sm"
                                    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-[#FF6A00]"
                                )}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                      ))}
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      {showThankYou ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h4>
                          <p className="text-sm text-gray-500 max-w-sm">
                            Your feedback is valuable and helps us improve our content generation.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900">Additional Comments</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Share your thoughts or suggestions for improvement</p>
                      </div>
                        <Textarea
                          value={feedback.comments}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value.length <= 500) {
                              setFeedback(prev => ({ ...prev, comments: value }))
                            }
                          }}
                            placeholder="What did you like? What could be improved?"
                            className="min-h-[100px] resize-none bg-gray-50 border-gray-200 text-sm"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">Be specific and constructive</span>
                            <span className="text-xs text-gray-500">{feedback.comments.length}/500 characters</span>
                        </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button 
                        variant="outline"
                        className="text-sm h-9 px-4"
                          disabled={!Object.values(feedback).some(value => value !== 0 && value !== '')}
                        onClick={() => {
                              setFeedback({
                                contentQuality: 0,
                                creativity: 0,
                                generationSpeed: 0,
                                contentAccuracy: 0,
                                comments: ''
                              })
                        }}
                      >
                        Reset
                        </Button>
                        <Button 
                        className="bg-[#FF6A00] text-white hover:bg-[#FF6A00]/90 text-sm h-9 px-4 shadow-sm"
                          disabled={!Object.values(feedback).some(value => value !== 0 && value !== '')}
                        onClick={handleFeedbackSubmit}
                      >
                        Submit Feedback
                        </Button>
                      </div>
                        </div>
                </section>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}