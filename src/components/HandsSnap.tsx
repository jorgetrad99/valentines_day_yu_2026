"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface HandsSnapProps {
  onComplete: () => void;
}

export default function HandsSnap({ onComplete }: HandsSnapProps) {
  const [isJoined, setIsJoined] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Solución definitiva al error de pureza: Usar el estado para las partículas
  // y generarlas SOLAMENTE en un useEffect, nunca durante el render.
  const [particles, setParticles] = useState<{id: number, x: number, y: number, delay: number}[]>([]);
  
  useEffect(() => {
    // Generar las partículas una sola vez al montar el componente
    const newParticles = [...Array(15)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Lógica de detección: si el movimiento hacia la izquierda es suficiente
    if (info.offset.x < -150) {
      setIsJoined(true);
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-visible p-4">
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
            
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 2, ease: "easeOut", delay: p.delay }}
                className="absolute text-xl sm:text-2xl"
              >
                💖
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área de interacción con Emojis */}
      <div className="relative w-full max-w-xl h-64 flex items-center justify-between px-10">
        
        {/* Mano Izquierda (Esperando) */}
        <motion.div
          animate={isJoined ? { x: 60, rotate: -15 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-8xl sm:text-[10rem] filter drop-shadow-xl select-none"
        >
          🫱
        </motion.div>

        {/* Mano Derecha (La que se arrastra) */}
        {!isJoined ? (
          <motion.div
            drag="x"
            dragConstraints={{ right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2, cursor: "grabbing" }}
            className="text-8xl sm:text-[10rem] filter drop-shadow-xl cursor-grab active:cursor-grabbing select-none"
          >
            🫲
          </motion.div>
        ) : (
          <motion.div
            animate={{ x: -60, rotate: 15 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-8xl sm:text-[10rem] filter drop-shadow-xl select-none"
          >
            🫲
          </motion.div>
        )}

      </div>

      {/* Fondo Mágico */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] sm:w-[80vw] sm:h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] transition-colors duration-1000 ${isJoined ? 'bg-valentine-red/20' : 'bg-zinc-100/10'}`} />
      </div>

      {!isJoined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 flex flex-col items-center space-y-2 px-4"
        >
          <p className="text-zinc-500 font-sans italic text-base sm:text-lg tracking-wide text-center text-balance">
            "Acerca nuestras manos..."
          </p>
          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-valentine-pink text-xl sm:text-2xl"
          >
            🤝
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
