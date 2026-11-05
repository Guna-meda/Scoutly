import type { ReactNode } from 'react';
import { Bubble } from './Bubble';

export function SentNote({ children }: { children: ReactNode }) {
  return <Bubble className="sent-note">{children}</Bubble>;
}
