import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80">
    <motion.div
      className="w-16 h-16 border-4 border-[#238085] border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);