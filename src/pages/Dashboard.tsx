import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { exportToExcel, saveToMasterExcel, exportToNewExcel, importFromExcel } from '../utils/excelUtils';
import UserForm from '../components/Forms/UserForm';
import toast from 'react-hot-toast';
import { Upload, Download, FileSpreadsheet, Users, Clock, CheckCircle, Save, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { records, addRecord, importRecords } = useData();
  const [isImporting, setIsImporting] = useState(false);

  const handleAddRecord = (data: any) => {
    addRecord(data);
    toast.success('Record added successfully!');
  };

  const handleSaveToMaster = () => {
    if (records.length === 0) {
      toast.error('No records to save');
      return;
    }
    saveToMasterExcel(records);
    toast.success('Records saved to master_records.xlsx successfully!');
  };

  const handleExportToNew = () => {
    if (records.length === 0) {
      toast.error('No records to export');
      return;
    }
    exportToNewExcel(records);
    toast.success('Records exported to new Excel file successfully!');
    exportToExcel(records);
    toast.success('Records exported to Excel successfully!');
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedRecords = await importFromExcel(file);
      importRecords(importedRecords);
      toast.success(`${importedRecords.length} records imported successfully!`);
    } catch (error) {
      toast.error('Error importing Excel file');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const totalRecords = records.length;
  const hardCopyGiven = records.filter(r => r.hardCopyGiven).length;
  const recentRecords = records.filter(r => {
    const recordDate = new Date(r.dateAdded);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - recordDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveToMaster}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save to Master Excel
          </button>
          <button
            onClick={handleExportToNew}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Export to New Excel
          </button>
          <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hard Copy Given</p>
              <p className="text-2xl font-bold text-gray-900">{hardCopyGiven}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
              <p className="text-2xl font-bold text-gray-900">{recentRecords}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRecords > 0 ? Math.round((hardCopyGiven / totalRecords) * 100) : 0}%
              </p>
            </div>
            <FileSpreadsheet className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Data Persistence Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Data Recovery & Backup Strategy</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Your data is stored locally in your browser. For data recovery on Vercel:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Master File:</strong> Use "Save to Master Excel" to maintain one consistent file (master_records.xlsx)</li>
                <li><strong>Backups:</strong> Use "Export to New Excel" for timestamped backup files</li>
                <li><strong>Recovery:</strong> Import your master_records.xlsx file to restore all data</li>
                <li><strong>Best Practice:</strong> Save to master file after adding/updating records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Add New Record Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Record</h2>
        <UserForm onSubmit={handleAddRecord} />
      </div>

      {/* Recent Records Preview */}
      {records.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hard Copy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.slice(-5).reverse().map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.cnic}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.hardCopyGiven 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.hardCopyGiven ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dateAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;