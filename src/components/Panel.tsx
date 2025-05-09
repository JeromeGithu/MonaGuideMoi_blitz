import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

export const Panel: React.FC = () => {
  const { isPanelOpen, togglePanel } = useStore();

  return (
    <motion.div
      className="fixed top-0 right-0 h-full bg-white shadow-lg"
      initial={{ width: '0%' }}
      animate={{ width: isPanelOpen ? '300px' : '40px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button
        onClick={togglePanel}
        className="absolute top-1/2 -translate-y-1/2 -left-4 p-2 bg-white rounded-full shadow-lg"
      >
        {isPanelOpen ? (
          <ChevronRight className="w-6 h-6 text-gray-700" />
        ) : (
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        )}
      </button>
      
      {isPanelOpen && (
        <div className="p-6">
          <div className="w-24 h-24 bg-[#EDDABA] rounded-lg mb-6" />
          <p className="text-gray-600">
            Veuillez sélectionner la couleur à peindre
          </p>
        </div>
      )}
    </motion.div>
  );
};