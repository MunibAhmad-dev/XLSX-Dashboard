import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { printRecord } from '../utils/printUtils';
import { exportToNewExcel } from '../utils/excelUtils';
import Modal from '../components/Modals/Modal';
import toast from 'react-hot-toast';
import { Search as SearchIcon, Filter, Download, Eye, Printer, X } from 'lucide-react';

const Search: React.FC = () => {
  const { records } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'name' | 'email' | 'cnic'>('all');
  const [hardCopyFilter, setHardCopyFilter] = useState<'all' | 'given' | 'not-given'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewingRecord, setViewingRecord] = useState<any>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // Text search filter
      const searchLower = searchTerm.toLowerCase();
      let matchesSearch = true;
      
      if (searchTerm) {
        if (filterBy === 'all') {
          matchesSearch = 
            record.name.toLowerCase().includes(searchLower) ||
            record.email.toLowerCase().includes(searchLower) ||
            record.cnic.toLowerCase().includes(searchLower) ||
            record.number.toLowerCase().includes(searchLower);
        } else if (filterBy === 'name') {
          matchesSearch = record.name.toLowerCase().includes(searchLower);
        } else if (filterBy === 'email') {
          matchesSearch = record.email.toLowerCase().includes(searchLower);
        } else if (filterBy === 'cnic') {
          matchesSearch = record.cnic.toLowerCase().includes(searchLower);
        }
      }

      // Hard copy filter
      let matchesHardCopy = true;
      if (hardCopyFilter === 'given') {
        matchesHardCopy = record.hardCopyGiven;
      } else if (hardCopyFilter === 'not-given') {
        matchesHardCopy = !record.hardCopyGiven;
      }

      // Date range filter
      let matchesDateRange = true;
      if (dateFrom || dateTo) {
        const recordDate = new Date(record.dateAdded);
        if (dateFrom) {
          matchesDateRange = matchesDateRange && recordDate >= new Date(dateFrom);
        }
        if (dateTo) {
          matchesDateRange = matchesDateRange && recordDate <= new Date(dateTo);
        }
      }

      return matchesSearch && matchesHardCopy && matchesDateRange;
    });
  }, [records, searchTerm, filterBy, hardCopyFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBy('all');
    setHardCopyFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const exportFilteredResults = () => {
    if (filteredRecords.length === 0) {
      toast.error('No records to export');
      return;
    }
    exportToNewExcel(filteredRecords);
    toast.success('Filtered records exported successfully!');
  };

  const activeFiltersCount = [
    searchTerm,
    hardCopyFilter !== 'all',
    dateFrom,
    dateTo
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Search & Filter</h1>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear Filters ({activeFiltersCount})
            </button>
          )}
          <button
            onClick={exportFilteredResults}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Results
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search In</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Fields</option>
              <option value="name">Name Only</option>
              <option value="email">Email Only</option>
              <option value="cnic">CNIC Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hard Copy Status</label>
            <select
              value={hardCopyFilter}
              onChange={(e) => setHardCopyFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Records</option>
              <option value="given">Hard Copy Given</option>
              <option value="not-given">Hard Copy Not Given</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Active Filters
            </label>
            <div className="text-sm text-gray-600 py-2">
              {activeFiltersCount === 0 ? 'No filters applied' : `${activeFiltersCount} filter(s) active`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Search Results ({filteredRecords.length} of {records.length} records)
          </h2>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No records match your search criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
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
                {filteredRecords.map((record) => (
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
                          onClick={() => printRecord(record)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                onClick={() => printRecord(viewingRecord)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print Record
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Search;