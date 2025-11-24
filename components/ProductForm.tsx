import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { Button } from './ui/Button';
import { Plus, Save, X, Trash2 } from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  brands: string[];
  abilities: string[];
  onSave: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  onCancel: () => void;
  onAddCategory: (name: string, color: string) => void;
  onAddBrand: (name: string) => void;
  onRemoveBrand: (name: string) => void;
  onAddAbility: (name: string) => void;
  onRemoveAbility: (name: string) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  categories, 
  brands,
  abilities,
  onSave, 
  onCancel, 
  onAddCategory,
  onAddBrand,
  onRemoveBrand,
  onAddAbility,
  onRemoveAbility
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brand, setBrand] = useState('');
  const [ability, setAbility] = useState('');
  const [description, setDescription] = useState('');
  
  // Category UI state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  // Brand UI state
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  // Ability UI state
  const [isAddingAbility, setIsAddingAbility] = useState(false);
  const [newAbilityName, setNewAbilityName] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price: parseInt(price) || 0,
      categoryId,
      brand: brand || undefined,
      ability: ability || undefined,
      description
    });
    setName('');
    setPrice('');
    setDescription('');
    setBrand('');
    setAbility('');
  };

  const handleAddCategory = () => {
    if (newCatName) {
      onAddCategory(newCatName, newCatColor);
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const handleAddBrand = () => {
    if (newBrandName) {
      onAddBrand(newBrandName);
      setBrand(newBrandName); // Auto select the new brand
      setNewBrandName('');
      setIsAddingBrand(false);
    }
  };

  const handleRemoveBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (brand && confirm(`確定要從清單中移除 "${brand}" 嗎？`)) {
      onRemoveBrand(brand);
      setBrand(''); // Reset to default option
    }
  };

  const handleAddAbility = () => {
    if (newAbilityName) {
      onAddAbility(newAbilityName);
      setAbility(newAbilityName); // Auto select
      setNewAbilityName('');
      setIsAddingAbility(false);
    }
  };

  const handleRemoveAbilityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ability && confirm(`確定要從清單中移除 "${ability}" 嗎？`)) {
      onRemoveAbility(ability);
      setAbility(''); // Reset to default option
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">新增產品</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">產品名稱</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="例如：無線滑鼠"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">價格 ($)</label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">品牌</label>
            {!isAddingBrand ? (
              <div className="flex gap-2 w-full">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">選擇品牌</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={handleRemoveBrandClick}
                  disabled={!brand}
                  className={`p-2 rounded-lg border border-slate-200 flex-shrink-0 ${
                    brand 
                      ? 'bg-white text-slate-400 hover:text-red-500 hover:border-red-200 cursor-pointer' 
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                  title="移除選中的品牌"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingBrand(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex-shrink-0"
                  title="新增品牌"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="新品牌名稱"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <button 
                  type="button" 
                  onClick={handleAddBrand}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm whitespace-nowrap flex-shrink-0"
                >
                  新增
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingBrand(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">能力</label>
            {!isAddingAbility ? (
              <div className="flex gap-2 w-full">
                <select
                  value={ability}
                  onChange={(e) => setAbility(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">選擇能力</option>
                  {abilities.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={handleRemoveAbilityClick}
                  disabled={!ability}
                  className={`p-2 rounded-lg border border-slate-200 flex-shrink-0 ${
                    ability 
                      ? 'bg-white text-slate-400 hover:text-red-500 hover:border-red-200 cursor-pointer' 
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                  title="移除選中的能力"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingAbility(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex-shrink-0"
                  title="新增能力"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="新能力"
                  value={newAbilityName}
                  onChange={(e) => setNewAbilityName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <button 
                  type="button" 
                  onClick={handleAddAbility}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm whitespace-nowrap flex-shrink-0"
                >
                  新增
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingAbility(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
            {!isAddingCategory ? (
              <div className="flex gap-2 w-full">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="" disabled>選擇分類</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex-shrink-0"
                  title="新增分類"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 z-10 relative">
                <input
                  type="text"
                  placeholder="新分類名稱"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="text-sm px-2 py-1 border rounded"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                  />
                  <div className="flex gap-1 flex-1 justify-end">
                    <button type="button" onClick={() => setIsAddingCategory(false)} className="text-xs text-slate-500 hover:text-slate-700 px-2">取消</button>
                    <button type="button" onClick={handleAddCategory} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">新增</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">描述（選填）</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-