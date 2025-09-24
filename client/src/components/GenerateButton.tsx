import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
  videoCount: number;
  quality: '720p' | '1080p';
}

export default function GenerateButton({ 
  onGenerate, 
  isLoading, 
  disabled = false,
  videoCount,
  quality 
}: GenerateButtonProps) {
  return (
    <Button
      onClick={onGenerate}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full h-12 text-base font-semibold"
      data-testid="button-generate"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating {videoCount} {quality} Full HD Video{videoCount > 1 ? 's' : ''}...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Generate {videoCount} {quality} Full HD Video{videoCount > 1 ? 's' : ''}
        </>
      )}
    </Button>
  );
}