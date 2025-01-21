export class Content {
    title: string = '';
    description: string = '';
    seoKeywords: string[] = [];
    attributes: string[] = [];
    productInfo: ProductInfo | null = null;
}

export class ProductInfo {
    closure: string = '';
      design: string = '';
      length: string = '';
      material: string = '';
      occasion: string = '';
      sleeveLength: string = '';
      style: string = '';
      neckLine: string = '';
      neckType: string = '';
      pattern: string = '';
      hemline: string = '';
      fit: string = '';
      color: string = '';
      trend: string = '';
      matchIdeas: string = '';
      productFeatures: string[] = [];
}
