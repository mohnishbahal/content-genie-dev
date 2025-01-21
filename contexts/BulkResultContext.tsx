'use client'

import { createContext, useContext, useState } from 'react'
import { GeneratedContent, ReviewState } from '@/types/bulk-result'

interface FailedItem {
  originalTitle: string
  error: string
  timestamp: string
  errorType?: 'API Error' | 'Validation Error' | 'Network Error' | 'Unknown Error'
}

interface BulkResultContextType {
  results: {
    successful: GeneratedContent[];
    failed: FailedItem[];
  } | null;
  setResults: (results: {
    successful: GeneratedContent[];
    failed: FailedItem[];
  } | ((prev: {
    successful: GeneratedContent[];
    failed: FailedItem[];
  } | null) => {
    successful: GeneratedContent[];
    failed: FailedItem[];
  } | null)) => void;
  activeIndex: number;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  reviewStates: Record<number, ReviewState>;
  setReviewStates: (states: Record<number, ReviewState> | ((prev: Record<number, ReviewState>) => Record<number, ReviewState>)) => void;
}

const BulkResultContext = createContext<BulkResultContextType>({
  results: null,
  setResults: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  reviewStates: {},
  setReviewStates: () => {},
})

export const BulkResultProvider = ({ children }: { children: React.ReactNode }) => {
  const [results, setResults] = useState<{ successful: GeneratedContent[], failed: FailedItem[] } | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reviewStates, setReviewStates] = useState<Record<number, ReviewState>>({})

  return (
    <BulkResultContext.Provider
      value={{
        results,
        setResults,
        activeIndex,
        setActiveIndex,
        reviewStates,
        setReviewStates,
      }}
    >
      {children}
    </BulkResultContext.Provider>
  )
}

export const useBulkResult = () => useContext(BulkResultContext) 