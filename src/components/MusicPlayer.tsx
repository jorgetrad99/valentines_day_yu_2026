"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Path to the local mp3 file
  const audioSrc = "/music/Photograph.mp3";

  // Handle autoplay and user interaction policy
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          // Browsers often block autoplay without user interaction
          // We try to play it anyway, and if it fails, we wait for a click
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked. Waiting for user interaction.", error);
          
          // Fallback: try to play on first click anywhere in the document
          const playOnInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener('click', playOnInteraction);
                })
                .catch(err => console.error("Play failed after interaction:", err));
            }
          };
          window.addEventListener('click', playOnInteraction);
        }
      }
    };

    playAudio();
    
    return () => {
      window.removeEventListener('click', () => {});
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={audioSrc}
        autoPlay
        loop
        preload="auto"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-zinc-900/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden min-w-[260px]"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-valentine-red/20 rounded-full flex items-center justify-center">
                <Music className="text-valentine-red animate-pulse" size={32} />
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-medium">Música de Fondo</h3>
                <p className="text-zinc-500 text-xs">Reprodúciendose localmente ✨</p>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
              </div>
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
          {isPlaying ? "Sonando... 🎵" : "Música en pausa 🤫"}
        </motion.div>
      )}
    </div>
  );
}
