'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  primaryImage: string
  galleryImages: string[]
}

export const ImageGallery = ({ primaryImage, galleryImages }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const images = [primaryImage, ...galleryImages]

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100",
            "cursor-zoom-in transition-all duration-300",
            isZoomed && "cursor-zoom-out"
          )}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeImage]}
            alt="Product image"
            fill
            className={cn(
              "object-cover object-center transition-all duration-300",
              isZoomed && "scale-110"
            )}
            priority={activeImage === 0}
          />
          
          <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md transition-all",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                activeImage === index 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-opacity duration-200",
                  activeImage === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="relative w-full h-full min-h-[80vh]">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/90 hover:text-white z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <Image
              src={images[activeImage]}
              alt="Product image"
              fill
              className="object-contain"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 