import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashLoader from '@/components/SplashLoader';
import AuthPage from '@/components/AuthPage';
import UploadInterface from '@/components/UploadInterface';
import LearningTechniquesCarousel from '@/components/LearningTechniquesCarousel';
import Dashboard from '@/components/Dashboard';

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
        
        {appState === 'dashboard' && selectedTechnique && uploadedContentId && user && (
          <Dashboard 
            key="dashboard" 
            selectedTechnique={selectedTechnique}
            contentId={uploadedContentId}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;