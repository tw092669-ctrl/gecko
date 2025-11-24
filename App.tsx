import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, Plus, Filter, Download, Sparkles, TrendingUp, Trash2, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import { Category, Product, AIAnalysisResult } from './types';
import { ProductForm } from './components/ProductForm';
import { CategoryBadge } from './components/CategoryBadge';
import { Button } from './components/ui/Button';
import { analyzeInventory } from './services/geminiService';
import { InventoryChart } from './components/InventoryChart';
import { ExportView } from './components/ExportView';

// Initial Data
const initialCategories: Category[] = [
  { id: '1', name: '電子產品', color: '#6366f1' }, // Indigo
  { id: '2', name: '家具', color: '#10b981' },   // Emerald
  { id: '3', name: '辦公用品', color: '#f59e0b' },      // Amber
  { id: '4', name: '能力', color: '#ec4899' },      // Pink
];

const initialBrands: string[] = ['Logitech', 'Dell', 'IKEA', 'Apple', '小米'];
const initialAbilities: string[] = ['基本', '進階', '專業', '多功能', '節能'];

const initialProducts: Product[] = [
  { id: '101', name: '人體工學椅', price: 250, categoryId: '2', brand: 'Herman Miller', ability: '專業', updatedAt: Date.now() },
  { id: '102', name: '機械式鍵盤', price: 130, categoryId: '1', brand: 'Logitech', ability: '進階', updatedAt: Date.now() },
  { id: '103', name: '27吋 4K 螢幕', price: 399, categoryId: '1', brand: 'Dell', ability: '多功能', updatedAt: Date.now() },
  { id: '104', name: '筆記本套組', price: 15, categoryId: '3', brand: '無印良品', ability: '基本', updatedAt: Date.now() },
];

