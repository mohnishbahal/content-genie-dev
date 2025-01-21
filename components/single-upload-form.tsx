'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ToneOption } from '@/types/generate'
import { AnimatedText } from '@/components/animated-text'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { productCategories, productConcept } from '@/constants/categories'

interface SingleUploadFormProps {
  files: File[]
  previews: string[]
  selectedTone: string
  selectedCategory?: string
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onBoxClick: () => void
  onRemoveImage?: (index: number) => void
  loadingMessage?: string
  onToneChange: (tone: string) => void
  onCategoryChange?: (category: string) => void
  inputId?: string
  toneOptions: ToneOption[]
  hideTitle?: boolean
  wrapInForm?: boolean
  productTemplate?: string[]
}

export function SingleUploadForm({
  files,
  previews,
  selectedTone,
  selectedCategory = '',
  loading,
  onSubmit,
  onFileChange,
  onDragOver,
  onDrop,
  onBoxClick,
  onRemoveImage,
  loadingMessage = 'Processing...',
  onToneChange,
  onCategoryChange,
  inputId = 'image-upload',
  toneOptions,
  hideTitle = false,
  wrapInForm = true,
  productTemplate = []
}: SingleUploadFormProps) {

  const handleFileValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    // onFileChange(e)
    if (e.target.files) {
      // const fileNames = Array.from(e.target.files).map(file => file.name);
      onFileChange(e); // Call the original handler if needed
    }
  }

  const formContent = (
    <div className="space-y-6">
      

      <div>
        <Label className="text-sm font-medium">Upload Product Image</Label>
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onBoxClick()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDragOver(e)
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDrop(e)
          }}
          className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 cursor-pointer hover:border-orange-300 transition-colors"
        >
          <div className="text-center">
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      width={200} 
                      height={200} 
                      className="mx-auto rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveImage?.(index)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600 justify-center">
              <label 
                htmlFor={inputId}
                className="text-orange-600 hover:text-orange-500 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Upload files
                <Input
                  id={inputId}
                  name={inputId}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFileValidation(e)
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>
      </div>

      {/* <div className="space-y-3">
        <h3 className="text-lg font-medium">Select Concept</h3>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose product concept" />
          </SelectTrigger>
          <SelectContent>
            {productConcept.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Template</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a product template" />
          </SelectTrigger>
          <SelectContent>
            {(productTemplate || []).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tone of Voice</Label>
        <div className="grid grid-cols-2 gap-3">
          {Array.isArray(toneOptions) && toneOptions.map((tone) => (
            <div
              key={tone.id}
              className={`relative flex flex-col p-3 rounded-lg cursor-pointer transition-all ${
                selectedTone === tone.id 
                  ? 'bg-orange-50 border-2 border-orange-500' 
                  : 'border border-gray-200 hover:border-orange-200'
              }`}
              onClick={() => onToneChange(tone.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-sm font-medium ${
                  selectedTone === tone.id ? 'text-orange-700' : 'text-gray-900'
                }`}>
                  {tone.name}
                </p>
                {selectedTone === tone.id && (
                  <div className="h-2 w-2 bg-orange-500 rounded-full" />
                )}
              </div>
              <p className={`text-xs ${
                selectedTone === tone.id ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {tone.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Choose the tone that best matches your brand voice
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
        disabled={files.length === 0 || loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{loadingMessage}</span>
          </div>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  )

  return wrapInForm ? (
    <form onSubmit={onSubmit}>
      {formContent}
    </form>
  ) : formContent
} 