import GenerationProgress, { GenerationStep } from '../GenerationProgress';

export default function GenerationProgressExample() {
  // todo: remove mock functionality
  const mockSteps: GenerationStep[] = [
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
  ];

  return (
    <div className="p-6 max-w-md">
      <GenerationProgress 
        steps={mockSteps}
        overallProgress={67}
      />
    </div>
  );
}