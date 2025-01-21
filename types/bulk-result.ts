import { BulkGenerationResult } from './generate'

export interface ContentMetrics {
  aiConfidence: number
  readabilityScore: number
  seoScore: number
  toneMatch: number
  uniqueness: number
}

export interface ContentTip {
  type: 'improvement' | 'success'
  message: string
}

export type GeneratedContent = {
  brand: string;
  category: string;
  title: string;
  description: string;
  images: {
    primary: string;
    gallery: string[];
  };
  metrics: {
    aiConfidence: number;
    readabilityScore: number;
    seoScore: number;
    toneMatch: number;
    uniqueness: number;
  };
  productFeatures: string[];
  seoKeywords: string[];
  highlights: string[];
  stylingTips?: string[];
  attributes: Record<string, string>;
  [key: string]: any;
}

export interface EditableContentState {
  isEditing: boolean
  content: string | string[]
}

export interface RegeneratingStates {
  [key: string]: boolean
}

export interface FeedbackState {
  rating: number | null
  tags: string[]
  comment: string
  status: 'idle' | 'submitting' | 'success' | 'error'
}

export interface ProductImages {
  primary: string
  gallery: string[]
}

export type ReviewStatus = 'pending' | 'reviewed' | 'skipped'

export type ReviewState = {
  status: 'reviewed' | 'skipped';
  timestamp: number;
} 