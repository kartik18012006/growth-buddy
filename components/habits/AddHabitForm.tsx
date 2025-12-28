/**
 * Add Habit Form Component
 * Modern form with soft colors and smooth animations
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddHabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => void;
}

const habitColors = [
  { name: 'Pink', value: '#FF6B9D' },
  { name: 'Purple', value: '#A78BFA' },
  { name: 'Blue', value: '#60A5FA' },
  { name: 'Green', value: '#34D399' },
  { name: 'Yellow', value: '#FBBF24' },
  { name: 'Orange', value: '#FB923C' },
  { name: 'Mint', value: '#4ADE80' },
  { name: 'Lavender', value: '#C084FC' },
];

export default function AddHabitForm({ isOpen, onClose, onSubmit }: AddHabitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: '#60A5FA',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', description: '', category: '', color: '#60A5FA' });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Form Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">New Habit</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="e.g., Morning Meditation"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    rows={3}
                    placeholder="Add a note about this habit..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="e.g., Health, Work, Self-care"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Color
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {habitColors.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'h-12 rounded-2xl relative transition-all',
                          'border-2 shadow-sm hover:shadow-md',
                          formData.color === color.value
                            ? 'border-gray-800 ring-4 ring-gray-200'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        style={{ backgroundColor: color.value }}
                      >
                        {formData.color === color.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <Plus className="w-4 h-4 text-gray-800" strokeWidth={3} />
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Create Habit
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


