import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { generateTimeTrackingData, formatTimeSpent, getStatusColor } from '../utils/timeUtils';
import { exportToNewExcel } from '../utils/excelUtils';
import { Clock, Calendar, User, TrendingUp, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const TimeTracking: React.FC = () => {
  const { records } = useData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'days' | 'status'>('days');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const timeTrackingData = useMemo(() => {
    return generateTimeTrackingData(records);
  }, [records]);

  const filteredData = useMemo(() => {
    let filtered = timeTrackingData;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'days':
          comparison = a.daysSinceAdded - b.daysSinceAdded;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [timeTrackingData, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = timeTrackingData.length;
    const active = timeTrackingData.filter(item => item.status === 'active').length;
    const completed = timeTrackingData.filter(item => item.status === 'completed').length;
    const overdue = timeTrackingData.filter(item => item.status === 'overdue').length;
    const avgDays = total > 0 ? Math.round(timeTrackingData.reduce((sum, item) => sum + item.daysSinceAdded, 0) / total) : 0;

    return { total, active, completed, overdue, avgDays };
  }, [timeTrackingData]);

  const exportTimeTrackingData = () => {
    if (filteredData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const exportData = filteredData.map(item => ({
      Name: item.name,
      Email: item.email,
      'Date Added': item.dateAdded,
      'Time Added': item.timeAdded,
      'Days Since Added': item.daysSinceAdded,
      'Hours Spent': item.hoursSpent,
      Status: item.status,
      'Last Activity': item.lastActivity
    }));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    const dateStr = timestamp[0];
    const timeStr = timestamp[1].substring(0, 8);
    const filename = `time_tracking_${dateStr}_${timeStr}.xlsx`;
    
    exportToExcel(exportData, filename);
    toast.success('Time tracking data exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
        <button
          onClick={exportTimeTrackingData}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Days</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgDays}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="days">Sort by Days</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Time Tracking Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Time Tracking Report ({filteredData.length} records)
          </h2>
        </div>

        {filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No time tracking data available</p>
            <p className="text-gray-400 mt-2">Add some records to see time tracking information</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateAdded}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timeAdded}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.daysSinceAdded} days</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimeSpent(item.hoursSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;