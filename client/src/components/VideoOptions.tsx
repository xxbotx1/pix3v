import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoOptionsProps {
  videoCount: number;
  onVideoCountChange: (count: number) => void;
  quality: '720p' | '1080p';
  onQualityChange: (quality: '720p' | '1080p') => void;
}

export default function VideoOptions({
  videoCount,
  onVideoCountChange,
  quality,
  onQualityChange,
}: VideoOptionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Number of Videos */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Number of Videos to Generate</Label>
        <div className="flex gap-3">
          {[1, 2, 3].map((count) => (
            <Button
              key={count}
              variant={videoCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => onVideoCountChange(count)}
              className="flex-1"
              data-testid={`button-video-count-${count}`}
            >
              {count} Video{count > 1 ? 's' : ''}
              {count === 3 && <Badge variant="secondary" className="ml-2 text-xs">Best Variety</Badge>}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {videoCount === 1 && "Fast"}
          {videoCount === 2 && "2 Videos"}  
          {videoCount === 3 && "Best Variety"}
        </p>
      </div>

      {/* Video Quality */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Video Quality & Duration</Label>
        <div className="flex gap-3">
          <Button
            variant={quality === '720p' ? "default" : "outline"}
            size="sm"
            onClick={() => onQualityChange('720p')}
            className="flex-1 flex-col h-auto py-3"
            data-testid="button-quality-720p"
          >
            <div className="font-medium">720p HD</div>
            <div className="text-xs text-muted-foreground">8 seconds</div>
            <div className="text-xs">Longer duration</div>
          </Button>
          <Button
            variant={quality === '1080p' ? "default" : "outline"}
            size="sm"
            onClick={() => onQualityChange('1080p')}
            className="flex-1 flex-col h-auto py-3"
            data-testid="button-quality-1080p"
          >
            <div className="font-medium flex items-center gap-1">
              1080p Full HD
              <Badge variant="secondary" className="text-xs">Higher quality</Badge>
            </div>
            <div className="text-xs text-muted-foreground">5 seconds</div>
            <div className="text-xs">Higher quality</div>
          </Button>
        </div>
      </div>
    </div>
  );
}