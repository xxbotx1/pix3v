import { Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface GeneratedVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  status: 'failed' | 'completed';
  duration: string;
  fileSize: string;
  taskId: string;
}

interface GeneratedVideosProps {
  videos: GeneratedVideo[];
  onPlay: (videoId: string) => void;
  onDownload: (videoId: string) => void;
}

export default function GeneratedVideos({ videos, onPlay, onDownload }: GeneratedVideosProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold" data-testid="text-generated-videos">
        Generated Videos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <Card key={video.id} className="overflow-hidden hover-elevate" data-testid={`card-video-${video.id}`}>
            <div className="relative">
              {/* Video Thumbnail/Placeholder */}
              <div className="aspect-video bg-muted flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={`Video ${index + 1} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Video placeholder</p>
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={() => onPlay(video.id)}
                  data-testid={`button-play-${video.id}`}
                >
                  <Play className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm" data-testid={`text-video-title-${video.id}`}>
                  {video.title}
                </h4>
                <Badge 
                  variant={video.status === 'completed' ? 'secondary' : 'destructive'}
                  className={video.status === 'completed' ? 'bg-chart-2/10 text-chart-2 border-chart-2/20' : ''}
                  data-testid={`badge-status-${video.id}`}
                >
                  {video.status === 'completed' ? 'Ready' : 'Failed'}
                </Badge>
              </div>
              
              <div className="flex text-xs text-muted-foreground gap-4">
                <span data-testid={`text-duration-${video.id}`}>
                  {video.duration}
                </span>
                <span data-testid={`text-filesize-${video.id}`}>
                  {video.fileSize}
                </span>
                <span className="text-muted-foreground/70">
                  Task: {video.taskId.slice(-8)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onPlay(video.id)}
                  disabled={video.status === 'failed'}
                  data-testid={`button-preview-${video.id}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onDownload(video.id)}
                  disabled={video.status === 'failed'}
                  data-testid={`button-download-${video.id}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}