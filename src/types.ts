export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  brand?: string;
  ability?: string;
  description?: string;
  updatedAt: number;
}

export interface AIAnalysisResult {
  summary: string;
  totalValue: number;
  insights: string[];
}