export interface Activity {
  id: string;
  name: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
  date: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  color: string;
}