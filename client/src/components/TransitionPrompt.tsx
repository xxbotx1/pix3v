import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TransitionPromptProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TransitionPrompt({ 
  value, 
  onChange, 
  placeholder = "Describe how you want the images to transition. Be specific about movement, effects, and timing." 
}: TransitionPromptProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="transition-prompt" className="text-sm font-medium">
        Transition Prompt
      </Label>
      <Textarea
        id="transition-prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-20 resize-none"
        data-testid="input-transition-prompt"
      />
      <p className="text-xs text-muted-foreground">
        Describe how you want the images to transition. Be specific about movement, effects, and timing.
      </p>
    </div>
  );
}