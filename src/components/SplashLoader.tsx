import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

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
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
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
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center glass-morphism relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 40px rgba(34, 211, 238, 0.7)",
                        "0 0 20px rgba(59, 130, 246, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-12 h-12 text-white" />
                    
                    {/* Starry overlay on brain */}
                    <div className="absolute inset-0 rounded-full">
                      {Array.from({ length: 12 }, (_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${15 + (i % 4) * 20}%`,
                            top: `${20 + Math.floor(i / 4) * 20}%`,
                          }}
                          animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1.2, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Neural network lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
                      {Array.from({ length: 6 }, (_, i) => (
                        <motion.line
                          key={i}
                          x1={32 + i * 12}
                          y1={40}
                          x2={32 + i * 12}
                          y2={88}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      ))}
                    </svg>
                  </motion.div>
                  
                  {/* Orbiting neural nodes */}
                  <motion.div
                    className="absolute inset-0 w-32 h-32 mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transformOrigin: '0 0',
                          transform: `rotate(${angle}deg) translateX(85px) translateY(-6px)`
                        }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          boxShadow: [
                            "0 0 5px rgba(59, 130, 246, 0.5)",
                            "0 0 15px rgba(34, 211, 238, 0.8)",
                            "0 0 5px rgba(59, 130, 246, 0.5)"
                          ]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.4 
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
            className="text-xl text-blue-300 mb-8 font-enter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            Neural Learning AI Platform
          </motion.p>
          
          {/* Loading bar */}
          <motion.div
            className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
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