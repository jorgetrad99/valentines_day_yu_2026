"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';

interface HeartRepairProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  delay: number;
  color: string;
}

export default function HeartRepair({ onComplete }: HeartRepairProps) {
  const [isRepaired, setIsRepaired] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      rotate: Math.random() * 360,
      delay: Math.random() * 0.4,
      color: i % 2 === 0 ? 'bg-valentine-pink' : 'bg-yellow-200'
    }));
    setParticles(newParticles);
  }, []);

  const handleDragEnd = () => {
    const x = dragX.get();
    const y = dragY.get();
    
    const distance = Math.sqrt(x * x + y * y);
    
    // Umbral de detección ajustado para ser más fácil y responsivo
    // Usar una función que pueda ajustarse con el tamaño de la pantalla si fuera necesario
    const dynamicThreshold = Math.min(150, window.innerWidth / 5); // Max 150px, o 20% del ancho de pantalla

    if (distance < dynamicThreshold) {
      setIsRepaired(true);
      dragX.set(0);
      dragY.set(0);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[400px] sm:h-[450px] flex items-center justify-center p-4">
      <AnimatePresence>
        {isRepaired && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  x: p.x, 
                  y: p.y,
                  rotate: p.rotate
                }}
                transition={{ duration: 2, ease: "easeOut", delay: p.delay }}
                className={`absolute w-3 h-3 rounded-full blur-[1px] ${p.color} z-30`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corazón SVG */}
      <motion.div
        animate={isRepaired ? { 
          scale: [1, 1.3, 1.1, 1.2], 
          rotate: [0, 5, -5, 0],
        } : { 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: isRepaired ? 1 : 2, 
          repeat: isRepaired ? 0 : Infinity 
        }}
        className="relative z-10"
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] transition-all duration-1000 ${isRepaired ? 'text-valentine-red drop-shadow-[0_0_50px_rgba(255,77,109,0.8)]' : 'text-zinc-800 opacity-60'}`}
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
        >
          {isRepaired ? (
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          ) : (
            <g>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L12 12l0 9.35z" />
              <path d="M12 5.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35L12 12L12 5.09z" className="opacity-40" />
              <motion.path 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                d="M12 5 L11 9 L13 13 L12 17" fill="none" stroke="#ff4d6d" strokeWidth="1.5" strokeLinecap="round" 
              />
            </g>
          )}
        </svg>

        {isRepaired && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [1, 2.5, 3] }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 bg-valentine-pink rounded-full blur-[100px] -z-10"
          />
        )}
      </motion.div>

      {/* Curita (Band-aid) */}
      {!isRepaired && (
        <motion.div
          drag
          dragSnapToOrigin={false}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, y: dragY }}
          whileHover={{ scale: 1.15 }}
          whileDrag={{ scale: 1.3, zIndex: 50 }}
          className="absolute cursor-grab active:cursor-grabbing z-50 p-8 sm:p-10 transform -translate-x-1/2 -translate-y-1/2 bottom-1/2 right-1/2" 
        >
          <div className="bg-[#f7e1c6] p-4 sm:p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-[15deg] border-2 border-[#e9c49a] flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] relative overflow-hidden">
            <div className="w-full h-10 border-x-4 border-[#d4a373]/30 flex items-center justify-center space-x-1 sm:space-x-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#bc8a5f]/40 rounded-full" />
              ))}
            </div>
            <span className="mt-1 sm:mt-2 text-[#8b5e34] text-[9px] sm:text-[11px] font-black tracking-[0.2em] uppercase pointer-events-none select-none text-center">
              Cuidado &<br/>Paciencia
            </span>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      )}

      {/* Narrativa visual */}
      <AnimatePresence>
        {!isRepaired ? (
          <motion.div
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-8 sm:-bottom-12 flex flex-col items-center space-y-2 sm:space-y-3"
          >
            <p className="text-zinc-500 font-sans italic text-base sm:text-xl text-center max-w-sm leading-relaxed text-balance">
              "Arrastra mi cuidado hacia mi corazón..."
            </p>
            <motion.div 
              animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-valentine-pink text-xl sm:text-2xl"
            >
              ❤️
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 sm:-bottom-12 flex flex-col items-center"
          >
            <p className="text-valentine-red font-serif font-bold text-2xl sm:text-4xl tracking-wide text-balance text-center drop-shadow-lg">
              Sanando juntos ✨
            </p>
            <p className="text-zinc-400 font-sans text-sm sm:text-lg mt-1 sm:mt-2 text-center">3 años de aprender que el amor todo lo puede.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}