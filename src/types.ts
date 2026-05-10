export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  tier: 'Hub' | 'Master Node';
  syncedNodes: string[];
}

export interface SmartAnalysis {
  id: string;
  type: 'video' | 'post' | 'keyword';
  title: string;
  status: 'Node Synced' | 'Syncing...' | 'Error';
  score: number;
  prophecy: string;
  timestamp: string;
}

export interface QueueItem {
  id: string;
  platform: 'YouTube' | 'Instagram' | 'Shorts';
  content: string;
  scheduledTime: string;
  status: 'Pending' | 'Node Synced';
}
