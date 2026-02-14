"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';

interface HandsSnapProps {
  onComplete: () => void;
}

export default function HandsSnap({ onComplete }: HandsSnapProps) {
  const [isJoined, setIsJoined] = useState(false);
  const leftArmRef = useRef<HTMLDivElement>(null);
  const rightArmRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Umbral de detección de snap ajustado para responsividad
  const [snapThreshold, setSnapThreshold] = useState(130);

  useEffect(() => {
    const handleResize = () => {
      // Ajustar el umbral basado en el ancho de la ventana
      setSnapThreshold(window.innerWidth < 640 ? 80 : 130); // Más pequeño para móviles
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Establecer el valor inicial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = () => {
    if (leftArmRef.current && rightArmRef.current) {
      const leftRect = leftArmRef.current.getBoundingClientRect();
      const rightRect = rightArmRef.current.getBoundingClientRect();

      const distanceX = Math.abs((leftRect.left + leftRect.right) / 2 - (rightRect.left + rightRect.right) / 2);
      const distanceY = Math.abs((leftRect.top + leftRect.bottom) / 2 - (rightRect.top + rightRect.bottom) / 2);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < snapThreshold) {
        setIsJoined(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[50vh] min-h-[300px] max-h-[500px] flex items-center justify-center overflow-hidden p-4">
      <AnimatePresence>
        {isJoined && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            className="absolute z-20 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-7xl sm:text-9xl filter drop-shadow-[0_0_40px_rgba(255,77,109,0.9)]"
            >
              ❤️
            </motion.div>
            
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 2, ease: "easeOut", delay: Math.random() * 0.5 }}
                className="absolute text-xl sm:text-2xl"
              >
                💖
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brazo Izquierdo (SVG Detallado) */}
      <motion.div
        ref={leftArmRef}
        drag
        dragConstraints={containerRef}
        onDragEnd={handleDragEnd}
        animate={isJoined ? { x: "10vw", y: 0, rotate: 25 } : { x: "-15vw" }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="absolute left-[5%] sm:left-[10%] z-10 cursor-grab active:cursor-grabbing touch-action-none"
      >
        <div className="relative w-[50vw] h-[25vw] max-w-[200px] max-h-[100px]">
          <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
            <path 
              d="M0,50 Q50,45 100,50 L100,70 Q50,75 0,70 Z" 
              fill="#f3d5b5" 
              stroke="#e9c49a" 
              strokeWidth="2"
            />
            <path 
              d="M0,45 Q30,40 60,45 L60,75 Q30,80 0,75 Z" 
              fill="#333" 
              opacity="0.9"
            />
            <g transform="translate(100, 35) rotate(10)">
              <path 
                d="M10,20 Q15,0 30,5 Q45,10 40,25 Q55,15 65,25 Q75,35 60,45 Q75,55 60,65 Q45,75 35,60 Q20,75 10,65 Z" 
                fill="#f3d5b5" 
                stroke="#e9c49a" 
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Brazo Derecho (SVG Detallado, Invertido) */}
      <motion.div
        ref={rightArmRef}
        drag
        dragConstraints={containerRef}
        onDragEnd={handleDragEnd}
        animate={isJoined ? { x: "-10vw", y: 0, rotate: -25 } : { x: "15vw" }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="absolute right-[5%] sm:right-[10%] z-10 cursor-grab active:cursor-grabbing scale-x-[-1] touch-action-none"
      >
        <div className="relative w-[50vw] h-[25vw] max-w-[200px] max-h-[100px]">
          <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
            <path 
              d="M0,50 Q50,45 100,50 L100,70 Q50,75 0,70 Z" 
              fill="#f3d5b5" 
              stroke="#e9c49a" 
              strokeWidth="2"
            />
            <path 
              d="M0,45 Q30,40 60,45 L60,75 Q30,80 0,75 Z" 
              fill="#333" 
              opacity="0.9"
            />
            <g transform="translate(100, 35) rotate(10)">
              <path 
                d="M10,20 Q15,0 30,5 Q45,10 40,25 Q55,15 65,25 Q75,35 60,45 Q75,55 60,65 Q45,75 35,60 Q20,75 10,65 Z" 
                fill="#f3d5b5" 
                stroke="#e9c49a" 
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Fondo Mágico */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] sm:w-[80vw] sm:h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] transition-colors duration-1000 ${isJoined ? 'bg-valentine-red/20' : 'bg-zinc-100/10'}`} />
      </div>

      {!isJoined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-6 flex flex-col items-center space-y-2 px-4"
        >
          <p className="text-zinc-500 font-sans italic text-base sm:text-lg tracking-wide text-center text-balance">
            "Acerca nuestros caminos para un abrazo..."
          </p>
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-valentine-pink text-xl sm:text-2xl"
          >
            ← ❤️ →
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}