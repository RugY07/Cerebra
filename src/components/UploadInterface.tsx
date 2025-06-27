import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Image, Video, Moon, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { uploadFile, invokeLLM, extractDataFromUploadedFile } from '@/integrations/core';
import { Content } from '@/entities';

interface UploadInterfaceProps {
  onUploadComplete: (contentId: string) => void;
  userId: string;
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({ onUploadComplete, userId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (const file of files) {
        setProcessingStatus(`Uploading ${file.name}...`);
        
        // Upload file
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 5, 30));
        }, 200);
        
        const { file_url } = await uploadFile({ file });
        clearInterval(progressInterval);
        setUploadProgress(40);
        
        // Determine content type
        let contentType = 'pdf';
        if (file.type.startsWith('image/')) contentType = 'image';
        if (file.type.startsWith('video/')) contentType = 'video';
        
        // Create initial content record
        const content = await Content.create({
          title: file.name,
          content_type: contentType,
          file_url,
          processed_summary: '',
          key_concepts: [],
          processing_status: 'processing',
          learning_modules: [],
          user_id: userId
        });
        
        setUploadProgress(50);
        setProcessingStatus(`Processing ${file.name} with AI...`);
        
        // Extract and process content with AI
        let extractedContent = '';
        let keyConcepts: string[] = [];
        let summary = '';
        
        try {
          if (contentType === 'pdf' || contentType === 'image') {
            // Extract text/data from file
            const extractionResult = await extractDataFromUploadedFile({
              file_url,
              json_schema: {
                type: "object",
                properties: {
                  content: { type: "string", description: "Main text content" },
                  title: { type: "string", description: "Document title" }
                }
              }
            });
            
            if (extractionResult.status === 'success' && extractionResult.output) {
              extractedContent = extractionResult.output.content || '';
            }
          }
          
          setUploadProgress(70);
          
          // Generate AI summary and key concepts
          if (extractedContent || contentType === 'video') {
            const analysisPrompt = contentType === 'video' 
              ? `Analyze this video file "${file.name}" and provide a comprehensive learning analysis. Since I cannot directly process the video content, please provide a structured analysis based on the filename and common educational video patterns.`
              : `Analyze the following content and extract key learning concepts and create a comprehensive summary for educational purposes:

Content: ${extractedContent.substring(0, 3000)}

Please provide:
1. A detailed summary (2-3 paragraphs)
2. Key concepts and topics (5-10 items)
3. Learning objectives
4. Difficulty level assessment`;

            const analysisResult = await invokeLLM({
              prompt: analysisPrompt,
              response_json_schema: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "Comprehensive summary of the content" },
                  key_concepts: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "List of key concepts and topics"
                  },
                  learning_objectives: {
                    type: "array",
                    items: { type: "string" },
                    description: "Learning objectives"
                  },
                  difficulty_level: { type: "string", description: "Beginner, Intermediate, or Advanced" }
                }
              }
            });
            
            summary = analysisResult.summary || `AI-processed summary of ${file.name}`;
            keyConcepts = analysisResult.key_concepts || ['Key concepts extracted from content'];
          }
          
          setUploadProgress(90);
          setProcessingStatus(`Finalizing ${file.name}...`);
          
          // Update content with AI analysis
          await Content.update(content.id, {
            processed_summary: summary,
            key_concepts: keyConcepts,
            processing_status: 'completed'
          });
          
        } catch (aiError) {
          console.error('AI processing error:', aiError);
          // Fallback to basic processing
          await Content.update(content.id, {
            processed_summary: `Content from ${file.name} ready for learning`,
            key_concepts: ['Content analysis', 'Learning material', 'Educational content'],
            processing_status: 'completed'
          });
        }
        
        setUploadProgress(100);
        
        setUploadedFiles(prev => [...prev, {
          id: content.id,
          name: file.name,
          type: contentType,
          size: file.size,
          status: 'completed',
          summary: summary || `Processed content from ${file.name}`,
          concepts: keyConcepts.length
        }]);
        
        // Trigger completion
        setTimeout(() => {
          onUploadComplete(content.id);
        }, 1000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setProcessingStatus('Error processing file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStatus('');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cerebra-dark via-cerebra-navy to-cerebra-highlight p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-gildra text-white mb-4">
            Upload Your Learning Content
          </h1>
          <p className="text-xl text-cerebra-primary font-enter">
            Transform any content into an immersive learning experience
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-8">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive 
                    ? 'border-cerebra-accent bg-cerebra-accent/10' 
                    : 'border-white/30 hover:border-cerebra-primary hover:bg-white/5'
                  }
                `}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.mp4,.avi,.mov,.wmv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="space-y-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto"
                      >
                        <Brain className="w-full h-full text-cerebra-accent" />
                      </motion.div>
                      <p className="text-white font-enter">{processingStatus || 'Processing your content...'}</p>
                      <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-cerebra rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-cerebra-primary font-enter">{uploadProgress}% complete</p>
                    </motion.div>
                  ) : isDragActive ? (
                    <motion.div
                      key="dragging"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="space-y-4"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Upload className="w-16 h-16 mx-auto text-cerebra-accent" />
                      </motion.div>
                      <p className="text-xl text-white font-enter">Drop your files here</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="space-y-4"
                    >
                      <Upload className="w-16 h-16 mx-auto text-cerebra-primary" />
                      <div>
                        <p className="text-xl text-white font-enter mb-2">
                          Drag & drop your files here
                        </p>
                        <p className="text-cerebra-primary font-enter">
                          or click to browse
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4 text-sm text-white/70">
                        <span>PDF</span>
                        <span>•</span>
                        <span>Images</span>
                        <span>•</span>
                        <span>Videos</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Uploaded Files */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-gildra text-white mb-4">Processed Files</h3>
              {uploadedFiles.map((file, index) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-morphism border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileIcon className="w-8 h-8 text-cerebra-primary" />
                            <div>
                              <p className="text-white font-enter font-medium">{file.name}</p>
                              <p className="text-sm text-white/60">{formatFileSize(file.size)}</p>
                              {file.summary && (
                                <p className="text-xs text-cerebra-primary mt-1">{file.concepts} concepts extracted</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-400" />
                            )}
                            <span className="text-sm text-white/70 capitalize">{file.status}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadInterface;