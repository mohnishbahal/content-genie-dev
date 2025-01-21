'use client'

import { useState, useCallback } from 'react'
import { QueuedProduct, ToneOption } from '@/types/generate'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Upload, FileSpreadsheet } from 'lucide-react'
import { AnimatedText } from '@/components/animated-text'
import * as Dialog from '@radix-ui/react-dialog'
import { SingleUploadForm } from './single-upload-form'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BulkUploadFormProps {
  queue: QueuedProduct[]
  onAddToQueue: (files: File[], previews: string[], tone: string, type?: 'csv' | 'images') => void
  onRemoveFromQueue: (id: string) => void
  processing: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  files: File[]
  previews: string[]
  selectedTone: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onBoxClick: () => void
  onRemoveImage: (index: number) => void
  onToneChange: (tone: string) => void
  toneOptions: ToneOption[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  productTemplate?: string[]
}

export function BulkUploadForm({
  queue,
  onAddToQueue,
  onRemoveFromQueue,
  processing,
  onSubmit,
  files,
  previews,
  selectedTone,
  onFileChange,
  onDragOver,
  onDrop,
  onBoxClick,
  onRemoveImage,
  onToneChange,
  toneOptions,
  selectedCategory,
  onCategoryChange,
  productTemplate
}: BulkUploadFormProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const truncateFilename = (filename: string, maxLength: number = 30) => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 4); // -4 for "..." and "."
    return `${truncatedName}...${extension}`;
  };

  const handleAddProduct = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (files.length > 0) {
      onAddToQueue(files, previews, selectedTone, 'images')
      setShowAddDialog(false)
      
      // Reset form
      const emptyFileList = new DataTransfer().files
      onFileChange({ target: { files: emptyFileList } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [files, previews, selectedTone, onAddToQueue, onFileChange])

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    }
  }

  const handleCsvSubmit = () => {
    if (csvFile) {
      // Create a preview for CSV file with explicit type
      const csvProduct = {
        id: Date.now().toString(),
        images: [csvFile],
        previews: [],
        tone: selectedTone,
        status: 'pending',
        type: 'csv' as const
      }
      onAddToQueue([csvFile], [], selectedTone, 'csv')  // Pass type to onAddToQueue
      setCsvFile(null)
      setShowAddDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Removed text section as per instructions */}

      <div className="space-y-4">
        {queue.map((product) => (
          <div 
            key={product.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {product.type === 'csv' ? (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                  <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                </div>
              ) : product.previews[0] ? (
                <img 
                  src={product.previews[0]} 
                  alt="Product preview" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : null}
              <div>
                <p className="font-medium">
                  {product.type === 'csv' ? 
                    `CSV: ${product.images[0]?.name ? truncateFilename(product.images[0].name) : 'Untitled'}` : 
                    `Product ${queue.indexOf(product) + 1}`}
                </p>
                <p className="text-sm text-gray-500">
                  {product.type === 'csv' ? 
                    'Bulk product data' : 
                    `${product.images.length} images`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${
                product.status === 'completed' ? 'text-green-500' :
                product.status === 'failed' ? 'text-red-500' :
                product.status === 'processing' ? 'text-orange-500' :
                'text-gray-500'
              }`}>
                {product.status}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFromQueue(product.id)}
                disabled={processing}
              >
                ×
              </Button>
            </div>
          </div>
        ))}

        {queue.length < 10 && (
          <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
            <Dialog.Trigger asChild>
              <Button
                variant="outline"
                className="w-full h-24"
                disabled={processing}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content 
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[51]
                          w-full max-w-[600px] max-h-[90vh] bg-white rounded-xl shadow-lg
                          flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <Dialog.Title className="text-lg font-semibold">
                    Add New Product
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="rounded-full p-1 hover:bg-gray-100">
                      ×
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="images" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Images
                      </TabsTrigger>
                      <TabsTrigger value="csv" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Upload CSV
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="images">
                      <form onSubmit={handleAddProduct}>
                        <SingleUploadForm
                          wrapInForm={false}
                          files={files}
                          previews={previews}
                          selectedTone={selectedTone}
                          selectedCategory={selectedCategory}
                          loading={false}
                          onSubmit={handleAddProduct}
                          onFileChange={onFileChange}
                          onDragOver={onDragOver}
                          onDrop={onDrop}
                          onBoxClick={onBoxClick}
                          onRemoveImage={onRemoveImage}
                          onToneChange={onToneChange}
                          onCategoryChange={onCategoryChange}
                          loadingMessage="Adding product..."
                          inputId="bulk-product-upload"
                          toneOptions={toneOptions}
                          productTemplate={productTemplate}
                          hideTitle={true}
                        />
                      </form>
                    </TabsContent>

                    <TabsContent value="csv">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Upload CSV File</Label>
                            <a 
                              href="/sample-bulk-result.csv" 
                              download 
                              className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-500"
                            >
                              <FileSpreadsheet className="h-3 w-3" />
                              Get sample template
                            </a>
                          </div>
                          <div
                            onClick={() => document.getElementById('csv-upload')?.click()}
                            className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 cursor-pointer hover:border-orange-300 transition-colors"
                          >
                            <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="csv-upload"
                                className="text-orange-600 hover:text-orange-500 cursor-pointer"
                              >
                                Choose a CSV file
                                <Input
                                  id="csv-upload"
                                  type="file"
                                  accept=".csv"
                                  className="sr-only"
                                  onChange={handleCsvUpload}
                                />
                              </label>
                              <p className="pl-1">or drop it here</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Upload your product data in CSV format</p>
                            {csvFile && (
                              <div className="mt-4 text-sm text-gray-600">
                                Selected file: {csvFile.name}
                              </div>
                            )}
                          </div>
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
                          type="button"
                          className="w-full bg-orange-500 text-white hover:bg-orange-600"
                          disabled={!csvFile}
                          onClick={handleCsvSubmit}
                        >
                          Continue
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      <Button
        onClick={onSubmit}
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
        disabled={queue.length === 0 || processing}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing {queue.length} products...
          </>
        ) : (
          `Generate Content (${queue.length})`
        )}
      </Button>
    </div>
  )
} 