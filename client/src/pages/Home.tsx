import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import TransitionPrompt from '@/components/TransitionPrompt';
import VideoOptions from '@/components/VideoOptions';
import GenerateButton from '@/components/GenerateButton';
import GenerationProgress, { GenerationStep } from '@/components/GenerationProgress';
import GeneratedVideos, { GeneratedVideo } from '@/components/GeneratedVideos';
import { api, APIError, statusToGeneratedVideo } from '@/lib/api';
import exampleImage from '@assets/generated_images/Renaissance_reading_portrait_f743189a.png';

export default function Home() {
  const { toast } = useToast();
  
  // Image upload state
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [firstImageUrl, setFirstImageUrl] = useState<string>('');
  const [lastImageUrl, setLastImageUrl] = useState<string>('');
  
  // Form state
  const [prompt, setPrompt] = useState('');
  const [videoCount, setVideoCount] = useState(3);
  const [quality, setQuality] = useState<'720p' | '1080p'>('1080p');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [progressSteps, setProgressSteps] = useState<GenerationStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const pollIntervalRef = useRef<number | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);

  // Helper function to convert asset URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleFirstImageChange = (file: File | null) => {
    setFirstImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFirstImageUrl(url);
    } else {
      setFirstImageUrl('');
    }
  };

  const handleLastImageChange = (file: File | null) => {
    setLastImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLastImageUrl(url);
    } else {
      setLastImageUrl('');
    }
  };
  
  // Load example image as default for first image
  useEffect(() => {
    const loadExampleImage = async () => {
      try {
        const exampleFile = await urlToFile(exampleImage, 'example-image.png');
        setFirstImage(exampleFile);
        setFirstImageUrl(URL.createObjectURL(exampleFile));
      } catch (error) {
        console.warn('Failed to load example image:', error);
      }
    };
    
    loadExampleImage();
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setShowProgress(true);
      setGeneratedVideos([]);
      
      // Initialize progress steps
      const initialSteps: GenerationStep[] = [
        { id: 'uploading', title: 'Uploading Images', status: 'in_progress' },
        { id: 'preparing', title: 'Preparing your images', status: 'pending' },
        { id: 'generating', title: 'Generating Videos', status: 'pending' },
        { id: 'completed', title: 'Videos are ready!', status: 'pending' }
      ];
      setProgressSteps(initialSteps);
      setOverallProgress(10);

      // Step 1: Always upload both images to ensure they're accessible to Freepik
      if (!firstImage || !lastImage) {
        throw new Error('Please upload both first and last images');
      }
      
      const uploadResult = await api.uploadImages([firstImage, lastImage]);
      const finalFirstImageUrl = uploadResult.firstImageUrl;
      const finalLastImageUrl = uploadResult.lastImageUrl;
      
      // Update progress: Upload complete
      setProgressSteps(prev => prev.map(step => 
        step.id === 'uploading' 
          ? { ...step, status: 'completed' }
          : step.id === 'preparing'
          ? { ...step, status: 'in_progress' }
          : step
      ));
      setOverallProgress(25);

      // Step 2: Generate videos
      const generateResult = await api.generateVideos({
        prompt,
        videoCount,
        quality,
        firstImageUrl: finalFirstImageUrl,
        lastImageUrl: finalLastImageUrl,
      });
      
      setTaskIds(generateResult.taskIds);
      
      // Update progress: Generation started
      setProgressSteps(prev => prev.map(step => 
        step.id === 'preparing' 
          ? { ...step, status: 'completed' }
          : step.id === 'generating'
          ? { ...step, status: 'in_progress', progress: 0 }
          : step
      ));
      setOverallProgress(40);
      
      // Start polling for status
      startPollingStatus(generateResult.taskIds);
      
      toast({
        title: "Videos are being generated!",
        description: `Started generating ${videoCount} videos. This may take a few minutes.`,
      });
      
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setShowProgress(false);
      
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Failed to generate videos';
        
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const startPollingStatus = (taskIds: string[]) => {
    // Clear any existing intervals
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    
    let retryCount = 0;
    const maxRetries = 3;
    const maxDuration = 10 * 60 * 1000; // 10 minutes timeout
    
    // Set overall timeout
    pollTimeoutRef.current = window.setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setIsGenerating(false);
      toast({
        title: "Generation timeout",
        description: "Video generation is taking longer than expected. Please try again.",
        variant: "destructive",
      });
    }, maxDuration) as number;
    
    pollIntervalRef.current = window.setInterval(async () => {
      try {
        const result = await api.checkBatchStatus(taskIds);
        const statuses = result.statuses;
        
        const completedCount = statuses.filter(s => s.status === 'completed' || s.status === 'failed').length;
        const totalCount = statuses.length;
        const progressPercent = Math.floor((completedCount / totalCount) * 60) + 40;
        
        setOverallProgress(progressPercent);
        
        // Update generation progress
        if (completedCount > 0) {
          setProgressSteps(prev => prev.map(step => 
            step.id === 'generating'
              ? { ...step, progress: Math.floor((completedCount / totalCount) * 100) }
              : step
          ));
        }
        
        // Check if all are complete
        if (completedCount === totalCount) {
          const videos: GeneratedVideo[] = statuses
            .map((status, index) => statusToGeneratedVideo(status, index))
            .filter((video): video is GeneratedVideo => video !== null);
          
          setGeneratedVideos(videos);
          setIsGenerating(false);
          setOverallProgress(100);
          
          setProgressSteps(prev => prev.map(step => 
            step.id === 'generating'
              ? { ...step, status: 'completed', progress: 100 }
              : step.id === 'completed'
              ? { ...step, status: 'completed' }
              : step
          ));
          
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          
          const successCount = videos.filter(v => v.status === 'completed').length;
          toast({
            title: "Videos generated!",
            description: `Successfully generated ${successCount} out of ${totalCount} videos.`,
          });
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 3000); // Poll every 3 seconds
  };
  
  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayVideo = (videoId: string) => {
    console.log(`Play video: ${videoId}`);
  };

  const handleDownloadVideo = (videoId: string) => {
    console.log(`Download video: ${videoId}`);
  };

  const canGenerate = firstImage && lastImage && prompt.trim() && !isGenerating;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-main-title">
            Transform Your Images into Stunning Video Transitions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload two images and describe your desired transition. Our AI will generate three unique videos with smooth, professional transitions.
          </p>
        </div>

        <div className="space-y-12">
          {/* Image Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              title="First Image"
              onImageChange={handleFirstImageChange}
              previewUrl={firstImageUrl}
            />
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
            <ImageUpload
              title="Last Image"
              onImageChange={handleLastImageChange}
              previewUrl={lastImageUrl}
            />
          </div>

          {/* Transition Prompt */}
          <TransitionPrompt
            value={prompt}
            onChange={setPrompt}
          />

          {/* Video Options */}
          <VideoOptions
            videoCount={videoCount}
            onVideoCountChange={setVideoCount}
            quality={quality}
            onQualityChange={setQuality}
          />

          {/* Generate Button */}
          <GenerateButton
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            disabled={!canGenerate}
            videoCount={videoCount}
            quality={quality}
          />

          {/* Generation Progress */}
          {showProgress && (
            <GenerationProgress
              steps={progressSteps}
              overallProgress={overallProgress}
            />
          )}

          {/* Generated Videos */}
          {generatedVideos.length > 0 && (
            <GeneratedVideos
              videos={generatedVideos}
              onPlay={handlePlayVideo}
              onDownload={handleDownloadVideo}
            />
          )}
        </div>
      </div>
    </div>
  );
}