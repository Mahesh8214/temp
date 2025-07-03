
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    // No need to navigate, the PrivateRoute will handle it.
  };

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 bg-drive-gray-100/80 dark:bg-drive-gray-950/80 backdrop-blur-sm border-b border-drive-gray-200 dark:border-drive-gray-800">
      <div className="flex-1">
        <div className="relative text-drive-gray-400 focus-within:text-drive-gray-600">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input
            type="search"
            placeholder="Search in Drive"
            className="w-full max-w-lg pl-10 pr-4 py-2 rounded-full bg-drive-gray-200 dark:bg-drive-gray-800 text-drive-gray-900 dark:text-drive-gray-200 placeholder-drive-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
          <img
            src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.email}`}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-drive-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-4 border-b border-drive-gray-200 dark:border-drive-gray-700 flex items-center space-x-3">
                <img
                    src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.email}`}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold text-drive-gray-800 dark:text-drive-gray-100">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-drive-gray-500 dark:text-drive-gray-400 truncate">{user?.email}</p>
                </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-drive-gray-700 dark:text-drive-gray-200 hover:bg-drive-gray-100 dark:hover:bg-drive-gray-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-3 text-drive-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
