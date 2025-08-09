import * as XLSX from 'xlsx';
import { UserRecord } from '../types';

export const exportToExcel = (data: UserRecord[], filename: string = 'user_records.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data.map(record => ({
    Name: record.name,
    Number: record.number,
    Email: record.email,
    CNIC: record.cnic,
    'Hard Copy Given': record.hardCopyGiven ? 'Yes' : 'No',
    'Date Added': record.dateAdded,
    'Time Added': record.timeAdded || '00:00',
    Notes: record.notes.replace(/<[^>]*>/g, '') // Strip HTML tags for Excel
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'User Records');
  XLSX.writeFile(workbook, filename);
};

export const saveToMasterExcel = (data: UserRecord[]) => {
  const masterFilename = 'master_records.xlsx';
  const worksheet = XLSX.utils.json_to_sheet(data.map(record => ({
    Name: record.name,
    Number: record.number,
    Email: record.email,
    CNIC: record.cnic,
    'Hard Copy Given': record.hardCopyGiven ? 'Yes' : 'No',
    'Date Added': record.dateAdded,
    'Time Added': record.timeAdded || '00:00',
    'Days Since Added': record.daysSinceAdded || 0,
    Notes: record.notes.replace(/<[^>]*>/g, '') // Strip HTML tags for Excel
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Records');
  
  // Add metadata sheet
  const metaData = [{
    'File Type': 'Master Records File',
    'Total Records': data.length,
    'Last Updated': new Date().toLocaleString(),
    'Export Date': new Date().toISOString().split('T')[0],
    'Export Time': new Date().toTimeString().split(' ')[0].substring(0, 5)
  }];
  const metaSheet = XLSX.utils.json_to_sheet(metaData);
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'File Info');
  
  XLSX.writeFile(workbook, masterFilename);
};

export const exportToNewExcel = (data: UserRecord[]) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
  const dateStr = timestamp[0];
  const timeStr = timestamp[1].substring(0, 8);
  const filename = `records_backup_${dateStr}_${timeStr}.xlsx`;
  
  exportToExcel(data, filename);
};
export const importFromExcel = (file: File): Promise<UserRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const records: UserRecord[] = jsonData.map((row: any, index: number) => ({
          id: `imported-${Date.now()}-${index}`,
          name: row.Name || '',
          number: row.Number || '',
          email: row.Email || '',
          cnic: row.CNIC || '',
          hardCopyGiven: row['Hard Copy Given'] === 'Yes',
          dateAdded: row['Date Added'] || new Date().toISOString().split('T')[0],
          timeAdded: row['Time Added'] || '00:00',
          notes: row.Notes || ''
        }));
        
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};