const App: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [brands, setBrands] = useState<string[]>(() => {
    const saved = localStorage.getItem('brands');
    return saved ? JSON.parse(saved) : initialBrands;
  });
  const [abilities, setAbilities] = useState<string[]>(() => {
    const saved = localStorage.getItem('abilities');
    return saved ? JSON.parse(saved) : initialAbilities;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Refs
  const exportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('abilities', JSON.stringify(abilities));
  }, [abilities]);

  // Handlers
  const handleAddProduct = (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      updatedAt: Date.now(),
    };
    setProducts([newProduct, ...products]);
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('確定要刪除此產品嗎？')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCat: Category = { id: Date.now().toString(), name, color };
    setCategories([...categories, newCat]);
    return newCat.id;
  };

  const handleAddBrand = (name: string) => {
    if (!brands.includes(name)) {
      setBrands([...brands, name]);
    }
  };

  const handleRemoveBrand = (name: string) => {
    setBrands(brands.filter(b => b !== name));
  };

  const handleAddAbility = (name: string) => {
    if (!abilities.includes(name)) {
      setAbilities([...abilities, name]);
    }
  };

  const handleRemoveAbility = (name: string) => {
    setAbilities(abilities.filter(a => a !== name));
  };

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeInventory(products, categories);
    setAiResult(result);
    setIsAnalyzing(false);
  };

  const handleExportImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    // Temporarily make the export container visible for capture (trick)
    const container = exportRef.current;
    container.style.display = 'block';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '-100';

    try {
      const canvas = await html2canvas(container, {
        scale: 2, // Retina quality
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `PriceTag_Inventory_${new Date().toISOString().slice(0,10)}.png`;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("匯出圖片失敗。");
    } finally {
      container.style.display = 'none'; // Hide again
      setIsExporting(false);
    }
  };

  // Excel Import Logic
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const getRandomColor = () => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('Excel 檔案中沒有資料');
          return;
        }

        const newProducts: Product[] = [];
        const newBrands = new Set(brands);
        const newAbilities = new Set(abilities);
        const currentCategories = [...categories]; // Clone to mutate locally first
        let addedCount = 0;

        // Helper to find or create category
        const getCategoryId = (catName: string): string => {
          if (!catName) return currentCategories[0].id; // Default to first if empty
          
          const existing = currentCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
          if (existing) return existing.id;

          // Create new category
          const newCat: Category = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            name: catName,
            color: getRandomColor()
          };
          currentCategories.push(newCat);
          return newCat.id;
        };

        data.forEach((row: any) => {
          // Normalize keys: Check both English and Chinese headers
          const name = row['Name'] || row['name'] || row['產品名稱'] || row['名稱'];
          const priceRaw = row['Price'] || row['price'] || row['價格'] || row['金額'];
          const catName = row['Category'] || row['category'] || row['分類'] || row['類別'];
          const brandName = row['Brand'] || row['brand'] || row['品牌'];
          const abilityName = row['Ability'] || row['ability'] || row['能力'];
          const desc = row['Description'] || row['description'] || row['描述'] || row['備註'];

          if (name && priceRaw !== undefined) {
            const price = parseInt(String(priceRaw).replace(/[^0-9]/g, '')) || 0;
            const categoryId = getCategoryId(catName?.toString().trim());
            
            // Handle Brand
            let finalBrand = undefined;
            if (brandName) {
              const b = brandName.toString().trim();
              newBrands.add(b);
              finalBrand = b;
            }

            // Handle Ability
            let finalAbility = undefined;
            if (abilityName) {
              const a = abilityName.toString().trim();
              newAbilities.add(a);
              finalAbility = a;
            }

            newProducts.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: name.toString().trim(),
              price,
              categoryId,
              brand: finalBrand,
              ability: finalAbility,
              description: desc?.toString().trim(),
              updatedAt: Date.now()
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          // Update all states
          setCategories(currentCategories);
          setBrands(Array.from(newBrands));
          setAbilities(Array.from(newAbilities));
          setProducts(prev => [...newProducts, ...prev]);
          alert(`成功匯入 ${addedCount} 筆產品資料！`);
        } else {
          alert('未找到有效的產品資料。請確保 Excel 包含「產品名稱」與「價格」欄位。');
        }

      } catch (error) {
        console.error("Import Error:", error);
        alert("讀取檔案時發生錯誤，請檢查檔案格式。");
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  // Derived State
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.ability && p.ability.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = filteredProducts.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              小隼詢價助手
            </h1>
          </div>
          <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={handleImportClick}>
               <Upload size={16} className="mr-2" />
               匯入 Excel
             </Button>
             <Button variant="secondary" size="sm" onClick={handleExportImage} disabled={isExporting}>
               <Download size={16} className="mr-2" />
               {isExporting ? '匯出中...' : '匯出圖檔'}
             </Button>
             <Button size="sm" onClick={() => setIsFormOpen(!isFormOpen)}>
               {isFormOpen ? '關閉表單' : '新增產品'}
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Controls: Analysis & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Analysis Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                <h2 className="text-lg font-semibold">智慧分析</h2>
              </div>
              <Button size="sm" variant="secondary" onClick={handleAIAnalyze} isLoading={isAnalyzing}>
                分析
              </Button>
            </div>
            
            {aiResult ? (
              <div className="space-y-3 animate-fade-in">
                <p className="text-slate-600 text-sm leading-relaxed">{aiResult.summary}</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">管理建議</h4>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {aiResult.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">
                點擊分析以產生庫存摘要與建議。
              </p>
            )}
          </div>

          {/* Stats / Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-emerald-500" size={20} />
                <h2 className="text-lg font-semibold">分佈概況</h2>
              </div>
              <InventoryChart products={products} categories={categories} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">產品數量</p>
              <p className="text-2xl font-bold text-slate-800">{filteredProducts.length}</p>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        {isFormOpen && (
          <div className="animate-slide-down">
            <ProductForm 
              categories={categories} 
              brands={brands}
              abilities={abilities}
              onSave={handleAddProduct} 
              onCancel={() => setIsFormOpen(false)}
              onAddCategory={handleAddCategory}
              onAddBrand={handleAddBrand}
              onRemoveBrand={handleRemoveBrand}
              onAddAbility={handleAddAbility}
              onRemoveAbility={handleRemoveAbility}
            />
          </div>
        )}

        {/* Filters & List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜尋產品、品牌或能力..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="text-slate-400" size={18} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:w-48 px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="all">所有分類</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid/List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">產品</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">品牌</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">能力</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">分類</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">價格</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{product.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.brand ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                              {product.brand}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.ability ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {product.ability}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <CategoryBadge category={categories.find(c => c.id === product.categoryId)} />
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-700">
                          ${product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="刪除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                          <Package size={48} className="mb-2 opacity-20" />
                          <p>找不到產品。</p>
                          <p className="text-xs mt-1">調整篩選條件或新增產品。</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      {/* Hidden Export View (Rendered only for html2canvas) */}
      <ExportView 
        ref={exportRef} 
        products={filteredProducts} 
        categories={categories} 
        totalValue={totalValue} 
      />
    </div>
  );
};

export default App;