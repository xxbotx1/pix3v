import { useState } from 'react';
import GenerateButton from '../GenerateButton';

export default function GenerateButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    console.log('Generate videos triggered');
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="p-6 space-y-4">
      <GenerateButton
        onGenerate={handleGenerate}
        isLoading={isLoading}
        videoCount={3}
        quality="1080p"
      />
      <GenerateButton
        onGenerate={() => console.log('Disabled button')}
        isLoading={false}
        disabled={true}
        videoCount={1}
        quality="720p"
      />
    </div>
  );
}