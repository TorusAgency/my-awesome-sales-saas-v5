import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';

export function SettingsView() {
  // Basic dark mode state - replace with context/global state later
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference on initial load
    // Ensure it defaults to false if localStorage item doesn't exist or isn't 'true'
    return typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true'; 
  });

  useEffect(() => {
    // Apply/remove dark class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    // TODO: Implement actual login logic (e.g., redirect, modal)
    console.log("Login action triggered");
    alert("Login functionality not implemented yet.");
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic (e.g., clear session, API call)
    console.log("Logout action triggered");
    alert("Logout functionality not implemented yet.");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Profile</h2>
        <div className="space-y-3">
          {/* TODO: Add actual profile details here */}
          <p className="text-gray-600 dark:text-gray-400">Manage your profile settings and authentication.</p>
          <div className="flex flex-col sm:flex-row gap-3">
             <button 
              onClick={handleLogin}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login (Placeholder)
            </button>
             <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout (Placeholder)
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isDarkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600' // Adjusted dark bg for toggle off state
            }`}
            aria-pressed={isDarkMode} // Accessibility improvement
          >
            <span className="sr-only">Toggle Dark Mode</span>
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
             <span className={`absolute left-1 top-1 transition-opacity ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
               <Sun className="h-4 w-4 text-yellow-500" />
             </span>
             <span className={`absolute right-1 top-1 transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
               <Moon className="h-4 w-4 text-indigo-300" />
             </span>
          </button>
        </div>
         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Toggle between light and dark themes.</p>
      </div>

      {/* Add more settings sections as needed */}

    </div>
  );
}
