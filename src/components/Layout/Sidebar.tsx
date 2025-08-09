import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Search, FileSpreadsheet, Clock } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/records', icon: Users, label: 'Records' },
    { to: '/search', icon: Search, label: 'Search & Filter' },
    { to: '/time-tracking', icon: Clock, label: 'Time Tracking' },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <FileSpreadsheet className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold">Dashboard Pro</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;