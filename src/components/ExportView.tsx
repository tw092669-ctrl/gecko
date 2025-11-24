import React, { forwardRef } from 'react';
import { Product, Category } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface ExportViewProps {
  products: Product[];
  categories: Category[];
  totalValue: number;
}

// ForwardRef allows the parent to grab the DOM element of this component to pass to html2canvas
export const ExportView = forwardRef<HTMLDivElement, ExportViewProps>(({ products, categories, totalValue }, ref) => {
  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div ref={ref} className="bg-white p-8 w-[800px] mx-auto hidden absolute top-[-9999px] left-[-9999px]" id="export-container">
      <div className="flex justify-between items-end mb-6 border-b-2 border-indigo-600 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">產品價格表</h1>
          <p className="text-slate-500 text-sm mt-1">由 小隼詢價助手 產生</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase tracking-wide">總庫存價值</p>
          <p className="text-2xl font-bold text-indigo-600">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 px-2 text-sm font-semibold text-slate-600 uppercase">產品</th>
            <th className="py-3 px-2 text-sm font-semibold text-slate-600 uppercase">品牌</th>
            <th className="py-3 px-2 text-sm font-semibold text-slate-600 uppercase">能力</th>
            <th className="py-3 px-2 text-sm font-semibold text-slate-600 uppercase">分類</th>
            <th className="py-3 px-2 text-sm font-semibold text-slate-600 uppercase text-right">價格</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="py-3 px-2 border-b border-slate-100">
                <div className="font-medium text-slate-800">{product.name}</div>
                {product.description && <div className="text-xs text-slate-500 mt-0.5">{product.description}</div>}
              </td>
              <td className="py-3 px-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">{product.brand || '-'}</span>
              </td>
              <td className="py-3 px-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">{product.ability || '-'}</span>
              </td>
              <td className="py-3 px-2 border-b border-slate-100">
                <CategoryBadge category={getCategory(product.categoryId)} />
              </td>
              <td className="py-3 px-2 border-b border-slate-100 text-right font-mono text-slate-700">
                ${product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400">
        <span>{new Date().toLocaleDateString()}</span>
        <span>第 1 頁，共 1 頁</span>
      </div>
    </div>
  );
});

ExportView.displayName = 'ExportView';