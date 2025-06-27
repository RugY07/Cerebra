import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/entities';
import { Eye, EyeOff, Mail, Lock, Sparkles, Brain } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll create a mock user instead of calling the auth API
      // This avoids the network fetch error while still providing a working experience
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email || 'demo@cerebra.ai',
        full_name: 'Demo User',
        learning_preferences: [],
        upload_history: [],
        session_history: [],
        theme_preference: 'dark',
        onboarding_completed: false
      };
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onAuthSuccess(mockUser);
    } catch (error) {
      console.error('Auth error:', error);
      // Even if there's an error, we'll still proceed with demo user
      const fallbackUser = {
        id: 'demo-user',
        email: 'demo@cerebra.ai',
        full_name: 'Demo User',
        learning_preferences: [],
        upload_history: [],
        session_history: [],
        theme_preference: 'dark',
        onboarding_completed: false
      };
      onAuthSuccess(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const floatingIcons = [
    { icon: Sparkles, delay: 0 },
    { icon: Mail, delay: 0.5 },
    { icon: Lock, delay: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight flex items-center justify-center p-4 overflow-hidden relative">
      {/* Starry background */}
      <div className="starry-sky" />
      
      {/* Floating icons */}
      {floatingIcons.map(({ icon: Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/30"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}
      
      {/* Main auth card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8
        }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-morphism border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center relative"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 30px rgba(34, 211, 238, 0.7)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-8 h-8 text-white" />
              {/* Mini starry overlay */}
              <div className="absolute inset-0 rounded-full">
                {Array.from({ length: 4 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${25 + i * 15}%`,
                      top: `${30 + (i % 2) * 20}%`,
                    }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-gildra text-white">
              Welcome to Cerebra
            </CardTitle>
            <CardDescription className="text-blue-300 font-enter">
              {isLogin ? 'Sign in to continue your learning journey' : 'Create your account to begin'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-blue-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full holographic-button bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-enter font-medium py-3 transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  isLogin ? 'Enter Demo' : 'Start Demo'
                )}
              </Button>
            </form>
            
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-cyan-300 transition-colors font-enter"
              >
                {isLogin ? "New to Cerebra? Try demo" : "Already exploring? Continue demo"}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-white/50 font-enter">
                Demo mode - No authentication required
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
