import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { printRecord } from '../utils/printUtils';
import UserForm from '../components/Forms/UserForm';
import Modal from '../components/Modals/Modal';
import toast from 'react-hot-toast';
import { Edit, Trash2, Printer, Eye } from 'lucide-react';

const Records: React.FC = () => {
  const { records, updateRecord, deleteRecord } = useData();
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEditRecord = (data: any) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
      setEditingRecord(null);
      toast.success('Record updated successfully!');
    }
  };

  const handleDeleteRecord = (id: string) => {
    deleteRecord(id);
    setDeleteConfirmId(null);
    toast.success('Record deleted successfully!');
  };

  const handlePrintRecord = (record: any) => {
    printRecord(record);
    toast.success('Print dialog opened');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Records Management</h1>
        <div className="text-sm text-gray-500">
          Total Records: {records.length}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">No records available</p>
          <p className="text-gray-400 mt-2">Add records from the Dashboard to see them here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hard Copy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.number}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingRecord(record)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePrintRecord(record)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(record.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Edit Record"
        size="lg"
      >
        {editingRecord && (
          <UserForm
            initialData={editingRecord}
            onSubmit={handleEditRecord}
            onCancel={() => setEditingRecord(null)}
            submitLabel="Update Record"
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
        title="View Record"
        size="md"
      >
        {viewingRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CNIC</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.cnic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hard Copy Given</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.hardCopyGiven ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Added</label>
                <p className="mt-1 text-sm text-gray-900">{viewingRecord.dateAdded}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <div 
                className="mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]"
                dangerouslySetInnerHTML={{ __html: viewingRecord.notes || 'No notes available' }}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handlePrintRecord(viewingRecord)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print Record
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this record? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDeleteRecord(deleteConfirmId)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Records;