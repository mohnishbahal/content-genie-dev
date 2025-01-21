export type GenerationMode = 'single' | 'bulk';

export interface QueuedProduct {
  id: string;
  images: File[];
  previews: string[];
  tone: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type?: 'csv' | 'images';
}

export interface ContentMetrics {
  aiConfidence: number;
  readabilityScore: number;
  seoScore: number;
  toneMatch: number;
  uniqueness: number;
}

export interface ContentTip {
  type: 'improvement' | 'success';
  message: string;
}

export interface GeneratedContent {
  id: string;
  content: string;
  title?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  [key: string]: any; // For any additional fields returned by the API
}

export interface BulkGenerationResult {
  successful: GeneratedContent[];
  failed: { productId: string; error: string; }[];
}

export interface ToneOption {
  id: string
  name: string
  description: string
} 