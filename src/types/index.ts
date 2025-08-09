export interface UserRecord {
  id: string;
  name: string;
  number: string;
  email: string;
  cnic: string;
  hardCopyGiven: boolean;
  dateAdded: string;
  timeAdded: string;
  notes: string;
  daysSinceAdded?: number;
}

export interface FilterOptions {
  searchTerm: string;
  filterBy: 'all' | 'name' | 'email' | 'cnic';
  hardCopyFilter: 'all' | 'given' | 'not-given';
}

export interface TimeTrackingRecord {
  id: string;
  name: string;
  email: string;
  dateAdded: string;
  timeAdded: string;
  daysSinceAdded: number;
  hoursSpent: number;
  status: 'active' | 'completed' | 'overdue';
  lastActivity: string;
}

export interface NotificationSettings {
  enableDailyReminders: boolean;
  reminderDays: number[];
  emailNotifications: boolean;
  adminEmail: string;
}