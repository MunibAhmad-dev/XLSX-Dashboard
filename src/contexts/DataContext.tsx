import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRecord } from '../types';
import { calculateDaysSince } from '../utils/timeUtils';

interface DataContextType {
  records: UserRecord[];
  addRecord: (record: Omit<UserRecord, 'id' | 'dateAdded'>) => void;
  updateRecord: (id: string, record: Partial<UserRecord>) => void;
  deleteRecord: (id: string) => void;
  importRecords: (records: UserRecord[]) => void;
  clearAllRecords: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<UserRecord[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('userRecords');
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      // Update daysSinceAdded for existing records
      const updatedRecords = parsedRecords.map((record: UserRecord) => ({
        ...record,
        daysSinceAdded: calculateDaysSince(record.dateAdded)
      }));
      setRecords(updatedRecords);
    }
  }, []);

  // Save data to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('userRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<UserRecord, 'id' | 'dateAdded'>) => {
    const newRecord: UserRecord = {
      ...record,
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString().split('T')[0],
      timeAdded: new Date().toTimeString().split(' ')[0].substring(0, 5),
      daysSinceAdded: 0
    };
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (id: string, updatedRecord: Partial<UserRecord>) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { 
        ...record, 
        ...updatedRecord,
        daysSinceAdded: calculateDaysSince(updatedRecord.dateAdded || record.dateAdded)
      } : record
    ));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const importRecords = (newRecords: UserRecord[]) => {
    setRecords(prev => [...prev, ...newRecords]);
  };

  const clearAllRecords = () => {
    setRecords([]);
  };

  return (
    <DataContext.Provider value={{
      records,
      addRecord,
      updateRecord,
      deleteRecord,
      importRecords,
      clearAllRecords
    }}>
      {children}
    </DataContext.Provider>
  );
};