import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashLoaderProps {
  onComplete: () => void;
}

const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 500);
    
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-cerebra-primary to-cerebra-accent rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: 0,
        scale: 0
      }}
      animate={{ 
        x: window.innerWidth / 2 - 100 + Math.random() * 200,
        y: window.innerHeight / 2 - 50 + Math.random() * 100,
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{ 
        duration: 3,
        delay: i * 0.1,
        ease: "easeInOut"
      }}
    />
  ));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Starry background */}
        <div className="starry-sky" />
        
        {/* Floating particles */}
        {particles}
        
        {/* Main logo area */}
        <div className="relative z-10 text-center">
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 1
                }}
                className="mb-8"
              >
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-cerebra flex items-center justify-center glass-morphism"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(184, 192, 255, 0.3)",
                        "0 0 40px rgba(160, 228, 255, 0.5)",
                        "0 0 20px rgba(184, 192, 255, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.span 
                      className="text-4xl font-gildra text-white font-bold"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      C
                    </motion.span>
                  </motion.div>
                  
                  {/* Orbiting elements */}
                  <motion.div
                    className="absolute inset-0 w-32 h-32 mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-cerebra-accent rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transformOrigin: '0 0',
                          transform: `rotate(${angle}deg) translateX(80px) translateY(-6px)`
                        }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.5 
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.h1
            className="text-6xl font-gildra text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Cerebra
          </motion.h1>
          
          <motion.p
            className="text-xl text-cerebra-primary mb-8 font-enter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            Subconscious Learning AI Platform
          </motion.p>
          
          {/* Loading bar */}
          <motion.div
            className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-cerebra rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <motion.p
            className="text-sm text-white/70 mt-4 font-enter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Initializing neural pathways...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashLoader;