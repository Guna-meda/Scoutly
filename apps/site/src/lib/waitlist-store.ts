import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export type SignupRecord = {
  email: string;
  kind: 'waitlist' | 'deletion';
  consentVersion: string;
  details?: string;
  at: string;
};

/** Where submissions go. Swap the implementation once hosting is chosen. */
export interface WaitlistStore {
  add(record: SignupRecord): Promise<void>;
}

/** Development store: one JSON line per submission in .data/ (git-ignored). Not for production. */
export class FileStore implements WaitlistStore {
  constructor(private readonly dir = join(process.cwd(), '.data')) {}
  async add(record: SignupRecord): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    const file = record.kind === 'deletion' ? 'deletion.jsonl' : 'waitlist.jsonl';
    await appendFile(join(this.dir, file), JSON.stringify(record) + '\n', 'utf8');
  }
}

let store: WaitlistStore | undefined;
export function getStore(): WaitlistStore {
  store ??= new FileStore();
  return store;
}
export function setStoreForTests(s: WaitlistStore | undefined) {
  store = s;
}
