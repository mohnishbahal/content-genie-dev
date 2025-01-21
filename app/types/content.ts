export interface ProductInfo {
  closure: string;
  design: string;
  length: string;
  material: string;
  occasion: string;
  style: string;
  pattern: string;
  fit: string;
  color: string;
  trend: string;
  neckType: string;
  neckLine: string;
  sleeveLength: string;
  hemline: string;
}

export interface GeneratedContent {
  title: string;
  seoKeywords: string[];
  description: string;
  highlights: string[];
  matchIdeas: string;
  productFeatures: string[];
  productInfo: ProductInfo;
} 