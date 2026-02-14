"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CollageProps {
  images?: string[];
}

export default function Collage({ images = [] }: CollageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { // Explicitly define transition properties
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const loveNotes = [
    "Tu sonrisa ✨",
    "Tu apoyo 💖",
    "Tu locura 😜",
    "Tu ternura 🧸",
    "Nuestras risas 😂",
    "Todo de ti 😍"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-5xl mx-auto min-h-[500px] md:h-[600px] flex items-center justify-center p-4 md:p-8"
    >
      {/* Grid Dinámico: 1 col en mobile, 2 en tablet, 3 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full relative z-10 overflow-y-auto max-h-[70vh] md:max-h-none scrollbar-hide py-10 px-4">
        {images.map((src, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              rotate: (i % 2 === 0 ? 1 : -1) * (i * 2 + 2),
            }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/5 bg-zinc-900 group"
          >
            <img
              src={src}
              alt={`Recuerdo ${i}`}
              className="w-full h-full object-cover select-none grayscale group-hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-valentine-red/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
               <span className="text-white font-bold text-lg drop-shadow-lg text-center leading-tight">
                {loveNotes[i % loveNotes.length]}
               </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notas flotantes de fondo (ocultas en mobile muy pequeño para no saturar) */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
        {loveNotes.map((note, i) => (
          <motion.div
            key={`note-${i}`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 0.3, 0], 
              y: [-100, -400], 
              x: (i % 2 === 0 ? 1 : -1) * (i * 60 + 50)
            }}
            transition={{ 
              duration: 8 + i, 
              repeat: Infinity, 
              delay: i * 1.5,
              ease: "linear" 
            }}
            className="absolute text-valentine-pink/20 font-serif text-xl md:text-3xl whitespace-nowrap"
          >
            {note}
          </motion.div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-valentine-red/5 rounded-full blur-[120px] -z-10" />
    </motion.div>
  );
}