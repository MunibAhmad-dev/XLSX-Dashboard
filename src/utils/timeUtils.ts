import { UserRecord, TimeTrackingRecord } from '../types';

export const calculateDaysSince = (dateString: string): number => {
  const addedDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - addedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatTimeSpent = (hours: number): string => {
  if (hours < 24) {
    return `${hours} hours`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days} days${remainingHours > 0 ? ` ${remainingHours} hours` : ''}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const generateTimeTrackingData = (records: UserRecord[]): TimeTrackingRecord[] => {
  return records.map(record => {
    const daysSince = calculateDaysSince(record.dateAdded);
    const hoursSpent = daysSince * 24; // Simplified calculation
    
    let status: 'active' | 'completed' | 'overdue' = 'active';
    if (record.hardCopyGiven) {
      status = 'completed';
    } else if (daysSince > 7) {
      status = 'overdue';
    }

    return {
      id: record.id,
      name: record.name,
      email: record.email,
      dateAdded: record.dateAdded,
      timeAdded: record.timeAdded || '00:00',
      daysSinceAdded: daysSince,
      hoursSpent,
      status,
      lastActivity: record.dateAdded
    };
  });
};

export const checkForNotifications = (records: UserRecord[]): string[] => {
  const notifications: string[] = [];
  const today = new Date();
  
  records.forEach(record => {
    const daysSince = calculateDaysSince(record.dateAdded);
    
    // Notify after 1 day
    if (daysSince === 1 && !record.hardCopyGiven) {
      notifications.push(`${record.name} - 1 day completed since details added`);
    }
    
    // Notify after 7 days if still pending
    if (daysSince === 7 && !record.hardCopyGiven) {
      notifications.push(`${record.name} - 7 days completed, hard copy still pending`);
    }
    
    // Notify after 30 days
    if (daysSince === 30) {
      notifications.push(`${record.name} - 30 days completed since registration`);
    }
  });
  
  return notifications;
};