"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useCycle, wrap, useMotionValue } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import presentationData from '@/data/presentationData.json';

// Import actual interaction components
import HeartRepair from '@/components/HeartRepair';
import HandsSnap from '@/components/HandsSnap';
import Collage from '@/components/Collage';
import MusicPlayer from '@/components/MusicPlayer';
import BookOpenInteraction from '@/components/BookOpenInteraction'; // Importar el nuevo componente
import LoveNotesExplosion from '@/components/LoveNotesExplosion';

// --- Types ---
type SlideType = 'cover' | 'text-only' | 'image-collage' | 'interaction' | 'final' | 'love-notes';

interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  images?: string[];
  interactionType?: 'HeartRepair' | 'HandsSnap' | 'BookOpen';
  requiresInteraction: boolean;
  background?: string;
  coverImage?: string;
  bookTitle?: string;
  manuscriptContent?: string; // Añadido para el contenido del libro
}

// --- Main SlideManager Component ---

export default function SlideManager() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactionStates, setInteractionStates] = useState<Record<number, boolean>>({});

  const x = useMotionValue(0);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = presentationData.slides as Slide[];
  
  const isComplete = useMemo(() => {
    const slide = slides[currentStep];
    if (!slide || !slide.requiresInteraction) return true;
    return interactionStates[currentStep] || false;
  }, [currentStep, interactionStates, slides]);

  if (!mounted) return null; // Prevenir errores de hidratación en exportación estática

  const currentSlide = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1 && isComplete) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle swipe gestures
  const swipeConfidenceThreshold = 10000; // Increased threshold for more deliberate swipes
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const onSwipeEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number; }; velocity: { x: number; y: number; }; }) => {
    const power = swipePower(info.offset.x, info.velocity.x);

    if (power > swipeConfidenceThreshold && info.offset.x < 0) {
      handleNext();
    } else if (power > swipeConfidenceThreshold && info.offset.x > 0) {
      handlePrev();
    }
  };

  const markInteractionComplete = () => {
    setInteractionStates(prev => ({ ...prev, [currentStep]: true }));
    // El componente de interacción ahora maneja su propia transición y llama a onComplete
    handleNext();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div ref={constraintsRef} className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-1000 overflow-hidden ${currentSlide.background || 'bg-zinc-950'}`}>
      
      {/* Elementos decorativos de fondo persistentes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-valentine-pink/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-valentine-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl px-4 md:px-8 relative z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={1}
            onDragEnd={onSwipeEnd}
            className="grid grid-rows-[auto_minmax(0,1fr)] gap-6 md:gap-10 h-[85vh] w-full max-w-5xl mx-auto items-start"
          >
            {/* Header section with intrinsic height */}
            <div className="space-y-4 md:space-y-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-7xl font-serif text-valentine-red drop-shadow-sm leading-tight text-balance"
              >
                {currentSlide.title}
              </motion.h1>
              {currentSlide.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg sm:text-xl md:text-2xl text-zinc-600 font-sans max-w-3xl mx-auto italic font-light text-balance break-words"
                >
                  {currentSlide.subtitle}
                </motion.p>
              )}
            </div>

            {/* Content section that fills the remaining space */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              {currentSlide.type === 'image-collage' && (
                <Collage images={currentSlide.images} />
              )}

              {currentSlide.type === 'love-notes' && (
                <LoveNotesExplosion />
              )}
              
              {currentSlide.type === 'interaction' && (
                <div className="w-full max-w-md md:max-w-lg">
                  {currentSlide.interactionType === 'HeartRepair' && (
                    <HeartRepair onComplete={markInteractionComplete} />
                  )}
                  {currentSlide.interactionType === 'HandsSnap' && (
                    <HandsSnap onComplete={markInteractionComplete} />
                  )}
                  {currentSlide.interactionType === 'BookOpen' && currentSlide.coverImage && currentSlide.bookTitle && (
                    <BookOpenInteraction onComplete={markInteractionComplete} coverImage={currentSlide.coverImage} bookTitle={currentSlide.bookTitle} manuscriptContent={currentSlide.manuscriptContent} />
                  )}
                </div>
              )}

              {currentSlide.type === 'final' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.8 }}
                  className="text-8xl md:text-9xl"
                >
                  💝
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls (Hidden on small screens, use swipe) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 md:-left-16 md:-right-16 flex justify-between pointer-events-none px-2 md:px-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`p-3 md:p-5 rounded-full bg-white/30 backdrop-blur-md shadow-xl border border-white/40 pointer-events-auto transition-all duration-300 ${currentStep === 0 ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 hover:bg-white/50 hover:scale-110 active:scale-95'}`}
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-valentine-red" />
          </button>

          <button
            onClick={handleNext}
            disabled={!isComplete || currentStep === slides.length - 1}
            className={`p-3 md:p-5 rounded-full bg-valentine-red/20 backdrop-blur-md shadow-xl border border-white/40 pointer-events-auto transition-all duration-300 ${(!isComplete || currentStep === slides.length - 1) ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 hover:bg-valentine-red/40 hover:scale-110 active:scale-95'}`}
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </button>
        </div>

        {/* Progress Bar (Hearts) */}
        <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 md:space-x-4 bg-white/10 backdrop-blur-lg p-2 md:p-3 rounded-full border border-white/20 shadow-2xl">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer"
              onClick={() => i < currentStep || (i === currentStep + 1 && isComplete) ? setCurrentStep(i) : null}
            >
              <motion.div
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-valentine-red scale-110' : 'bg-white/30'}`}
                animate={i === currentStep ? { scale: [1, 1.4, 1] } : {}}
                transition={{ repeat: i === currentStep ? Infinity : 0, duration: 2 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
}
