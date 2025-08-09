import { UserRecord } from '../types';
import { calculateDaysSince } from './timeUtils';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
}

export const generateNotifications = (records: UserRecord[]): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date().toISOString();

  records.forEach(record => {
    const daysSince = calculateDaysSince(record.dateAdded);
    
    // 1 day notification
    if (daysSince >= 1 && daysSince < 2 && !record.hardCopyGiven) {
      notifications.push({
        id: `day1-${record.id}`,
        type: 'info',
        title: '1 Day Completed',
        message: `${record.name} completed 1 day since registration. Hard copy status: Pending`,
        timestamp: now,
        read: false,
        userId: record.id
      });
    }

    // 7 days warning
    if (daysSince >= 7 && daysSince < 8 && !record.hardCopyGiven) {
      notifications.push({
        id: `week1-${record.id}`,
        type: 'warning',
        title: '1 Week Overdue',
        message: `${record.name} - 7 days completed, hard copy still pending!`,
        timestamp: now,
        read: false,
        userId: record.id
      });
    }

    // 30 days milestone
    if (daysSince >= 30 && daysSince < 31) {
      notifications.push({
        id: `month1-${record.id}`,
        type: record.hardCopyGiven ? 'success' : 'error',
        title: '1 Month Milestone',
        message: `${record.name} - 30 days completed. Status: ${record.hardCopyGiven ? 'Completed' : 'Still Pending'}`,
        timestamp: now,
        read: false,
        userId: record.id
      });
    }
  });

  return notifications;
};

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'info': return '🔔';
    case 'warning': return '⚠️';
    case 'success': return '✅';
    case 'error': return '❌';
    default: return '📢';
  }
};

export const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'info': return 'border-blue-200 bg-blue-50';
    case 'warning': return 'border-yellow-200 bg-yellow-50';
    case 'success': return 'border-green-200 bg-green-50';
    case 'error': return 'border-red-200 bg-red-50';
    default: return 'border-gray-200 bg-gray-50';
  }
};