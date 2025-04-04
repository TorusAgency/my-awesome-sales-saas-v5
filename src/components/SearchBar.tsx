import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, Filter, X } from 'lucide-react';
import type { Lead, SearchHistory } from '../types';

interface SearchBarProps {
  recentLeads: Lead[];
  searchHistory: SearchHistory[];
  onSearch: (query: string) => void;
}

export function SearchBar({ recentLeads, searchHistory, onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    if (e.key === 'Enter') {
      onSearch(query);
      setIsOpen(false); // Close dropdown on search
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="search"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" // Dark mode input styles
          placeholder="Search leads..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* Recent Leads Section */}
          {recentLeads.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Leads</h3>
              <div className="mt-2 space-y-1">
                {recentLeads.slice(0, 5).map((lead) => (
                  <button
                    key={lead.id}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => {
                      setQuery(lead.name);
                      onSearch(lead.name); // Trigger search on click
                      setIsOpen(false);
                    }}
                  >
                    {lead.name} - <span className="text-gray-500 dark:text-gray-400">{lead.company}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filters Section */}
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Filters</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Add dark mode styles to filter buttons */}
              <button className="px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800">
                High Score (70+)
              </button>
              <button className="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900 rounded-full hover:bg-green-100 dark:hover:bg-green-800">
                Recent Activity
              </button>
              <button className="px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800">
                New Leads
              </button>
            </div>
          </div>

          {/* Recent Searches Section */}
          {searchHistory.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Searches</h3>
              <div className="mt-2 space-y-1">
                {searchHistory.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                    onClick={() => {
                      setQuery(item.query);
                      onSearch(item.query); // Trigger search on click
                      setIsOpen(false);
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
