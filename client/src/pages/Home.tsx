import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import TransitionPrompt from '@/components/TransitionPrompt';
import VideoOptions from '@/components/VideoOptions';
import GenerateButton from '@/components/GenerateButton';
import GenerationProgress, { GenerationStep } from '@/components/GenerationProgress';
import GeneratedVideos, { GeneratedVideo } from '@/components/GeneratedVideos';
import exampleImage from '@assets/generated_images/Renaissance_reading_portrait_f743189a.png';

export default function Home() {
  // Image upload state
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [firstImageUrl, setFirstImageUrl] = useState<string>(exampleImage);
  const [lastImageUrl, setLastImageUrl] = useState<string>('');
  
  // Form state
  const [prompt, setPrompt] = useState('');
  const [videoCount, setVideoCount] = useState(3);
  const [quality, setQuality] = useState<'720p' | '1080p'>('1080p');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  
  // todo: remove mock functionality
  const [progressSteps] = useState<GenerationStep[]>([
    {
      id: 'uploading',
      title: 'Uploading Images',
      status: 'completed'
    },
    {
      id: 'preparing',
      title: 'Preparing your images',
      status: 'completed'
    },
    {
      id: 'generating',
      title: 'Generating Videos',
      status: 'in_progress',
      progress: 67
    },
    {
      id: 'completed',
      title: 'Videos are ready!',
      status: 'pending'
    }
  ]);

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

  const handleGenerate = () => {
    console.log('Generate videos triggered', {
      hasFirstImage: !!firstImageUrl,
      hasLastImage: !!lastImageUrl,
      prompt,
      videoCount,
      quality
    });
    
    setIsGenerating(true);
    setShowProgress(true);
    
    // todo: remove mock functionality - simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      const mockVideos: GeneratedVideo[] = Array.from({ length: videoCount }, (_, i) => ({
        id: `video-${i + 1}`,
        title: `Video ${i + 1}`,
        videoUrl: '#',
        status: 'completed',
        duration: quality === '1080p' ? '5.0s' : '8.0s',
        fileSize: quality === '1080p' ? '15.2MB' : '12.8MB',
        taskId: `task_${Math.random().toString(36).substr(2, 9)}`
      }));
      setGeneratedVideos(mockVideos);
    }, 3000);
  };

  const handlePlayVideo = (videoId: string) => {
    console.log(`Play video: ${videoId}`);
  };

  const handleDownloadVideo = (videoId: string) => {
    console.log(`Download video: ${videoId}`);
  };

  const canGenerate = firstImageUrl && lastImageUrl && prompt.trim();

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
              overallProgress={67}
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