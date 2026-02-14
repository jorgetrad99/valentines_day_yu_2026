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
  const heartRef = useRef<HTMLDivElement>(null);
  
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
    if (!heartRef.current || !containerRef.current) return;

    // Obtener la posición central del corazón relativa al contenedor
    const heartRect = heartRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Centro del corazón relativo al contenedor
    const targetX = (heartRect.left + heartRect.width / 2) - containerRect.left;
    const targetY = (heartRect.top + heartRect.height / 2) - containerRect.top;

    // Posición actual de la curita (suponiendo que empieza en el centro o tiene un offset)
    // Pero Framer Motion drag utiliza offsets relativos a la posición inicial.
    // Una forma más robusta es usar getBoundingClientRect en el elemento arrastrado.
    const bandaids = document.getElementsByClassName('bandaid-element');
    if (bandaids.length === 0) return;
    const bandaidRect = bandaids[0].getBoundingClientRect();
    
    const bandaidCenterX = bandaidRect.left + bandaidRect.width / 2;
    const bandaidCenterY = bandaidRect.top + bandaidRect.height / 2;
    
    const heartCenterX = heartRect.left + heartRect.width / 2;
    const heartCenterY = heartRect.top + heartRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(bandaidCenterX - heartCenterX, 2) + 
      Math.pow(bandaidCenterY - heartCenterY, 2)
    );
    
    // Umbral de detección: si la curita toca el centro del corazón (aprox 60px)
    if (distance < 80) {
      setIsRepaired(true);
      // Resetear valores de motion para que el corazón se vea limpio
      dragX.set(0);
      dragY.set(0);
      
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[400px] sm:h-[450px] flex items-center justify-center p-4 overflow-visible">
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
        ref={heartRef}
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
          className={`w-[60vw] h-[60vw] max-w-[240px] max-h-[240px] transition-all duration-1000 ${isRepaired ? 'text-valentine-red drop-shadow-[0_0_50px_rgba(255,77,109,0.8)]' : 'text-zinc-800 opacity-60'}`}
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
        >
          {isRepaired ? (
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          ) : (
            <g>
              {/* Lado izquierdo roto */}
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L12 10 L11 14 L12 21.35 Z" />
              {/* Lado derecho roto */}
              <path d="M12 5.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35 L13 14 L12 10 L12 5.09 Z" className="opacity-40" />
              {/* Grieta */}
              <motion.path 
                animate={{ opacity: [0.3, 1, 0.3], strokeWidth: [1.5, 2.5, 1.5] }}
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

      {/* Curita (Band-aid) rediseñada */}
      {!isRepaired && (
        <motion.div
          drag
          dragSnapToOrigin={false}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, y: dragY }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileDrag={{ scale: 1.2, zIndex: 50, rotate: 0 }}
          className="bandaid-element absolute cursor-grab active:cursor-grabbing z-50 transform -translate-x-1/2 -translate-y-1/2 bottom-[5%] right-[5%] sm:bottom-[8%] sm:right-[8%]"
        >
          <div className="relative w-[120px] h-[45px] sm:w-[150px] sm:h-[55px]">
            {/* Cuerpo de la curita con extremos redondeados (forma de píldora/curita real) */}
            <div className="absolute inset-0 bg-[#f3d5b5] rounded-full border-2 border-[#e6b89c] shadow-lg flex items-center justify-center overflow-hidden">
              {/* Textura de puntitos */}
              <div className="absolute inset-0 flex flex-wrap gap-2 p-2 opacity-30 pointer-events-none">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-[#8b5e34] rounded-full" />
                ))}
              </div>
              
              {/* Gasa central */}
              <div className="w-[40%] h-[80%] bg-[#fff1e6] border-x-2 border-[#e6b89c] shadow-inner flex flex-col items-center justify-center relative z-10">
                <div className="w-[80%] h-[2px] bg-[#e6b89c]/50 my-1" />
                <div className="w-[80%] h-[2px] bg-[#e6b89c]/50 my-1" />
              </div>
            </div>
            
            {/* Texto de la curita */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full border border-valentine-pink text-[10px] font-bold text-valentine-red opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
              Arrastra para sanar
            </div>
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
              "Arrastra la curita al centro del corazón..."
            </p>
            <motion.div 
              animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-valentine-pink text-xl sm:text-2xl"
            >
              🩹
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
