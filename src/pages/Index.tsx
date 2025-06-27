import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashLoader from '@/components/SplashLoader';
import AuthPage from '@/components/AuthPage';
import UploadInterface from '@/components/UploadInterface';
import LearningTechniquesCarousel from '@/components/LearningTechniquesCarousel';

type AppState = 'loading' | 'auth' | 'upload' | 'techniques' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(null);
  const [uploadedContentId, setUploadedContentId] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);

  const handleSplashComplete = () => {
    setAppState('auth');
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAppState('upload');
  };

  const handleUploadComplete = (contentId: string) => {
    setUploadedContentId(contentId);
    setAppState('techniques');
  };

  const handleTechniqueSelect = (technique: any) => {
    setSelectedTechnique(technique);
    setAppState('dashboard');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <SplashLoader key="splash" onComplete={handleSplashComplete} />
        )}
        
        {appState === 'auth' && (
          <AuthPage key="auth" onAuthSuccess={handleAuthSuccess} />
        )}
        
        {appState === 'upload' && user && (
          <UploadInterface 
            key="upload" 
            onUploadComplete={handleUploadComplete}
            userId={user.id}
          />
        )}
        
        {appState === 'techniques' && (
          <LearningTechniquesCarousel 
            key="techniques" 
            onTechniqueSelect={handleTechniqueSelect}
          />
        )}
        
        {appState === 'dashboard' && selectedTechnique && (
          <div key="dashboard" className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-gildra mb-4">Dashboard Coming Soon</h1>
              <p className="text-xl text-cerebra-primary">
                {selectedTechnique.title} dashboard will be implemented next
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;