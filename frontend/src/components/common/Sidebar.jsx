import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = {
    admin: [
      { path: '/admin', label: 'Dashboard' },
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/stores', label: 'Stores' },
    ],
    user: [
      { path: '/user/stores', label: 'Browse Stores' },
      { path: '/user/profile', label: 'Profile' },
    ],
    owner: [
      { path: '/owner', label: 'Dashboard' },
      { path: '/owner/ratings', label: 'Ratings' },
    ],
  };

  return (
    <div className={`h-screen bg-white shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} fixed top-0 left-0 z-40`}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => setCollapsed(!collapsed)} className="text-xl">
          <FiMenu />
        </button>
        {!collapsed && (
          <span className="text-blue-600 text-xl font-semibold">Roxiller</span>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-6">
        <ul className="space-y-2">
          {user && menuItems[user.role]?.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-md transition ${
                  location.pathname === item.path ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                {!collapsed && item.label}
                {collapsed && <div className="w-full h-1.5 bg-blue-500 rounded-full" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md transition"
        >
          <FiLogOut />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
