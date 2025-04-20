// components/LayoutWithSidebar.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserFromLocalStorage } from '../utils';
import { FaCar, FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const LayoutWithSidebar = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getUserFromLocalStorage();
    setUser(u);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-xl font-bold text-blue-600">CarApp</div>

        <nav className="space-y-3">
          <Link href="/cars" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <FaCar /> Cars
          </Link>

          <Link href="/createCar" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <FaPlus /> Create Car
          </Link>

          <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <FaUser /> Profile
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>

        {user && (
          <div className="mt-auto text-sm text-gray-500">
            Logged in as <span className="font-medium">{user.username}</span>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default LayoutWithSidebar;
