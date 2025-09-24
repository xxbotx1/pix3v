import GeneratedVideos, { GeneratedVideo } from '../GeneratedVideos';

export default function GeneratedVideosExample() {
  // todo: remove mock functionality
  const mockVideos: GeneratedVideo[] = [
    {
      id: 'video-1',
      title: 'Video 1',
      videoUrl: '#',
      status: 'completed',
      duration: '5.2s',
      fileSize: '12.5MB',
      taskId: 'task_abc123def456'
    },
    {
      id: 'video-2', 
      title: 'Video 2',
      videoUrl: '#',
      status: 'completed',
      duration: '5.0s', 
      fileSize: '11.8MB',
      taskId: 'task_def789ghi012'
    },
    {
      id: 'video-3',
      title: 'Video 3', 
      videoUrl: '#',
      status: 'failed',
      duration: '4.8s',
      fileSize: '10.2MB', 
      taskId: 'task_ghi345jkl678'
    }
  ];

  const handlePlay = (videoId: string) => {
    console.log(`Play video triggered: ${videoId}`);
  };

  const handleDownload = (videoId: string) => {
    console.log(`Download video triggered: ${videoId}`);
  };

  return (
    <div className="p-6">
      <GeneratedVideos
        videos={mockVideos}
        onPlay={handlePlay}
        onDownload={handleDownload}
      />
    </div>
  );
}