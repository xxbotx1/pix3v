import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Upload, Loader2 } from 'lucide-react';

export interface GenerationStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress?: number;
}

interface GenerationProgressProps {
  steps: GenerationStep[];
  overallProgress: number;
}

export default function GenerationProgress({ steps, overallProgress }: GenerationProgressProps) {
  const getStepIcon = (status: GenerationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-chart-2" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepBadge = (status: GenerationStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2" data-testid="text-generation-progress">
          Generation Progress
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium" data-testid="text-overall-progress">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" data-testid="progress-overall" />
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover-elevate"
            data-testid={`step-${step.id}`}
          >
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium" data-testid={`text-step-title-${step.id}`}>
                  {step.title}
                </h4>
                {getStepBadge(step.status)}
              </div>
              {step.status === 'in_progress' && step.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Creating AI transitions</span>
                    <span className="text-xs font-medium" data-testid={`text-step-progress-${step.id}`}>
                      {step.progress}%
                    </span>
                  </div>
                  <Progress value={step.progress} className="h-1" data-testid={`progress-step-${step.id}`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}