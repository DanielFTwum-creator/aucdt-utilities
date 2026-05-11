import React from 'react';
import { StyleOracle } from '../components/StyleOracle';
import { motion } from 'motion/react';

export function AIStudio() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-[#4A5340] mb-4">AI Design Studio</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Explore the intersection of tradition and technology. Generate patterns, analyze fabrics, or consult with Sash.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column: Tools (Placeholder for Phase 1) */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200"
          >
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Visual Decoder</h2>
            <p className="text-stone-600 mb-6">
              Upload an image of a fabric to identify its pattern, cultural origin, and get styling suggestions.
            </p>
            <div className="h-48 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center bg-stone-50 text-stone-400">
              <span>Drag & Drop or Click to Upload (Coming Soon)</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200"
          >
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Generative Loom</h2>
            <p className="text-stone-600 mb-6">
              Describe a pattern in text, and watch as our AI weaves it into existence.
            </p>
            <div className="h-48 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
              <span>Pattern Generation Interface (Coming Soon)</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Chatbot */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sticky top-24">
            <h2 className="font-serif text-2xl font-bold text-[#4A5340] mb-4">Style Oracle</h2>
            <p className="text-stone-600 mb-6">
              Chat with Sash for real-time advice and insights.
            </p>
            <StyleOracle />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
