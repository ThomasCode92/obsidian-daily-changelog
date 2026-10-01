export type EventType = 'create' | 'modify' | 'rename' | 'delete';

export interface FileEvent {
  type: EventType;
  path: string;
  oldPath?: string;
  timestamp: number;
}

export interface ChangelogView {
  date: string;
  created: string[];
  edited: string[];
}
