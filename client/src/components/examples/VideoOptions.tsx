import { useState } from 'react';
import VideoOptions from '../VideoOptions';

export default function VideoOptionsExample() {
  const [videoCount, setVideoCount] = useState(3);
  const [quality, setQuality] = useState<'720p' | '1080p'>('1080p');

  return (
    <div className="p-6">
      <VideoOptions
        videoCount={videoCount}
        onVideoCountChange={setVideoCount}
        quality={quality}
        onQualityChange={setQuality}
      />
    </div>
  );
}