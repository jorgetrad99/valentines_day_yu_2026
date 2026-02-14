"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface CollageProps {
  images?: string[];
}

export default function Collage({ images = [] }: CollageProps) {
  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video');
  };

  const isSingleImage = images.length === 1;
  const isTwoImages = images.length === 2;
  const isThreeImages = images.length === 3;

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
    hidden: { opacity: 0, scale: 0.5, rotate: isSingleImage ? 0 : -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const loveNotes = [
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
    "Toda tú 😍"
  ];

  // Generate a stable random index for each image when the images array changes
  const randomNoteIndices = useMemo(() => {
    return images.map(() => Math.floor(Math.random() * loveNotes.length));
  }, [images]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      <div
        className={`w-full h-full relative z-10 flex flex-col items-center justify-center ${
          !isSingleImage && !isTwoImages && !isThreeImages ? 'overflow-y-auto scrollbar-hide p-4' : 'p-2'
        }`}
      >
        <div
          className={`w-full h-full grid gap-4 md:gap-8 ${
            isSingleImage
              ? 'grid-cols-1'
              : isTwoImages
                ? 'grid-cols-1 md:grid-cols-2'
                : isThreeImages
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              style={{
                rotate: isSingleImage ? 0 : (i % 2 === 0 ? 1 : -1) * (i * 2 + 2),
              }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/5 bg-zinc-900 group w-full h-full"
            >
              {isVideo(src) ? (
                <video
                  src={src}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={src}
                  alt={`Recuerdo ${i}`}
                  className="w-full h-full object-contain select-none transition-all duration-700"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-valentine-red/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                <span className="text-white font-bold text-lg drop-shadow-lg text-center leading-tight">
                  {loveNotes[randomNoteIndices[i]]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
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
