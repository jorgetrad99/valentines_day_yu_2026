"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, cubicBezier } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BookOpenInteractionProps {
  onComplete: () => void;
  coverImage: string;
  bookTitle: string;
  manuscriptContent?: string;
}

export default function BookOpenInteraction({ onComplete, coverImage, bookTitle, manuscriptContent }: BookOpenInteractionProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [showManuscript, setShowManuscript] = useState(false);
  const [isImmersed, setIsImmersed] = useState(false);

  const bookControls = useAnimation();
  const immerseControls = useAnimation();

  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsBookOpen(false);
    setShowManuscript(false);
    setIsImmersed(false);
  }, [coverImage]);

  const handleBookOpen = () => {
    if (isBookOpen) return;
    setIsBookOpen(true);
    bookControls.start("open");

    setTimeout(() => {
      setShowManuscript(true);
    }, 800);

    setTimeout(() => {
      immerseControls.start("immerse").then(() => {
        setIsImmersed(true);
      });
    }, 3000);
  };

  const handleContinue = () => {
    if (isImmersed) {
      onComplete();
    }
  };

  const variants = {
    closed: { rotateY: 0 },
    open: { rotateY: -170, transition: { duration: 1, ease: cubicBezier(0.42, 0, 0.58, 1) } }
  };

  const immerseVariants = {
    initial: { scale: 1, opacity: 1 },
    immerse: { scale: 1.5, opacity: 0, transition: { duration: 2, ease: cubicBezier(0.42, 0, 1, 1) } }
  };

  return (
    <motion.div 
      ref={bookRef}
      className="relative w-[280px] h-[350px] sm:w-[350px] sm:h-[450px] perspective-1000 cursor-pointer text-balance"
      onClick={!isBookOpen ? handleBookOpen : isImmersed ? handleContinue : undefined}
      whileHover={!isBookOpen ? { scale: 1.05 } : {}}
      whileTap={!isBookOpen ? { scale: 0.95 } : {}}
      variants={variants}
      initial="closed"
      animate={bookControls}
    >
      {/* Cubierta del libro */}
      <motion.div
        className="absolute inset-0 bg-gray-200 rounded-l-lg rounded-r-md shadow-lg transform-style-3d origin-[100%_50%]"
        variants={{ closed: { rotateY: 0 }, open: { rotateY: -180, transition: { duration: 1.2, ease: cubicBezier(0.42, 0, 0.58, 1) } } }}
      >
        {/* Parte trasera de la cubierta (visible cuando el libro está abierto) */}
        <div className="absolute inset-0 bg-gray-300 rounded-l-lg rounded-r-md backface-hidden flex items-center justify-center">
          <span className="text-zinc-600 text-lg font-serif italic rotate-90">"La vida es un libro..."</span>
        </div>
        {/* Portada del libro */}
        <div 
          className="absolute inset-0 rounded-l-lg rounded-r-md overflow-hidden backface-hidden"
          style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
            <h2 className="text-white text-xl sm:text-2xl font-bold text-left w-full leading-tight">{bookTitle}</h2>
          </div>
        </div>
      </motion.div>

      {/* Lomo del libro */}

      {/* Primera página del libro (Manuscritos) */}
      <motion.div
        className="absolute inset-0 bg-white rounded-r-md shadow-inner origin-[0%_50%] transform-style-3d z-[-1] flex flex-col justify-between p-6 sm:p-8 overflow-hidden"
        variants={{ closed: { rotateY: 0 }, open: { rotateY: -175, transition: { duration: 1.2, ease: cubicBezier(0.42, 0, 0.58, 1), delay: 0.1 } } }}
        animate={bookControls}
      >
        <div className="absolute inset-0 bg-white rounded-r-md backface-hidden" />
        <div className="absolute inset-0 bg-gray-100 rounded-r-md transform rotateY-180 backface-hidden p-6 sm:p-8 text-zinc-800 font-serif overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {showManuscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: cubicBezier(0.42, 0, 0.58, 1) }}
                className="text-lg sm:text-xl leading-relaxed italic"
              >
                {manuscriptContent || (
                  <p>
                    "Hace tres años, comenzó un capítulo en nuestras vidas. Dos almas, un destino..."
                    <br/><br/>
                    "Cada página escrita con risas, sueños y un amor que crece sin cesar."
                    <br/><br/>
                    "Descubre cómo sigue esta historia..."
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>


      {/* Indicador para deslizar/click */}
      {!isBookOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, repeat: Infinity, repeatType: "reverse", type: "tween", ease: "linear" }}
          className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-zinc-500 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2"
        >
          <span>Click o desliza para abrir</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      ) : isImmersed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, repeat: Infinity, repeatType: "reverse", type: "tween", ease: "linear" }}
          className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-zinc-500 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2 cursor-pointer"
          onClick={handleContinue}
        >
          <span>Click para continuar</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      ) : null}
    </motion.div>
  );
}