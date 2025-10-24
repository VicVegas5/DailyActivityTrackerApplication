import { Activity } from '../types/Activity';

export const exportToCSV = (activities: Activity[], filename: string = 'activity-log.csv') => {
  const headers = ['Date', 'Category', 'Activity', 'Start Time', 'End Time', 'Duration (min)', 'Notes'];

  const csvContent = [
    headers.join(','),
    ...activities.map(activity => [
      activity.date,
      `"${activity.category}"`,
      `"${activity.activity}"`,
      activity.startTime,
      activity.endTime,
      activity.duration,
      `"${(activity.notes || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const autoExportToCSV = (activities: Activity[]) => {
  exportToCSV(activities, 'activity-log.csv');
};
