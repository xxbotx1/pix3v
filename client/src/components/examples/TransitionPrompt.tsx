import { useState } from 'react';
import TransitionPrompt from '../TransitionPrompt';

export default function TransitionPromptExample() {
  const [prompt, setPrompt] = useState(''); // Start empty to show placeholder

  return (
    <div className="p-6">
      <TransitionPrompt
        value={prompt}
        onChange={setPrompt}
      />
    </div>
  );
}