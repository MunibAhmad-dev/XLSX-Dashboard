import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import NotificationCenter from '../Notifications/NotificationCenter';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard Pro</h2>
            <NotificationCenter />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;