import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Star, 
  Zap, 
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Content } from '@/entities';
import { LearningModuleGenerator } from './LearningModuleGenerator';

interface DashboardProps {
  selectedTechnique: any;
  contentId: string;
  user: any;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface ConstellationBurst {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedTechnique, contentId, user }) => {
  const [isLearning, setIsLearning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [constellationBursts, setConstellationBursts] = useState<ConstellationBurst[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [contentData, setContentData] = useState<any>(null);
  const [learningModule, setLearningModule] = useState<any>(null);
  const [isGeneratingModule, setIsGeneratingModule] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  // Load content and generate personalized module
  useEffect(() => {
    const loadContentAndGenerateModule = async () => {
      try {
        setIsGeneratingModule(true);
        
        // Load content data
        const content = await Content.get(contentId);
        setContentData(content);
        
        // Check if module already exists for this technique
        const existingModule = content?.learning_modules?.find(
          (module: any) => module.technique === selectedTechnique.id
        );
        
        if (existingModule) {
          setLearningModule(existingModule.module_data);
        } else {
          // Generate new personalized module
          const module = await LearningModuleGenerator.generatePersonalizedModule(
            contentId, 
            selectedTechnique
          );
          setLearningModule(module);
        }
      } catch (error) {
        console.error('Error loading content or generating module:', error);
        // Fallback to basic module
        setLearningModule({
          module_title: `${selectedTechnique.title} Learning Session`,
          learning_objectives: ["Master the uploaded content", "Apply learning techniques", "Achieve retention goals"],
          content_sections: [
            {
              title: "Content Overview",
              content: "Exploring your uploaded content with personalized learning techniques.",
              duration_minutes: 10,
              difficulty: "Intermediate"
            }
          ]
        });
      } finally {
        setIsGeneratingModule(false);
      }
    };

    if (contentId && selectedTechnique) {
      loadContentAndGenerateModule();
    }
  }, [contentId, selectedTechnique]);

  // ... keep existing code (floating elements initialization, session timer, cleanup)
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLearning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setProgress(prev => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLearning]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setConstellationBursts(prev => 
        prev.filter(burst => Date.now() - burst.timestamp < 2000)
      );
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const handleInteraction = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newBurst = {
      id: Date.now(),
      x,
      y,
      timestamp: Date.now()
    };
    
    setConstellationBursts(prev => [...prev, newBurst]);
  };

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections(prev => [...prev, sectionIndex]);
      setProgress(prev => Math.min(prev + 20, 100));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const learningCards = [
    {
      title: "Session Time",
      value: formatTime(sessionTime),
      icon: Clock,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Progress",
      value: `${Math.round(progress)}%`,
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Content",
      value: contentData?.title?.substring(0, 15) + "..." || "Loading...",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Technique",
      value: selectedTechnique.title.substring(0, 10) + "...",
      icon: Brain,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  if (isGeneratingModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Brain className="w-full h-full text-cerebra-accent" />
          </motion.div>
          <h2 className="text-2xl font-gildra text-white mb-2">Generating Your Personalized Learning Module</h2>
          <p className="text-cerebra-primary font-enter">AI is creating a custom {selectedTechnique.title} experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight relative overflow-hidden">
      {/* Starry background */}
      <div className="starry-sky" />
      
      {/* ... keep existing code (floating elements and constellation bursts) */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-cerebra-primary/20 to-cerebra-accent/20 backdrop-blur-sm"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 8 + element.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay
          }}
        />
      ))}

      <AnimatePresence>
        {constellationBursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="absolute pointer-events-none"
            style={{
              left: `${burst.x}%`,
              top: `${burst.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cerebra-accent rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0,
                  scale: 0
                }}
                animate={{ 
                  x: Math.cos(i * Math.PI / 4) * 50,
                  y: Math.sin(i * Math.PI / 4) * 50,
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="w-16 h-16 mr-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center relative"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(34, 211, 238, 0.7)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-gildra text-white">
                  {learningModule?.module_title || 'Cerebra Dashboard'}
                </h1>
                <p className="text-cerebra-primary font-enter">
                  {selectedTechnique.title} • {contentData?.title || 'Neural Learning Interface'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {learningCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={handleInteraction}
                  className="cursor-pointer"
                >
                  <Card className="glass-morphism border-white/20 depth-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm font-enter">{card.title}</p>
                          <p className="text-2xl font-gildra text-white mt-1">{card.value}</p>
                        </div>
                        <motion.div
                          className={`w-12 h-12 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center`}
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Learning Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Control Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-2"
            >
              <Card className="glass-morphism border-white/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white font-gildra flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-cerebra-accent" />
                    {learningModule?.module_title || selectedTechnique.title}
                  </CardTitle>
                  <CardDescription className="text-cerebra-primary font-enter">
                    {contentData?.processed_summary || selectedTechnique.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70 font-enter">Learning Progress</span>
                      <span className="text-cerebra-accent font-enter">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={progress} 
                        className="h-3 bg-white/10"
                      />
                      <motion.div
                        className="absolute inset-0 h-3 bg-gradient-cerebra rounded-full"
                        style={{ width: `${progress}%` }}
                        animate={{ 
                          boxShadow: [
                            "0 0 10px rgba(184, 192, 255, 0.5)",
                            "0 0 20px rgba(160, 228, 255, 0.7)",
                            "0 0 10px rgba(184, 192, 255, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => {
                        setIsLearning(!isLearning);
                        handleInteraction({ currentTarget: document.body, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as any);
                      }}
                      className="holographic-button bg-gradient-cerebra hover:bg-gradient-sunset text-white font-enter flex-1"
                    >
                      {isLearning ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Learning
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={(e) => {
                        setProgress(0);
                        setSessionTime(0);
                        setIsLearning(false);
                        setCompletedSections([]);
                        setCurrentSection(0);
                        handleInteraction(e);
                      }}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Learning Content Sections */}
                  {learningModule?.content_sections && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-gildra text-white">Learning Sections</h3>
                      {learningModule.content_sections.map((section: any, index: number) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            completedSections.includes(index)
                              ? 'bg-green-500/10 border-green-400/30'
                              : currentSection === index
                              ? 'bg-blue-500/10 border-blue-400/30'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => {
                            setCurrentSection(index);
                            handleSectionComplete(index);
                            handleInteraction({ currentTarget: document.body, clientX: 0, clientY: 0 } as any);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-enter font-medium">{section.title}</h4>
                              <p className="text-sm text-white/70">{section.duration_minutes} min • {section.difficulty}</p>
                            </div>
                            {completedSections.includes(index) && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                          <p className="text-sm text-cerebra-primary mt-2">{section.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Side Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Learning Objectives */}
              {learningModule?.learning_objectives && (
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white font-gildra text-lg">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {learningModule.learning_objectives.map((objective: string, index: number) => (
                      <motion.div
                        key={objective}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <motion.div 
                          className="w-2 h-2 bg-cerebra-accent rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        />
                        <span className="text-white/80 text-sm font-enter">{objective}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Content Info */}
              {contentData && (
                <Card className="glass-morphism border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white font-gildra text-lg">Content Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-white/70 font-enter">Key Concepts</p>
                      <p className="text-cerebra-accent font-enter">{contentData.key_concepts?.length || 0} identified</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-enter">Content Type</p>
                      <p className="text-white font-enter capitalize">{contentData.content_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-enter">Processing Status</p>
                      <p className="text-green-400 font-enter capitalize">{contentData.processing_status}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Stats */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-gildra text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-cerebra-accent" />
                    Session Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70 font-enter">Completion Rate</span>
                      <span className="text-green-400 font-enter">
                        {learningModule?.content_sections ? 
                          Math.round((completedSections.length / learningModule.content_sections.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div 
                        className="bg-green-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: learningModule?.content_sections ? 
                            `${(completedSections.length / learningModule.content_sections.length) * 100}%` : "0%"
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70 font-enter">Technique Efficiency</span>
                      <span className="text-blue-400 font-enter">High</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1.2 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
