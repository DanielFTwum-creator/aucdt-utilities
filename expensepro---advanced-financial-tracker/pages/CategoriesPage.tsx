
import React from 'react';
import { Plus, Edit2, Trash2, Tag, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface CategoriesPageProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, setCategories }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-500">Organize your expenses with custom categories and colors.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: `${cat.color}15`}}>
                  <Tag className="w-6 h-6" style={{color: cat.color}} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{cat.name}</h4>
                  <p className="text-xs text-gray-500">ID: {cat.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-100 shadow-inner" style={{backgroundColor: cat.color}}></div>
                <span className="font-mono">{cat.color}</span>
              </div>
              <button className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline">
                View transactions <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
