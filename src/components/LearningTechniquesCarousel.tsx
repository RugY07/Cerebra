import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Headphones, 
  Zap, 
  MessageSquare, 
  Box, 
  Smartphone, 
  Moon, 
  TrendingUp, 
  MapPin, 
  Sparkles,
  TouchpadOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LearningTechnique {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
}

interface LearningTechniquesCarouselProps {
  onTechniqueSelect: (technique: LearningTechnique) => void;
}

const techniques: LearningTechnique[] = [
  {
    id: 'spaced-repetition',
    title: 'Spaced Repetition System',
    description: 'Modified SMT Algorithm with Confidence-Based Endeavors',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    features: ['Adaptive scheduling', 'Confidence tracking', 'Memory optimization']
  },
  {
    id: 'passive-audio',
    title: 'Passive Audio Loops',
    description: '11Labs-generated audio summaries for subconscious learning',
    icon: Headphones,
    color: 'from-blue-500 to-cyan-500',
    features: ['AI-generated narration', 'Background learning', 'Audio optimization']
  },
  {
    id: 'binaural-beats',
    title: 'ToneJS Binaural Beats',
    description: 'Frequency-based cognitive enhancement',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    features: ['Brainwave entrainment', 'Focus enhancement', 'Relaxation modes']
  },
  {
    id: 'micro-quiz',
    title: 'Micro Quiz Notifications',
    description: 'Bite-sized knowledge reinforcement throughout the day',
    icon: MessageSquare,
    color: 'from-green-500 to-teal-500',
    features: ['Smart timing', 'Contextual questions', 'Progress tracking']
  },
  {
    id: 'memory-palace',
    title: '3D Memory Palaces',
    description: 'Immersive spatial memory techniques',
    icon: Box,
    color: 'from-indigo-500 to-purple-500',
    features: ['3D environments', 'Spatial anchoring', 'Virtual navigation']
  },
  {
    id: 'ar-labeling',
    title: 'AR Labeling',
    description: 'Augmented reality learning overlays',
    icon: Smartphone,
    color: 'from-pink-500 to-rose-500',
    features: ['Real-world integration', 'Visual anchors', 'Interactive labels']
  },
  {
    id: 'sleep-reinforcement',
    title: 'Sleep Reinforcement',
    description: 'Learning during sleep cycles',
    icon: Moon,
    color: 'from-slate-500 to-gray-500',
    features: ['Sleep cycle detection', 'Gentle audio cues', 'Memory consolidation']
  },
  {
    id: 'neuroadaptive',
    title: 'Neuroadaptive Difficulty',
    description: 'AI-powered difficulty adjustment',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-500',
    features: ['Performance analysis', 'Dynamic adjustment', 'Optimal challenge']
  },
  {
    id: 'contextual-triggers',
    title: 'Contextual Triggers',
    description: 'Location and time-based learning cues',
    icon: MapPin,
    color: 'from-amber-500 to-yellow-500',
    features: ['Location awareness', 'Time-based cues', 'Environmental triggers']
  },
  {
    id: 'ai-dream-prompts',
    title: 'AI Dream Prompts',
    description: 'Subconscious learning through dream influence',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    features: ['Dream integration', 'Subconscious processing', 'Sleep learning']
  },
  {
    id: 'haptic-flashcards',
    title: 'Haptic Flashcards',
    description: 'Touch-based memory reinforcement',
    icon: TouchpadOff,
    color: 'from-red-500 to-pink-500',
    features: ['Tactile feedback', 'Muscle memory', 'Multi-sensory learning']
  }
];

const LearningTechniquesCarousel: React.FC<LearningTechniquesCarouselProps> = ({ onTechniqueSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<LearningTechnique | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % techniques.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + techniques.length) % techniques.length);
  };

  const handleTechniqueSelect = (technique: LearningTechnique) => {
    setSelectedTechnique(technique);
    onTechniqueSelect(technique);
  };

  const getVisibleTechniques = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + techniques.length) % techniques.length;
      visible.push({ technique: techniques[index], offset: i });
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-gildra text-white mb-4">
            Choose Your Learning Technique
          </h1>
          <p className="text-xl text-cerebra-primary font-enter">
            Select the perfect method to absorb your content
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative h-96 flex items-center justify-center perspective-1000">
          <AnimatePresence mode="wait">
            {getVisibleTechniques().map(({ technique, offset }) => {
              const Icon = technique.icon;
              const isCenter = offset === 0;
              
              return (
                <motion.div
                  key={`${technique.id}-${currentIndex}`}
                  initial={{ 
                    x: offset * 400,
                    z: isCenter ? 0 : -200,
                    opacity: isCenter ? 1 : 0.6,
                    scale: isCenter ? 1 : 0.8
                  }}
                  animate={{ 
                    x: offset * 400,
                    z: isCenter ? 0 : -200,
                    opacity: isCenter ? 1 : 0.6,
                    scale: isCenter ? 1 : 0.8,
                    rotateY: offset * 25
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="absolute w-80 h-80"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card 
                    className={`
                      w-full h-full glass-morphism border-white/20 cursor-pointer
                      ${isCenter ? 'shadow-2xl' : 'shadow-lg'}
                      transition-all duration-300 hover:scale-105
                    `}
                    onClick={() => isCenter && handleTechniqueSelect(technique)}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${technique.color} flex items-center justify-center mb-4`}
                        animate={isCenter ? { 
                          boxShadow: [
                            "0 0 20px rgba(184, 192, 255, 0.3)",
                            "0 0 40px rgba(160, 228, 255, 0.5)",
                            "0 0 20px rgba(184, 192, 255, 0.3)"
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-white font-gildra text-lg">
                        {technique.title}
                      </CardTitle>
                      <CardDescription className="text-cerebra-primary font-enter">
                        {technique.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {technique.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-cerebra-accent rounded-full" />
                          <span className="text-white/80 text-sm font-enter">{feature}</span>
                        </motion.div>
                      ))}
                      
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="pt-4"
                        >
                          <Button 
                            className="w-full holographic-button bg-gradient-cerebra hover:bg-gradient-sunset text-white font-enter"
                            onClick={() => handleTechniqueSelect(technique)}
                          >
                            Select This Technique
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass-morphism border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 glass-morphism border-white/20 text-white hover:bg-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Technique indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {techniques.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${index === currentIndex 
                  ? 'bg-cerebra-primary scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningTechniquesCarousel;