/**
 * Chart Container Component
 * Wrapper for responsive chart display
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChartContainer({ title, children, className = '' }: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-md ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}


