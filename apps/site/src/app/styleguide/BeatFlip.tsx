'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Styleguide-only control. Receives the three server-rendered stacks (one per beat) and shows the
 * chosen one, so none of the device code ships as client JS.
 */
export function BeatFlip({ stacks, labels }: { stacks: ReactNode[]; labels: string[] }) {
  const [beat, setBeat] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-3">
        {labels.map((label, i) => (
          <Button
            key={label}
            variant={i === beat ? 'primary' : 'secondary'}
            aria-pressed={i === beat}
            onClick={() => setBeat(i)}
          >
            {label}
          </Button>
        ))}
      </div>
      {stacks[beat]}
    </div>
  );
}
