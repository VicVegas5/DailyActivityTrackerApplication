import { CategoryName, ActivityOption } from '../config/categories';

export interface Activity {
  id: string;
  category: CategoryName;
  activity: ActivityOption;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  date: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  color: string;
}