"use client";

import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

const LOVE_NOTES = [
  "Tu sonrisa ✨",
  "Tu voluntad 💪",
  "Tu inteligencia 🧠",
  "Tu corazón bonito ❤️",
  "Tu sentido del humor 😂",
  "Tu forma de ser única 🌟",
  "Tu guapura 😍",
  "Tu apoyo 💖",
  "Tu locura 😜",
  "Tu nivel de cuteness 🧸",
  "Tus bobadas 😂",
  "Toda tú 😍",
  "Tu ternura 🧸",
  "Nuestras risas 😂",
  "Tu apoyo incondicional 💖",
  "Tu mirada ✨"
];

export default function LoveNotesExplosion() {
  const containerRef = useRef<HTMLDivElement>(null);

  const notes = useMemo(() => {
    return LOVE_NOTES.map((text, i) => {
      // Ángulo aleatorio para la explosión inicial
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const distance = 100 + Math.random() * 150;
      
      return {
        id: i,
        text,
        initialX: Math.cos(angle) * distance,
        initialY: Math.sin(angle) * distance,
        // Posición final de caída un poco más centrada para empezar
        finalX: (Math.random() - 0.5) * 200,
        finalY: (Math.random() - 0.5) * 200,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        rotate: (Math.random() - 0.5) * 30
      };
    });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.1, zIndex: 100, cursor: "grab" }}
          whileDrag={{ scale: 1.2, zIndex: 1000, cursor: "grabbing" }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, note.initialX, note.finalX],
            y: [0, note.initialY, note.finalY],
            rotate: [0, note.rotate * 2, note.rotate]
          }}
          transition={{
            duration: note.duration,
            delay: note.delay,
            ease: "easeOut",
            times: [0, 0.3, 1]
          }}
          className="absolute whitespace-nowrap"
        >
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-valentine-pink/40 text-valentine-pink font-serif text-lg md:text-xl shadow-xl select-none">
            {note.text}
          </span>
        </motion.div>
      ))}

      {/* Corazón central que explota */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-7xl md:text-9xl z-0 pointer-events-none"
      >
        ❤️
      </motion.div>
    </div>
  );
}
