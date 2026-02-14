"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const embedUrl = `https://open.spotify.com/track/1HNkqx9Ahdgi1Ixy2xkKkL?si=1fc4dd1f315e4a8b`;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-zinc-900/95 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="relative rounded-[2rem] overflow-hidden">
               <iframe
                title="Spotify Playlist"
                src={embedUrl}
                width="300"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="mt-2 px-4 pb-2">
              <p className="text-[10px] text-zinc-500 text-center font-sans tracking-tight leading-tight">
                Si ves un error de conexión, asegúrate de haber iniciado sesión en Spotify en este navegador ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-5 rounded-full shadow-2xl border border-white/20 transition-all duration-500 ${isOpen ? 'bg-valentine-red text-white' : 'bg-zinc-800/80 backdrop-blur-md text-valentine-pink hover:bg-zinc-700'}`}
        >
          {isOpen ? <X size={28} /> : <Music size={28} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className={`p-5 rounded-full shadow-2xl border border-white/10 transition-all duration-500 ${isMuted ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-800/80 backdrop-blur-md text-zinc-400 hover:bg-zinc-700'}`}
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </motion.button>
      </div>

      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute right-24 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/70 whitespace-nowrap pointer-events-none font-sans italic"
        >
          Spotify Playlist... 🎵
        </motion.div>
      )}
    </div>
  );
}