'use client'

import { useState, useEffect } from 'react'
import { GenerationMode, QueuedProduct, GeneratedContent } from '@/types/generate'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '@/components/header'
import { useRouter } from 'next/navigation'
import { SingleUploadForm } from '@/components/single-upload-form'
import { BulkUploadForm } from '@/components/bulk-upload-form'
import { AnimatedGrid } from '@/components/animated-grid'
import { toneOptions } from '@/constants/tones'
import { Sparkles, Upload, Layers, ArrowRight, Zap, Star, Clock, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productCategories } from '@/constants/categories'
import {ContentService} from '@/lib/contentService'
import {TemplateService} from '@/lib/templateService'

const contentService = new ContentService();
const templateService = new TemplateService();

export default function GeneratePage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string[]>([])
  const [selectedTone, setSelectedTone] = useState<string>('professional')
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [mode, setMode] = useState<GenerationMode>('single')
  const [queue, setQueue] = useState<QueuedProduct[]>([])
  const [processing, setProcessing] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [productTemplate, setProductTemplate] = useState<string[]>([])

  const loadingMessages = [
    'Analyzing your image...',
    'Getting creative...',
    'Crafting the perfect description...',
    'Adding a touch of magic...',
    'Almost there...',
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
      setLoadingMessageIndex(0)
    }
  }, [loading])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      if (mode === 'single') {
        setFiles([])
        setPreviews([])
        setImageName([])
      }

      setFiles(prevFiles => [...prevFiles, ...selectedFiles])
      
      selectedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          console.log(reader.result)
          setPreviews(prev => [...prev, reader.result as string])
          setImageName(prev =>[...prev,file.name])
        }
        reader.onerror = () => {
          setError('Failed to read image file')
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (droppedFiles.length > 0) {
      if (mode === 'single') {
        setFiles(droppedFiles)
        setPreviews([])
        setImageName([])
        
        droppedFiles.forEach(file => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result as string])
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const handleBoxClick = () => {
    document.getElementById('image-upload')?.click()
  }

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setImageName(prev => prev.filter((_, i) => i !== index))
  }

  const addToQueue = (files: File[], previews: string[], tone: string, type: 'csv' | 'images' = 'images') => {
    const newProduct: QueuedProduct = {
      id: uuidv4(),
      images: files,
      previews: previews,
      tone: tone,
      status: 'pending',
      type: type
    }
    setQueue(prev => [...prev, newProduct])
    
    setFiles([])
    setPreviews([])
    setImageName([])
    setSelectedTone('professional')
  }

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'single') {
      if (files.length === 0) {
        setError('Please upload at least one image')
        return
      }
      await handleSingleGeneration()
    } else {
      if (queue.length === 0) {
        setError('Please add at least one product')
        return
      }
      await handleBulkGeneration()
    }
  }

  const handleSingleGeneration = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // const formData = new FormData()
      // files.forEach((file, index) => {
      //   formData.append(`image${index}`, file)
      // })
      // formData.append('tone', selectedTone)
      // previews.map(image => console.log("image",image));
      
      localStorage.setItem('uploadedImages', JSON.stringify(previews))
      localStorage.setItem('imageName', JSON.stringify(imageName))
      localStorage.setItem('tone',selectedTone)
      localStorage.setItem('category',selectedCategory)

      // formData.append('image',imageName[0])
      // formData.append('tone',selectedTone)
      // formData.append('aiModel',"o1-mini")
      const formInfo = {
        image : imageName,
        aiModel: 'gemini-1.5',
        tone: selectedTone,
        templateName: selectedCategory
      }
      // const response = await fetch('http://127.0.0.1:5000/generate', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Accept': 'application/json',
      //   },
      // })
      
      const response = await contentService.generateContent(formInfo)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      } 
      const data = await response.json()
      // console.log("Response ",data)
      localStorage.setItem('contentId', data.id)
      localStorage.setItem('generatedContent', JSON.stringify(data));
      router.push('/generate/result')
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkGeneration = async () => {
    if (queue.length === 0) return
    
    setProcessing(true)
    setError(null)

    try {
      const results = await Promise.allSettled(
        queue.map(async (product) => {
          const formData = new FormData()
          product.images.forEach((file, index) => {
            formData.append(`image${index}`, file)
          })
          formData.append('tone', product.tone)
          
          // const response = await fetch('http://127.0.0.1:5000/generate', {
          //   method: 'POST',
          //   body: formData,
          // })

          // if (!response.ok) {
          //   throw new Error(`Failed to generate content for product ${product.id}`)
          // }

          // return await response.json()
          return
        })
      )

      // Process results
      const successful: GeneratedContent[] = []
      const failed: { productId: string; error: string }[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value)
          setQueue(prev => prev.map((item, i) => 
            i === index ? { ...item, status: 'completed', result: result.value } : item
          ))
        } else {
          failed.push({
            productId: queue[index].id,
            error: result.reason.message
          })
          setQueue(prev => prev.map((item, i) => 
            i === index ? { ...item, status: 'failed', error: result.reason.message } : item
          ))
        }
      })

      localStorage.setItem('bulkGenerationResults', JSON.stringify({ successful, failed }))
      router.push('/generate/bulk-result')
    } catch (error: any) {
      setError('Failed to process bulk generation')
    } finally {
      setProcessing(false)
    }
  }

  const getModeStyles = (id: string, currentMode: string) => {
    if (id === 'single') {
      return currentMode === id
        ? 'border-orange-500 bg-orange-50'
        : 'border-gray-200 hover:border-orange-200'
    }
    return currentMode === id
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-200 hover:border-blue-200'
  }

  const getIconContainerStyles = (id: string, currentMode: string) => {
    if (id === 'single') {
      return currentMode === id ? 'bg-orange-100' : 'bg-gray-100'
    }
    return currentMode === id ? 'bg-blue-100' : 'bg-gray-100'
  }

  const getIconStyles = (id: string, currentMode: string) => {
    if (id === 'single') {
      return currentMode === id ? 'text-orange-600' : 'text-gray-600'
    }
    return currentMode === id ? 'text-blue-600' : 'text-gray-600'
  }

  const getIndicatorStyles = (id: string) => {
    return id === 'single' ? 'bg-orange-500' : 'bg-blue-500'
  }

  const BulkUploadSection = () => {
    return (
      <div>
        <button
          onClick={(e) => {
            e.preventDefault() // Prevent event bubbling
            e.stopPropagation()
            setIsAddProductOpen(true)
          }}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg
                    hover:bg-orange-600 transition-colors"
        >
          Add Product
        </button>
        
        {/* Rest of your bulk upload section */}
      </div>
    )
  }

  useEffect(() => {
    const fetchTemplates = async () => {
        try {
            const formInfo = {
              concept_name:"Max"
            }
            const response = await templateService.getTemplate(formInfo);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            const template_name = data.map((item, index) => {
              return item.template_name
            });
            // console.log(`Item`, template_name);
            setProductTemplate(template_name);
            // localStorage.setItem("productTemplate",data)
        } catch (error: any) {
            console.error("Error fetching categories:", error);   
        }
    };

    fetchTemplates();
}, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="py-8 relative">
        <AnimatedGrid />
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              {/* Title and Description */}
              <div className="text-left">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  AI-Powered Content Generator
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base text-gray-600"
                >
                  Create captivating product descriptions in seconds. No more writer's block, just brilliant content that sells.
                </motion.p>
              </div>

              {/* Process Steps */}
              <div className="bg-white rounded-2xl border p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Three Simple Steps to Amazing Content</h2>
                </div>
                <div className="space-y-8">
                  {[
                    {
                      step: 1,
                      title: 'Drop Your Images',
                      description: 'Simply upload your product photos. We support all major image formats. Ensure your images are clear and decent-quality.',
                      icon: Upload
                    },
                    {
                      step: 2,
                      title: 'Pick Your Style',
                      description: 'Choose a tone that reflects your brand personality - from professional to casual. We offer a range of options to suit your brand voice.',
                      icon: MessageSquare
                    },
                    {
                      step: 3,
                      title: 'Get Instant Results',
                      description: 'Get AI-optimized product descriptions instantly. Watch as AI crafts perfect product descriptions tailored to your brand',
                      icon: Sparkles
                    }
                  ].map(({ step, title, description, icon: Icon }, index) => (
                    <div key={step} className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-lg font-medium">
                        {step}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-1.5 rounded-lg bg-orange-50">
                            <Icon className="w-4 h-4 text-orange-500" />
                          </div>
                          <h3 className="text-base font-medium text-gray-900">{title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-white rounded-2xl border p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Star className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Why Content Genie?</h2>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { 
                      icon: Zap, 
                      value: '< 10s', 
                      label: 'Generation Time',
                      sublabel: '(Lightning Fast)'
                    },
                    { 
                      icon: Star, 
                      value: '95%', 
                      label: 'Great Quality Score',
                      sublabel: '(Best In Class)'
                    },
                    { 
                      icon: Clock, 
                      value: '30m', 
                      label: 'Avg. Time Saved',
                      sublabel: '(Quick & Easy)'
                    }
                  ].map(({ icon: Icon, value, label, sublabel }) => (
                    <div key={label} className="text-center">
                      <div className="inline-flex p-3 rounded-xl bg-orange-50 mb-3">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="text-xs text-gray-500">{sublabel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white rounded-xl border shadow-sm lg:sticky lg:top-6">
              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-4 p-6">
                {[
                  {
                    id: 'single',
                    icon: Upload,
                    title: 'Single Product',
                    description: 'Generate for one item'
                  },
                  {
                    id: 'bulk',
                    icon: Layers,
                    title: 'Bulk Generation',
                    description: 'Generate for multiple items'
                  }
                ].map(({ id, icon: Icon, title, description }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode(id as GenerationMode)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${getModeStyles(id, mode)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        id === 'bulk' ? 'bg-blue-100/50' : getIconContainerStyles(id, mode)
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          id === 'bulk' ? 'text-blue-500' : getIconStyles(id, mode)
                        }`} />
                      </div>
                      <div className="text-left relative z-10">
                        <div className="font-medium text-gray-900 text-sm">{title}</div>
                        <p className="text-xs text-blue-600">{id === 'bulk' ? description : <span className="text-gray-600">{description}</span>}</p>
                      </div>
                    </div>
                    {mode === id && id === 'single' && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${getIndicatorStyles(id)}`}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="p-6 border-t">
                {mode === 'single' ? (
                  <SingleUploadForm
                    files={files}
                    previews={previews}
                    selectedTone={selectedTone}
                    selectedCategory={selectedCategory}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onFileChange={handleFileChange}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onBoxClick={handleBoxClick}
                    onRemoveImage={removeImage}
                    loadingMessage={loadingMessages[loadingMessageIndex]}
                    onToneChange={setSelectedTone}
                    onCategoryChange={setSelectedCategory}
                    toneOptions={toneOptions}
                    productTemplate = {productTemplate}
                  />
                ) : (
                  <BulkUploadForm
                    queue={queue}
                    onAddToQueue={addToQueue}
                    onRemoveFromQueue={removeFromQueue}
                    processing={processing}
                    onSubmit={handleSubmit}
                    files={files}
                    previews={previews}
                    selectedTone={selectedTone}
                    onFileChange={handleFileChange}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onBoxClick={handleBoxClick}
                    onRemoveImage={removeImage}
                    onToneChange={setSelectedTone}
                    toneOptions={toneOptions}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-white border border-red-100 text-red-600 p-4 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add New Product"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Product Image
            </label>
            <div
              onClick={handleBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center
                       hover:border-orange-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                id="image-upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Upload files or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">Select Template</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a product template" />
              </SelectTrigger>
              <SelectContent>
                {productTemplate.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tone of Voice
            </label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`p-3 rounded-lg border text-left transition-colors
                            ${selectedTone === tone.id 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="font-medium text-xs">{tone.name}</div>
                  <div className="text-[11px] text-gray-500">{tone.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              addToQueue(files, previews, selectedTone)
              setIsAddProductOpen(false)
            }}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg
                      hover:bg-orange-600 transition-colors"
          >
            Add to Queue
          </button>
        </div>
      </Modal>
    </div>
  )
}

