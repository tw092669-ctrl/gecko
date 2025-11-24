import React from 'react';
import { Category } from '../types';

interface CategoryBadgeProps {
  category?: Category;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (!category) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
        未分類
      </span>
    );
  }

  // Generate a soft background color based on the hex string if possible, or fallback
  const style = {
    backgroundColor: `${category.color}20`, // 20 hex = ~12% opacity
    color: category.color,
    border: `1px solid ${category.color}40`
  };

  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={style}
    >
      {category.name}
    </span>
  );
};