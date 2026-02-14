"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

interface BookOpenInteractionProps {
  onComplete: () => void;
  coverImage: string;
  bookTitle: string;
  manuscriptContent?: string;
}

export default function BookOpenInteraction({ onComplete, coverImage, bookTitle, manuscriptContent }: BookOpenInteractionProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [showManuscript, setShowManuscript] = useState(false);
  
  useEffect(() => {
    setIsBookOpen(false);
    setShowManuscript(false);
  }, [coverImage]);

  const handleBookOpen = () => {
    if (isBookOpen) return;
    setIsBookOpen(true);
    
    setTimeout(() => {
      setShowManuscript(true);
    }, 600);

    // Avanzar automáticamente después de un tiempo razonable para leer
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center py-4 sm:py-8 overflow-visible">
      
      {/* Contenedor del Libro con Perspectiva */}
      <div 
        className="relative w-[260px] h-[360px] sm:w-[320px] sm:h-[440px] perspective-2000 group shadow-2xl rounded-r-xl overflow-visible"
        onClick={handleBookOpen}
      >
        
        {/* Páginas interiores (Fijas debajo de la portada) */}
        <div className="absolute inset-0 bg-stone-50 rounded-r-lg shadow-inner flex flex-col p-6 overflow-y-auto custom-scrollbar border-y border-r border-stone-200">
          <AnimatePresence>
            {showManuscript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-stone-800 font-serif text-sm sm:text-base leading-relaxed"
              >
                <div className="whitespace-pre-line italic">
                  {manuscriptContent || "Cargando nuestra historia..."}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ delay: 2, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  className="mt-8 flex items-center justify-center text-valentine-red font-sans text-xs uppercase tracking-widest font-bold"
                >
                  <span>Iniciando viaje mágico...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Portada del Libro (La que gira) */}
        <motion.div
          className="absolute inset-0 z-20 origin-left preserve-3d cursor-pointer"
          initial={false}
          animate={{ rotateY: isBookOpen ? -110 : 0 }}
          transition={{ duration: 1.2, ease: cubicBezier(0.4, 0, 0.2, 1) }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Frente de la Portada */}
          <div 
            className="absolute inset-0 backface-hidden rounded-r-xl shadow-2xl border-l-8 border-stone-800 flex flex-col overflow-hidden"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex-grow p-6 flex flex-col justify-end">
              <BookOpen className="text-white/40 w-12 h-12 mb-4" />
              <h2 className="text-white text-2xl sm:text-3xl font-serif font-bold leading-tight drop-shadow-md">
                {bookTitle}
              </h2>
              <div className="w-12 h-1 bg-valentine-pink mt-4 rounded-full" />
            </div>
            
            {/* Lomo decorativo */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
          </div>

          {/* Reverso de la Portada (Interior) */}
          <div 
            className="absolute inset-0 backface-hidden rounded-l-xl bg-stone-100 border-stone-300 border-l"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="w-full h-full opacity-20 p-8 flex items-center justify-center">
               <BookOpen className="w-32 h-32 text-stone-400" />
            </div>
          </div>

        </motion.div>

        {/* Indicador Flotante */}
        {!isBookOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 font-sans text-xs sm:text-sm flex items-center space-x-2 animate-bounce pointer-events-none"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Toca para abrir nuestro libro</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        )}

      </div>
    </div>
  );
}
