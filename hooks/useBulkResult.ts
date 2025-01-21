import { useState, useCallback } from 'react'
import { BulkGenerationResult, GeneratedContent, EditableContentState, RegeneratingStates } from '@/types/bulk-result'

export function useBulkResult() {
  const [results, setResults] = useState<BulkGenerationResult | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const [regeneratingStates, setRegeneratingStates] = useState<RegeneratingStates>({})
  const [editableStates, setEditableStates] = useState<Record<string, EditableContentState>>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [reviewedProducts, setReviewedProducts] = useState<Set<number>>(new Set())

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

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
    } catch (err) {
      console.error('Failed to regenerate:', err)
    } finally {
      setRegeneratingStates(prev => ({ ...prev, [`${section}-${index}`]: false }))
    }
  }, [results])

  const handleEdit = useCallback((sectionId: string, content: string | string[]) => {
    setEditableStates(prev => ({
      ...prev,
      [sectionId]: {
        isEditing: true,
        content
      }
    }))
  }, [])

  return {
    results,
    setResults,
    copiedStates,
    regeneratingStates,
    editableStates,
    setEditableStates,
    activeIndex,
    setActiveIndex,
    reviewedProducts,
    setReviewedProducts,
    handleCopy,
    handleRegenerate,
    handleEdit
  }
} 