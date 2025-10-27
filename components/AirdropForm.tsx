"use client";

import { useState } from "react";

interface AirdropFormProps {
  onSubmit: (data: {
    name: string;
    url: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    progress: number;
    description?: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
  initialData?: Partial<{
    name: string;
    url: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    progress: number;
    description?: string;
    tags: string[];
  }>;
}

const categories = ['General', 'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'DAO', 'Social', 'Other'];

export default function AirdropForm({ onSubmit, onCancel, initialData }: AirdropFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Medium' as 'High' | 'Medium' | 'Low',
    description: initialData?.description || '',
    tags: initialData?.tags || []
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Airdrop' : 'Add New Airdrop'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-700 rounded-xl focus:outline-none input-focus bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                required
                placeholder="Enter airdrop name..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                URL
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                placeholder="Please enter a URL"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 focus:border-pink-400 dark:focus:border-pink-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 focus:border-pink-400 dark:focus:border-pink-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200 resize-none"
                rows={3}
                placeholder="Add a description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 focus:border-purple-400 dark:focus:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-pink-800 dark:text-pink-200 border border-pink-200 dark:border-pink-700 shadow-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-100 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {initialData ? '✨ Update Airdrop' : '🚀 Add Airdrop'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:from-gray-400 hover:to-gray-500 dark:hover:from-gray-500 dark:hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
