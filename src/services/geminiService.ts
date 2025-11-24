import { GoogleGenAI, Type } from "@google/genai";
import { Product, Category, AIAnalysisResult } from "../types";

// Helper to get API Key safely in different environments
const getApiKey = () => {
  // 1. Try Vite environment variable (for Vercel/Cloud)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try standard process.env (for Local/Node)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  return '';
};

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const analyzeInventory = async (products: Product[], categories: Category[]): Promise<AIAnalysisResult> => {
  try {
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);

    const inventoryData = products.map(p => ({
      name: p.name,
      price: p.price,
      brand: p.brand || 'Unknown',
      ability: p.ability || 'None',
      category: categoryMap[p.categoryId] || 'Unknown',
    }));

    const prompt = `
      請分析以下的庫存數據。
      1. 提供庫存組成的簡短摘要（包含品牌與能力分佈情況）。
      2. 計算總價值（所有價格的總和）。
      3. 提供 3 個針對此庫存組合的具體管理建議（例如：定價策略、分類平衡、品牌多樣性）。
      
      請使用繁體中文回答。
      
      庫存數據:
      ${JSON.stringify(inventoryData)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            totalValue: { type: Type.NUMBER },
            insights: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "totalValue", "insights"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails or key is missing
    const total = products.reduce((sum, p) => sum + p.price, 0);
    return {
      summary: "無法取得庫存分析（請檢查 API Key 或網路連線）。",
      totalValue: total,
      insights: ["確保所有產品都有分類與品牌資訊。", "定期更新價格資訊。", "定期備份您的資料。"]
    };
  }
};